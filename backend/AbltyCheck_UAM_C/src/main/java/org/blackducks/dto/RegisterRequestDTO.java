package org.blackducks.dto;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String matricula;
    private String nombre;
    private String email;
    private String password;
    private String rol;
}