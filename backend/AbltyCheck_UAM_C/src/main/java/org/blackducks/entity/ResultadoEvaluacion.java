package org.blackducks.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "resultados_evaluacion")
@Data
@NoArgsConstructor
public class ResultadoEvaluacion {

    @Id
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private String usuarioId;

    @Column(nullable = false)
    private String evaluacionId;

    private String tituloEvaluacion;

    // Este campo es el que alimentará las puntas de tu Gráfica de Radar
    private String areaConocimiento;

    private double calificacion;

    // Estos dos campos son los que alimentan la métrica de "Precisión" en el Top Global
    private int aciertos;
    private int totalPreguntas;

    // Usamos LocalDateTime para poder ordenar cronológicamente sin problemas
    private LocalDateTime fecha = LocalDateTime.now();
}