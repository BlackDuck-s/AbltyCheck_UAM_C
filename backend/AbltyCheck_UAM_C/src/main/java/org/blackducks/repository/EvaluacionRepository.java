package org.blackducks.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.blackducks.entity.Evaluacion;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class EvaluacionRepository {

    private static final String COLLECTION_NAME = "evaluaciones";
    private final Firestore firestore;

    public EvaluacionRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public void guardarEvaluacion(Evaluacion evaluacion) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> future = firestore.collection(COLLECTION_NAME)
                .document(evaluacion.getId())
                .set(evaluacion);
        future.get();
    }

    public List<Evaluacion> obtenerTodas() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Evaluacion> evaluaciones = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            evaluaciones.add(doc.toObject(Evaluacion.class));
        }

        return evaluaciones;
    }

    public Optional<Evaluacion> obtenerPorId(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot document = firestore.collection(COLLECTION_NAME)
                .document(id)
                .get()
                .get();

        if (document.exists()) {
            return Optional.ofNullable(document.toObject(Evaluacion.class));
        }

        return Optional.empty();
    }

    public List<Evaluacion> obtenerPorArea(String area) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("area", area)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Evaluacion> evaluaciones = new ArrayList<>();

        for (QueryDocumentSnapshot doc : documents) {
            evaluaciones.add(doc.toObject(Evaluacion.class));
        }

        return evaluaciones;
    }

    public List<Evaluacion> obtenerPorEstado(String estado) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("estado", estado)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Evaluacion> evaluaciones = new ArrayList<>();

        for (QueryDocumentSnapshot doc : documents) {
            evaluaciones.add(doc.toObject(Evaluacion.class));
        }

        return evaluaciones;
    }

    public List<Evaluacion> obtenerPorAreaYEstado(String area, String estado) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("area", area)
                .whereEqualTo("estado", estado)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Evaluacion> evaluaciones = new ArrayList<>();

        for (QueryDocumentSnapshot doc : documents) {
            evaluaciones.add(doc.toObject(Evaluacion.class));
        }

        return evaluaciones;
    }

    public void actualizarEstado(String id, String nuevoEstado) throws ExecutionException, InterruptedException {
        firestore.collection(COLLECTION_NAME)
                .document(id)
                .update("estado", nuevoEstado)
                .get();
    }
}