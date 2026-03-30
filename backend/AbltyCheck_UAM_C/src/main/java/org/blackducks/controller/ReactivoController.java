package org.blackducks.controller;

import org.blackducks.entity.Reactivo;
import org.blackducks.service.ReactivoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reactivos")
public class ReactivoController {

    private final ReactivoService reactivoService;

    public ReactivoController(ReactivoService reactivoService) {
        this.reactivoService = reactivoService;
    }

    // Endpoint para guardar un nuevo reactivo (Aquí Emilio meterá el Builder después)
    @PostMapping
    public ResponseEntity<String> crearReactivo(@RequestBody Reactivo reactivo) {
        String respuesta = reactivoService.crearReactivo(reactivo);
        return ResponseEntity.ok(respuesta);
    }

    // Endpoint para que el Frontend pida las preguntas de una materia
    @GetMapping("/area/{area}")
    public ResponseEntity<List<Reactivo>> obtenerPorArea(@PathVariable String area) {
        List<Reactivo> reactivos = reactivoService.obtenerReactivosPorArea(area);
        return ResponseEntity.ok(reactivos);
    }
}