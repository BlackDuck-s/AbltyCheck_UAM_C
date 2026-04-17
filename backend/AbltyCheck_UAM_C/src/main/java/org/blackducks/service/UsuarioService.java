package org.blackducks.service;

import org.blackducks.dto.UsuarioPerfilDTO;
import org.blackducks.entity.ResultadoHistorico;
import org.blackducks.entity.Usuario;
import org.blackducks.repository.ResultadoRepository;
import org.blackducks.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ResultadoRepository resultadoRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, ResultadoRepository resultadoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.resultadoRepository = resultadoRepository;
    }

// --- MÉTODOS PARA EL PUT DE CONFIGURACIÓN ---

    public Usuario obtenerPorMatricula(String matricula) throws ExecutionException, InterruptedException {
        return usuarioRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con matrícula: " + matricula));
    }

    public void guardarUsuario(Usuario usuario) throws ExecutionException, InterruptedException {
        // Llamamos al método que ya tienes en tu UsuarioRepository nativo
        usuarioRepository.guardarUsuario(usuario);
    }

    // ---------------------------------------------------

    public UsuarioPerfilDTO obtenerPerfilPorMatricula(String matricula) throws ExecutionException, InterruptedException {
        Usuario usuario = usuarioRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UsuarioPerfilDTO perfilDTO = new UsuarioPerfilDTO();
        perfilDTO.setMatricula(usuario.getMatricula());
        perfilDTO.setNombre(usuario.getNombre());
        perfilDTO.setEmail(usuario.getEmail());
        perfilDTO.setRol(usuario.getRol());
        perfilDTO.setBiografia(usuario.getBiografia());
        perfilDTO.setCarrera(usuario.getCarrera());
        perfilDTO.setDivision(usuario.getDivision());
        perfilDTO.setUnidad(usuario.getUnidad());

        // ¡SÚPER IMPORTANTE! Pasarle la foto al DTO para que llegue a React
        perfilDTO.setFotoUrl(usuario.getFotoUrl());

        // --- MAGIA DEL RADAR ---
        List<ResultadoHistorico> historial = resultadoRepository.obtenerPorUsuario(matricula);

        // Agrupamos por área (ej. "POO") y promediamos la calificación
        Map<String, Double> radar = historial.stream()
                .collect(Collectors.groupingBy(
                        ResultadoHistorico::getArea,
                        Collectors.averagingDouble(ResultadoHistorico::getCalificacion)
                ));

        perfilDTO.setRadarSkills(radar);
        return perfilDTO;
    }
}