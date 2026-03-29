package org.blackducks.builder;

import org.blackducks.entity.Opcion;
import org.blackducks.entity.Reactivo;

import java.util.ArrayList;
import java.util.List;

public class ReactivoBuilder {
    private String enunciado;
    private List<Opcion> opciones = new ArrayList<>();

    public ReactivoBuilder conEnunciado(String enunciado) {
        this.enunciado = enunciado;
        return this;
    }

    public ReactivoBuilder agregarOpcion(String texto, boolean esCorrecta) {
        this.opciones.add(new Opcion(texto, esCorrecta));
        return this;
    }

    public Reactivo build() {
        Reactivo reactivo = new Reactivo();
        reactivo.setEnunciado(this.enunciado);
        reactivo.setOpciones(this.opciones);
        return reactivo;
    }
}