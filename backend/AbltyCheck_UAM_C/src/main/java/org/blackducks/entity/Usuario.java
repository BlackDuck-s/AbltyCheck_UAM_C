package org.blackducks.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    private String id;
    private String matricula;
    private String email;
    private String password;
    private String rol; // "ALUMNO" o "MODERADOR"
}