package org.blackducks.repository;

import com.google.cloud.firestore.Firestore;
import org.blackducks.entity.Reactivo;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class ReactivoRepository {

    private final Firestore firestore;

    public ReactivoRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public String guardarReactivo(Reactivo reactivo) throws ExecutionException, InterruptedException {
        // Guarda el documento en la colección "reactivos" usando el ID generado por el Builder
        firestore.collection("reactivos").document(reactivo.getId()).set(reactivo).get();
        return reactivo.getId();
    }
}