package org.blackducks.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String matricula; // O email, dependiendo de cómo prefieran el login
    private String password;
}