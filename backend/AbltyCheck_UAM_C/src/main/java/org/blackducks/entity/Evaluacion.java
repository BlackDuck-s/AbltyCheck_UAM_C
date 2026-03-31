package org.blackducks.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.util.List;

@Data
@NoArgsConstructor
public class Evaluacion {
    private String id = UUID.randomUUID().toString();
    private String titulo;
    private String area;
    private String autorId;
    private String estado; // PENDIENTE, APROBADA
    private String dificultad;
    private List<Reactivo> preguntas;
}