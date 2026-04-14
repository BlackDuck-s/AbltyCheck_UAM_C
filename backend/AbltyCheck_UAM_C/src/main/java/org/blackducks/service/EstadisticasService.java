package org.blackducks.service;

import org.blackducks.dto.RankingUsuarioDTO;
import org.blackducks.entity.Reactivo;
import org.blackducks.entity.ResultadoHistorico;
import org.blackducks.entity.Usuario;
import org.blackducks.repository.ReactivoRepository;
import org.blackducks.repository.ResultadoRepository;
import org.blackducks.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

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
}