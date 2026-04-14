package org.blackducks.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RankingUsuarioDTO {
    private String matricula;
    private String nombre;
    private int total; // Puede ser total de aciertos o total de aportaciones
    private String metricaExtra; // Para mandar el "Precisión: 85%"
}