package org.blackducks.service;

import org.blackducks.entity.ResultadoHistorico;
import org.blackducks.repository.ResultadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ResultadoService {

    private final ResultadoRepository resultadoRepository;

    public ResultadoService(ResultadoRepository resultadoRepository) {
        this.resultadoRepository = resultadoRepository;
    }

    // 1. Obtener todo el historial de un alumno en específico (Ya lo usabas para el Radar)
    public List<ResultadoHistorico> obtenerPorUsuario(String matricula) throws ExecutionException, InterruptedException {
        return resultadoRepository.obtenerPorUsuario(matricula);
    }

    // 2. NUEVO: Calcular la precisión global de TODA la plataforma para el Dashboard Admin
    public double calcularPrecisionGlobal() throws ExecutionException, InterruptedException {
        List<ResultadoHistorico> todosLosResultados = resultadoRepository.obtenerTodos();

        if (todosLosResultados == null || todosLosResultados.isEmpty()) {
            return 0.0;
        }

        // Usamos Streams de Java para promediar la calificación de todos los exámenes
        return todosLosResultados.stream()
                .mapToDouble(ResultadoHistorico::getCalificacion)
                .average()
                .orElse(0.0);
    }
}