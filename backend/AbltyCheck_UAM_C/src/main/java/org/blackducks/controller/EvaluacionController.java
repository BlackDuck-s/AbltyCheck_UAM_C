package org.blackducks.controller;

import org.blackducks.dto.RespuestaReactivoDTO;
import org.blackducks.dto.ResultadoEvaluacionDTO;
import org.blackducks.entity.Evaluacion;
import org.blackducks.service.EvaluacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/evaluaciones")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    public EvaluacionController(EvaluacionService evaluacionService) {
        this.evaluacionService = evaluacionService;
    }

    @PostMapping
    public ResponseEntity<String> crearEvaluacion(@RequestBody Evaluacion evaluacion) {
        return ResponseEntity.ok(evaluacionService.crearEvaluacion(evaluacion));
    }

    @GetMapping
    public ResponseEntity<List<Evaluacion>> obtenerTodas() {
        return ResponseEntity.ok(evaluacionService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evaluacion> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(evaluacionService.obtenerPorId(id));
    }

    @GetMapping("/area/{area}")
    public ResponseEntity<List<Evaluacion>> obtenerPorArea(@PathVariable String area) {
        return ResponseEntity.ok(evaluacionService.obtenerPorArea(area));
    }

    @PostMapping("/{id}/evaluar")
    public ResponseEntity<ResultadoEvaluacionDTO> evaluarEvaluacion(
            @PathVariable String id,
            @RequestBody List<RespuestaReactivoDTO> respuestas
    ) {
        return ResponseEntity.ok(evaluacionService.evaluarEvaluacion(id, respuestas));
    }
}