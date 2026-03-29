package org.blackducks.entity;

import lombok.Data;
import java.util.List;

@Data
public class Reactivo {
    private String enunciado;
    private List<Opcion> opciones;

}