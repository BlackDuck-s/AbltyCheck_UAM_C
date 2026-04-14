package org.blackducks.dto;

import lombok.Data;
import java.util.Map;

@Data
public class HabitosYLogrosDTO {
    // Atributo Para el mapa de calor (Ej: {"2026-04-10": 2, "2026-04-11": 5})
    private Map<String, Integer> mapaActividad;

    // Atributo Para las tarjetas de racha actual y la mas larga
    private int rachaActual;
    private int rachaMasLarga;

    // Atributo para logros
    private int totalPreguntasResueltas;
}