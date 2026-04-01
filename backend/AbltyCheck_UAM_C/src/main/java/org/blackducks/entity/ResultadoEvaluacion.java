package org.blackducks.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ResultadoEvaluacion {
    private String id = UUID.randomUUID().toString();
    private String usuarioId; // La matrícula del alumno
    private String evaluacionId;
    private String tituloEvaluacion;
    private String areaConocimiento; // ¡Vital para tu gráfica de radar!
    private double calificacion;
    private int aciertos;
    private int totalPreguntas;
    private String fecha;
}