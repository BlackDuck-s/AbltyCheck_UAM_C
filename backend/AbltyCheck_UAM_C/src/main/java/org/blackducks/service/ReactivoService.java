package org.blackducks.service;

import org.blackducks.entity.Reactivo;
import org.blackducks.repository.ReactivoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ReactivoService {

    private final ReactivoRepository reactivoRepository;

    public ReactivoService(ReactivoRepository reactivoRepository) {
        this.reactivoRepository = reactivoRepository;
    }

    public String crearReactivo(Reactivo reactivo) {
        try {
            reactivoRepository.guardarReactivo(reactivo);
            return "Reactivo guardado con éxito con ID: " + reactivo.getId();
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al guardar el reactivo en Firebase", e);
        }
    }

    public List<Reactivo> obtenerReactivosPorArea(String area) {
        try {
            return reactivoRepository.obtenerPorArea(area);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al obtener los reactivos", e);
        }
    }
}