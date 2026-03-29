package org.blackducks.entity;

import lombok.Data;
import org.blackducks.entity.Reactivo;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class Evaluacion {
    private String id;
    private String titulo;
    private String area;
    private String autorId;
    private String estado; // PENDIENTE, APROBADA
    private List<Reactivo> preguntas;
}