package org.blackducks.dto;

import lombok.Data;

import java.util.Map;

@Data
public class UsuarioPerfilDTO {
    private String matricula;
    private String nombre;
    private String email;
    private String rol;

    // Datos del diseño de Figma
    private String biografia;
    private String carrera;
    private String division;
    private String unidad;
    private Map<String, Double> radarSkills;
}