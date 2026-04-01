package org.blackducks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultadoEvaluacionDTO {
    private int totalPreguntas;
    private int aciertos;
    private double calificacion;
}