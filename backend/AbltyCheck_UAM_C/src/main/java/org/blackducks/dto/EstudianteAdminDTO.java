package org.blackducks.dto;

public class EstudianteAdminDTO {
    private String id;
    private String nombre;
    private String matricula;
    private String email;
    private int preguntasResueltas;
    private double precision;

    // Constructores
    public EstudianteAdminDTO() {}

    public EstudianteAdminDTO(String id, String nombre, String matricula, String email, int preguntasResueltas, double precision) {
        this.id = id;
        this.nombre = nombre;
        this.matricula = matricula;
        this.email = email;
        this.preguntasResueltas = preguntasResueltas;
        this.precision = precision;
    }

    // Agrega tus Getters y Setters aquí...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getPreguntasResueltas() { return preguntasResueltas; }
    public void setPreguntasResueltas(int preguntasResueltas) { this.preguntasResueltas = preguntasResueltas; }
    public double getPrecision() { return precision; }
    public void setPrecision(double precision) { this.precision = precision; }
}