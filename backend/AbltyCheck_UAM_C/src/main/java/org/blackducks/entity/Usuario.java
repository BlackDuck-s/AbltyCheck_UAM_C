package org.blackducks.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    private String id = UUID.randomUUID().toString();

    @Column(unique = true, nullable = false)
    private String matricula;

    @Column(nullable = false)
    private String nombre; // Para mostrar en el apartado de PERFIL

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String rol; // ALUMNO o ADMIN


    @Column(length = 500)
    private String biografia; // Ej: "Estudiante apasionado por el desarrollo..."

    private String carrera; // Ej: "Ing. en Computación"

    private String division; // Ej: "DCNI"

    private String unidad; // Ej: "UAM Cuajimalpa"
}