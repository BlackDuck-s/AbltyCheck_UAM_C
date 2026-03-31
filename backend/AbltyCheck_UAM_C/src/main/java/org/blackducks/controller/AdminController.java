package org.blackducks.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    // 1. Obtener todas las preguntas que están "PENDIENTES" de revisión
    @GetMapping("/reactivos/pendientes")
    public ResponseEntity<?> obtenerReactivosPendientes() {
        // Lógica: Ir a Firebase y traer reactivos con estado = "PENDIENTE"
        return ResponseEntity.ok("Lista de pendientes...");
    }

    // 2. Aprobar o rechazar un reactivo
    @PutMapping("/reactivos/{id}/estado")
    public ResponseEntity<?> cambiarEstadoReactivo(@PathVariable String id, @RequestParam String nuevoEstado) {
        // Lógica: Buscar el reactivo en Firebase y cambiarle el estado a "APROBADO" o "RECHAZADO"
        return ResponseEntity.ok("Reactivo " + id + " actualizado a " + nuevoEstado);
    }

    // 3. Cambiar el rol de un usuario (Hacer a otro alumno Admin)
    @PutMapping("/usuarios/{matricula}/rol")
    public ResponseEntity<?> cambiarRolUsuario(@PathVariable String matricula, @RequestParam String nuevoRol) {
        // Lógica: Buscar al alumno en Firebase y cambiarle el campo 'rol' a 'ADMIN'
        return ResponseEntity.ok("Usuario " + matricula + " ahora es " + nuevoRol);
    }
}