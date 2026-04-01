package org.blackducks.controller;

import org.blackducks.entity.ResultadoHistorico;
import org.blackducks.repository.ResultadoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1/historial")
public class HistorialController {

    private final ResultadoRepository resultadoRepository;

    public HistorialController(ResultadoRepository resultadoRepository) {
        this.resultadoRepository = resultadoRepository;
    }

    @GetMapping("/mis-resultados")
    public ResponseEntity<List<ResultadoHistorico>> obtenerMisResultados() {
        try {
            // Extraemos la matrícula del token JWT
            String matricula = SecurityContextHolder.getContext().getAuthentication().getName();
            List<ResultadoHistorico> historial = resultadoRepository.obtenerPorUsuario(matricula);
            return ResponseEntity.ok(historial);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(500).build();
        }
    }
}