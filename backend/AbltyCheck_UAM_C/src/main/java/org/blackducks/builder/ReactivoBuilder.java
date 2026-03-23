package org.blackducks.builder;

import org.blackducks.entity.Opcion;
import org.blackducks.entity.Reactivo;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ReactivoBuilder {
    private String id;
    private String enunciado;
    private String areaConocimiento;
    private String dificultad;
    private String autorId;
    private List<Opcion> opciones;

    public ReactivoBuilder() {
        // Al instanciar el builder, preparamos la lista y generamos un ID único
        this.id = UUID.randomUUID().toString();
        this.opciones = new ArrayList<>();
    }

    public ReactivoBuilder conEnunciado(String enunciado) {
        this.enunciado = enunciado;
        return this; // Retornamos "this" para encadenar los métodos
    }

    public ReactivoBuilder conArea(String areaConocimiento) {
        this.areaConocimiento = areaConocimiento;
        return this;
    }

    public ReactivoBuilder conDificultad(String dificultad) {
        this.dificultad = dificultad;
        return this;
    }

    public ReactivoBuilder conAutor(String autorId) {
        this.autorId = autorId;
        return this;
    }

    public ReactivoBuilder agregarOpcion(String texto, boolean esCorrecta) {
        this.opciones.add(new Opcion(texto, esCorrecta));
        return this;
    }

    // El método final que ensambla y devuelve el producto complejo
    public Reactivo build() {
        Reactivo reactivo = new Reactivo();
        reactivo.setId(this.id);
        reactivo.setEnunciado(this.enunciado);
        reactivo.setAreaConocimiento(this.areaConocimiento);
        reactivo.setDificultad(this.dificultad);
        reactivo.setAutorId(this.autorId);
        reactivo.setOpciones(this.opciones);
        return reactivo;
    }
}