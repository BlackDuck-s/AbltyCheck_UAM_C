package org.blackducks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultadoEvaluacionDTO {
    private int totalPreguntas;
    private int aciertos;
    private double calificacion;
}