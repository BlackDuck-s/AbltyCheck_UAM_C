package org.blackducks.controller;

import org.blackducks.dto.EstudianteAdminDTO;
import org.blackducks.entity.Evaluacion;
import org.blackducks.entity.Usuario;
import org.blackducks.entity.ResultadoHistorico;
import org.blackducks.repository.UsuarioRepository;
import org.blackducks.service.EvaluacionService;
import org.blackducks.service.ResultadoService;
import org.blackducks.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UsuarioService usuarioService;
    private final ResultadoService resultadoService;
    private final EvaluacionService evaluacionService;
    private final UsuarioRepository usuarioRepository;

    public AdminController(UsuarioService usuarioService, ResultadoService resultadoService, EvaluacionService evaluacionService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.resultadoService = resultadoService;
        this.evaluacionService = evaluacionService;
        this.usuarioRepository = usuarioRepository;
    }

    // ---------------------------------------------------------
    // 1. ESTADÍSTICAS (KPIs del Dashboard)
    // ---------------------------------------------------------
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticasAdmin() {
        try {
            // Lógica 100% conectada a Firebase
            int usuariosActivos = usuarioRepository.obtenerPorRol("ALUMNO").size();
            int reactivosTotales = evaluacionService.obtenerTodas().size();
            int propuestasPendientes = evaluacionService.obtenerPendientes().size();
            double precisionGlobal = resultadoService.calcularPrecisionGlobal();

            Map<String, Object> stats = Map.of(
                    "usuariosActivos", usuariosActivos,
                    "reactivosTotales", reactivosTotales,
                    "precisionGlobal", precisionGlobal,
                    "propuestasPendientes", propuestasPendientes
            );

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensaje", "Error al cargar estadísticas: " + e.getMessage()));
        }
    }

    // ---------------------------------------------------------
    // 2. TABLA DE RENDIMIENTO ESTUDIANTIL
    // ---------------------------------------------------------
    @GetMapping("/estudiantes")
    public ResponseEntity<?> obtenerRendimientoEstudiantes() {
        try {
            List<EstudianteAdminDTO> listaEstudiantes = new ArrayList<>();

            // Obtenemos alumnos reales de Firestore
            List<Usuario> alumnos = usuarioRepository.obtenerPorRol("ALUMNO");

            for (Usuario alumno : alumnos) {
                // Obtenemos historial real
                List<ResultadoHistorico> historial = resultadoService.obtenerPorUsuario(alumno.getMatricula());

                int totalPreguntas = historial.size();
                double precisionPromedio = historial.stream()
                        .mapToDouble(ResultadoHistorico::getCalificacion)
                        .average().orElse(0.0);

                listaEstudiantes.add(new EstudianteAdminDTO(
                        alumno.getId(),
                        alumno.getNombre(),
                        alumno.getMatricula(),
                        alumno.getEmail(),
                        totalPreguntas,
                        precisionPromedio
                ));
            }

            return ResponseEntity.ok(listaEstudiantes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensaje", "Error al cargar estudiantes: " + e.getMessage()));
        }
    }

    // ---------------------------------------------------------
    // 3. OBTENER PROPUESTAS PENDIENTES (Crowdsourcing)
    // ---------------------------------------------------------
    @GetMapping("/reactivos/pendientes")
    public ResponseEntity<?> obtenerReactivosPendientes() {
        try {
            // Utilizamos tu método limpio que devuelve List<Evaluacion>
            List<Evaluacion> pendientes = evaluacionService.obtenerPendientes();
            return ResponseEntity.ok(pendientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensaje", "Error al cargar pendientes: " + e.getMessage()));
        }
    }

    // ---------------------------------------------------------
    // 4. APROBAR O RECHAZAR REACTIVO
    // ---------------------------------------------------------
    @PutMapping("/reactivos/{id}/estado")
    public ResponseEntity<?> cambiarEstadoReactivo(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String nuevoEstado = body.get("estado"); // Recibirá "APROBADO" o "RECHAZADO"

            // Utilizamos tu método que ya hace el update en Firestore
            evaluacionService.actualizarEstado(id, nuevoEstado);

            return ResponseEntity.ok(Map.of("mensaje", "Propuesta " + nuevoEstado.toLowerCase() + " con éxito."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensaje", "Error al actualizar estado: " + e.getMessage()));
        }
    }
}