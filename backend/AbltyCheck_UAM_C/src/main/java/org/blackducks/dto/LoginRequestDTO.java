package org.blackducks.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String matricula;
    private String password;
}