package org.blackducks.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RespuestaReactivoDTO {
    private String reactivoId;
    private String respuestaSeleccionada;
}