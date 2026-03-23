package org.blackducks.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class Reactivo {
    private String id;
    private String enunciado;
    private String areaConocimiento;
    private String dificultad;
    private String autorId;

    // En NoSQL, las opciones se guardan embebidas dentro del mismo documento del Reactivo
    private List<Opcion> opciones;
}