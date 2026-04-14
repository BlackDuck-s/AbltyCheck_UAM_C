package org.blackducks.service;

import org.blackducks.dto.HabitosYLogrosDTO;
import org.blackducks.dto.RankingUsuarioDTO;
import org.blackducks.entity.Reactivo;
import org.blackducks.entity.ResultadoHistorico;
import org.blackducks.entity.Usuario;
import org.blackducks.repository.ReactivoRepository;
import org.blackducks.repository.ResultadoRepository;
import org.blackducks.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class EstadisticasService {

    private final UsuarioRepository usuarioRepository;
    private final ResultadoRepository resultadoRepository;
    private final ReactivoRepository reactivoRepository;

    public EstadisticasService(UsuarioRepository usuarioRepository, ResultadoRepository resultadoRepository, ReactivoRepository reactivoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.resultadoRepository = resultadoRepository;
        this.reactivoRepository = reactivoRepository;
    }

    public List<RankingUsuarioDTO> obtenerTopResueltas(int limite) throws ExecutionException, InterruptedException {
        // 1. Traer a todos los usuarios
        List<Usuario> usuarios = usuarioRepository.obtenerTodos(); // Debes crear este método en tu repo
        List<RankingUsuarioDTO> ranking = new ArrayList<>();

        // 2. Calcular precisión y aciertos por usuario
        for (Usuario u : usuarios) {
            List<ResultadoHistorico> historial = resultadoRepository.obtenerPorUsuario(u.getMatricula());

            if (!historial.isEmpty()) {
                int totalAciertos = historial.stream().mapToInt(ResultadoHistorico::getAciertos).sum();
                int totalPreguntas = historial.stream().mapToInt(ResultadoHistorico::getTotalPreguntas).sum();

                int precision = totalPreguntas == 0 ? 0 : (int) (((double) totalAciertos / totalPreguntas) * 100);

                ranking.add(new RankingUsuarioDTO(
                        u.getMatricula(),
                        u.getNombre(),
                        totalAciertos,
                        "Precisión: " + precision + "%"
                ));
            }
        }

        // 3. Ordenar de mayor a menor y limitar
        return ranking.stream()
                .sorted((a, b) -> Integer.compare(b.getTotal(), a.getTotal()))
                .limit(limite)
                .collect(Collectors.toList());
    }

    public List<RankingUsuarioDTO> obtenerTopCrowdsourcing(int limite) throws ExecutionException, InterruptedException {
        List<Usuario> usuarios = usuarioRepository.obtenerTodos();
        List<Reactivo> todosLosReactivos = reactivoRepository.obtenerTodos(); // Debes crear este método

        // Agrupar reactivos por autorId (matrícula)
        Map<String, Long> aportacionesPorUsuario = todosLosReactivos.stream()
                .filter(r -> r.getAutorId() != null)
                .collect(Collectors.groupingBy(Reactivo::getAutorId, Collectors.counting()));

        List<RankingUsuarioDTO> ranking = new ArrayList<>();

        for (Usuario u : usuarios) {
            long totalAportes = aportacionesPorUsuario.getOrDefault(u.getMatricula(), 0L);
            if (totalAportes > 0) {
                ranking.add(new RankingUsuarioDTO(
                        u.getMatricula(),
                        u.getNombre(),
                        (int) totalAportes,
                        "Ranking crowdsourcing"
                ));
            }
        }

        return ranking.stream()
                .sorted((a, b) -> Integer.compare(b.getTotal(), a.getTotal()))
                .limit(limite)
                .collect(Collectors.toList());
    }

    public HabitosYLogrosDTO obtenerHabitosYLogros(String matricula) throws ExecutionException, InterruptedException {
        // 1. Traer todo el historial del alumno
        List<ResultadoHistorico> historial = resultadoRepository.obtenerPorUsuario(matricula);

        HabitosYLogrosDTO dto = new HabitosYLogrosDTO();

        if (historial.isEmpty()) {
            dto.setMapaActividad(new HashMap<>());
            dto.setRachaActual(0);
            dto.setRachaMasLarga(0);
            dto.setTotalPreguntasResueltas(0);
            return dto;
        }

        // 2. Calcular Total de Preguntas (Para las Medallas)
        int totalPreguntas = historial.stream()
                .mapToInt(ResultadoHistorico::getTotalPreguntas) // O getAciertos(), según la regla de tu medalla
                .sum();
        dto.setTotalPreguntasResueltas(totalPreguntas);

        // 3. Procesar Fechas para el Mapa de Calor y las Rachas
        Map<String, Integer> actividadDiaria = new HashMap<>();
        Set<LocalDate> diasActivos = new TreeSet<>(); // TreeSet los mantiene ordenados

        for (ResultadoHistorico res : historial) {
            // Asumiendo que la fecha viene como "2026-04-14T15:24:32"
            // Cortamos en la 'T' para quedarnos solo con el "YYYY-MM-DD"
            String fechaCorta = res.getFecha().split("T")[0];
            LocalDate fecha = LocalDate.parse(fechaCorta);

            diasActivos.add(fecha);

            // Sumamos 1 a la actividad de ese día (para el GitHub graph)
            actividadDiaria.put(fechaCorta, actividadDiaria.getOrDefault(fechaCorta, 0) + 1);
        }

        dto.setMapaActividad(actividadDiaria);

        // 4. Algoritmo de Racha Más Larga y Racha Actual
        List<LocalDate> diasOrdenados = new ArrayList<>(diasActivos);
        int maxRacha = 1;
        int rachaTemp = 1;

        // Calculamos la racha más larga
        for (int i = 1; i < diasOrdenados.size(); i++) {
            if (ChronoUnit.DAYS.between(diasOrdenados.get(i - 1), diasOrdenados.get(i)) == 1) {
                rachaTemp++;
                maxRacha = Math.max(maxRacha, rachaTemp);
            } else {
                rachaTemp = 1;
            }
        }
        dto.setRachaMasLarga(diasOrdenados.isEmpty() ? 0 : maxRacha);

        // Calculamos la racha actual
        int rachaActual = 0;
        LocalDate hoy = LocalDate.now();
        LocalDate ayer = hoy.minusDays(1);

        // Si el usuario practicó hoy o ayer, tiene la racha viva
        if (diasActivos.contains(hoy) || diasActivos.contains(ayer)) {
            rachaActual = 1;
            LocalDate diaCheck = diasActivos.contains(hoy) ? hoy : ayer;

            // Contamos hacia atrás a ver cuántos días seguidos lleva
            while (diasActivos.contains(diaCheck.minusDays(1))) {
                rachaActual++;
                diaCheck = diaCheck.minusDays(1);
            }
        }
        dto.setRachaActual(rachaActual);

        return dto;
    }
}