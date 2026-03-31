package org.blackducks.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.util.List;

@Data
@NoArgsConstructor
public class Reactivo {
    private String id = UUID.randomUUID().toString();
    private String enunciado;
    private String areaConocimiento;
    private String dificultad;
    private String autorId;
    private List<Opcion> opciones;
}