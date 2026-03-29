package org.blackducks.builder;

import org.blackducks.entity.Evaluacion;
import org.blackducks.entity.Reactivo;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class EvaluacionBuilder {
    private String id;
    private String titulo;
    private String area;
    private String autorId;
    private String estado = "PENDIENTE"; // Por defecto, pasa al panel de moderación
    private List<Reactivo> preguntas = new ArrayList<>();

    public EvaluacionBuilder() {
        // Generamos el ID automático para Firebase desde que nace el carrito vacío
        this.id = UUID.randomUUID().toString();
    }

    public EvaluacionBuilder conTitulo(String titulo) {
        this.titulo = titulo;
        return this;
    }

    public EvaluacionBuilder conArea(String area) {
        this.area = area;
        return this;
    }

    public EvaluacionBuilder conAutorId(String autorId) {
        this.autorId = autorId;
        return this;
    }

    public EvaluacionBuilder conEstado(String estado) {
        this.estado = estado;
        return this;
    }

    // El método clave: recibe un Reactivo ya armado y lo mete a la lista del examen
    public EvaluacionBuilder agregarPregunta(Reactivo reactivo) {
        this.preguntas.add(reactivo);
        return this;
    }

    public Evaluacion build() {
        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setId(this.id);
        evaluacion.setTitulo(this.titulo);
        evaluacion.setArea(this.area);
        evaluacion.setAutorId(this.autorId);
        evaluacion.setEstado(this.estado);
        evaluacion.setPreguntas(this.preguntas);
        return evaluacion;
    }
}