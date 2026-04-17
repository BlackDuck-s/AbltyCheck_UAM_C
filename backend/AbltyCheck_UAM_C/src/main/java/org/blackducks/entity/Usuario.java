package org.blackducks.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    private String id = UUID.randomUUID().toString();
    private String matricula;
    private String nombre;
    private String email;
    private String password;
    private String rol;
    private String fotoUrl;
    private String biografia;
    private String carrera;
    private String division;
    private String unidad;

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
}