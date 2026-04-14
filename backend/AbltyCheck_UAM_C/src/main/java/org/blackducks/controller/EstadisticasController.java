package org.blackducks.controller;

import org.blackducks.dto.RankingUsuarioDTO;
import org.blackducks.service.EstadisticasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/estadisticas")
public class EstadisticasController {

    private final EstadisticasService estadisticasService;

    public EstadisticasController(EstadisticasService estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    @GetMapping("/ranking/resueltas")
    public ResponseEntity<List<RankingUsuarioDTO>> getTopResueltas(@RequestParam(defaultValue = "10") int limit) {
        try {
            return ResponseEntity.ok(estadisticasService.obtenerTopResueltas(limit));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/ranking/aportaciones")
    public ResponseEntity<List<RankingUsuarioDTO>> getTopAportaciones(@RequestParam(defaultValue = "10") int limit) {
        try {
            return ResponseEntity.ok(estadisticasService.obtenerTopCrowdsourcing(limit));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}