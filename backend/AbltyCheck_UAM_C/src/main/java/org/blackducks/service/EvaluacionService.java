package org.blackducks.service;

import org.blackducks.dto.RespuestaReactivoDTO;
import org.blackducks.dto.ResultadoEvaluacionDTO;
import org.blackducks.entity.*;
import org.blackducks.repository.EvaluacionRepository;
import org.blackducks.repository.ResultadoRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;
    private final ResultadoRepository resultadoRepository;

    public EvaluacionService(EvaluacionRepository evaluacionRepository, ResultadoRepository resultadoRepository) {
        this.evaluacionRepository = evaluacionRepository;
        this.resultadoRepository = resultadoRepository;
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
}