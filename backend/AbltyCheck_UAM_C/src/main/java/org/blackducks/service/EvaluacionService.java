package org.blackducks.service;

import com.google.cloud.firestore.Firestore;
import org.blackducks.dto.RespuestaReactivoDTO;
import org.blackducks.dto.ResultadoEvaluacionDTO;
import org.blackducks.entity.*;
import org.blackducks.repository.EvaluacionRepository;
import org.blackducks.repository.ResultadoRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.WriteBatch;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.QueryDocumentSnapshot;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;
    private final ResultadoRepository resultadoRepository;
    private final Firestore firestore;


    public EvaluacionService(EvaluacionRepository evaluacionRepository, ResultadoRepository resultadoRepository, Firestore firestore) {
        this.evaluacionRepository = evaluacionRepository;
        this.resultadoRepository = resultadoRepository;
        this.firestore = firestore;
    }


    public String crearEvaluacion(Evaluacion evaluacion) {
        try {
            evaluacionRepository.guardarEvaluacion(evaluacion);
            return "Evaluación guardada con éxito con ID: " + evaluacion.getId();
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al guardar la evaluación", e);
        }
    }

    public List<Evaluacion> obtenerTodas() {
        try {
            return evaluacionRepository.obtenerTodas();
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al obtener evaluaciones", e);
        }
    }

    public Evaluacion obtenerPorId(String id) {
        try {
            return evaluacionRepository.obtenerPorId(id)
                    .orElseThrow(() -> new RuntimeException("Evaluación no encontrada con ID: " + id));
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error de conexión con Firebase al buscar ID: " + id, e);
        }
    }

    public List<Evaluacion> obtenerPorArea(String area) {
        try {
            return evaluacionRepository.obtenerPorAreaYEstado(area, "APROBADA");
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al obtener evaluaciones aprobadas por área", e);
        }
    }

    public List<Evaluacion> obtenerPendientes() {
        try {
            return evaluacionRepository.obtenerPorEstado("PENDIENTE");
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al obtener evaluaciones pendientes", e);
        }
    }



    public String actualizarEstado(String id, String estado) {
        try {
            evaluacionRepository.actualizarEstado(id, estado);
            return "Estado actualizado correctamente";
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al actualizar estado", e);
        }
    }

    public ResultadoEvaluacionDTO evaluarEvaluacion(String id, List<RespuestaReactivoDTO> respuestas) {
        try {
            Evaluacion evaluacion = evaluacionRepository.obtenerPorId(id)
                    .orElseThrow(() -> new RuntimeException("Evaluación no encontrada con ID: " + id));

            int totalPreguntas = evaluacion.getPreguntas().size();
            int aciertos = 0;

            for (Reactivo reactivo : evaluacion.getPreguntas()) {
                String respuestaCorrecta = null;

                for (Opcion opcion : reactivo.getOpciones()) {
                    if (opcion.isEsCorrecta()) {
                        respuestaCorrecta = opcion.getTexto();
                        break;
                    }
                }

                if (respuestaCorrecta == null) {
                    continue;
                }

                for (RespuestaReactivoDTO respuesta : respuestas) {
                    if (reactivo.getId().equals(respuesta.getReactivoId())
                            && respuestaCorrecta.equalsIgnoreCase(respuesta.getRespuestaSeleccionada())) {
                        aciertos++;
                        break;
                    }
                }
            }

            double calificacion = totalPreguntas == 0 ? 0.0 : ((double) aciertos / totalPreguntas) * 100.0;
            String matricula = SecurityContextHolder.getContext().getAuthentication().getName();

            ResultadoHistorico historico = new ResultadoHistorico();
            historico.setUsuarioId(matricula);
            historico.setEvaluacionId(evaluacion.getId());
            historico.setTitulo(evaluacion.getTitulo());
            historico.setArea(evaluacion.getArea());
            historico.setCalificacion(calificacion);
            historico.setAciertos(aciertos);
            historico.setTotalPreguntas(totalPreguntas);
            historico.setDificultad(evaluacion.getDificultad());
            resultadoRepository.guardar(historico);
            return new ResultadoEvaluacionDTO(totalPreguntas, aciertos, calificacion);

        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al evaluar la evaluación", e);
        }
    }

    public List<Evaluacion> obtenerPorEstado(String estado) {
        try {
            return evaluacionRepository.obtenerPorEstado(estado);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al obtener evaluaciones con estado: " + estado, e);
        }
    }

    public String actualizarCompleta(Evaluacion evaluacionActualizada) {
        try {
            // Reutilizamos el método de guardar, ya que Firestore .set() sobrescribe el documento
            evaluacionRepository.guardarEvaluacion(evaluacionActualizada);
            return "Evaluación actualizada correctamente en Firebase";
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al actualizar la evaluación completa", e);
        }
    }

    public String eliminarEvaluacionYResultados(String evaluacionId) {
        try {
            // 1. Iniciamos el Batch
            WriteBatch batch = evaluacionRepository.getFirestore().batch();

            // 2. Encolar la eliminación de la Evaluación (Reactivo)
            batch.delete(evaluacionRepository.getFirestore().collection("evaluaciones").document(evaluacionId));

            // 3. Buscar y encolar la eliminación de todos los RESULTADOS que tengan este evaluacionId
            QuerySnapshot resultadosQuery = evaluacionRepository.getFirestore().collection("resultados")
                    .whereEqualTo("evaluacionId", evaluacionId)
                    .get().get();

            for (QueryDocumentSnapshot doc : resultadosQuery.getDocuments()) {
                batch.delete(doc.getReference());
            }

            // 4. Ejecutar el Batch atómico
            batch.commit().get();

            return "Evaluación y " + resultadosQuery.size() + " resultados históricos eliminados correctamente.";

        } catch (Exception e) {
            throw new RuntimeException("Error al realizar la eliminación en cascada del reactivo: " + e.getMessage());
        }
    }
}