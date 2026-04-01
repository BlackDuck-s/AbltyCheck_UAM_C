package org.blackducks.entity;

import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
public class ResultadoHistorico {
    private String id = UUID.randomUUID().toString();
    private String usuarioId;
    private String evaluacionId;
    private String titulo;
    private String area;
    private double calificacion;
    private int aciertos;
    private int totalPreguntas;
    private String fecha = LocalDateTime.now().toString();
    private String dificultad;
}