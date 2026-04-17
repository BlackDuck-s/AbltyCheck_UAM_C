package org.blackducks.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.blackducks.entity.Reactivo;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Repository
public class ReactivoRepository {

    private final Firestore firestore;

    public ReactivoRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public void guardarReactivo(Reactivo reactivo) throws ExecutionException, InterruptedException {
        firestore.collection("reactivos").document(reactivo.getId()).set(reactivo).get();
    }

    public List<Reactivo> obtenerPorArea(String area) throws ExecutionException, InterruptedException {
        CollectionReference reactivos = firestore.collection("reactivos");
        ApiFuture<QuerySnapshot> query = reactivos.whereEqualTo("area", area).get();

        List<Reactivo> lista = new ArrayList<>();
        for (QueryDocumentSnapshot document : query.get().getDocuments()) {
            lista.add(document.toObject(Reactivo.class));
        }
        return lista;
    }

    public List<Reactivo> obtenerTodos() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("reactivos").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Reactivo> reactivos = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            reactivos.add(document.toObject(Reactivo.class));
        }

        return reactivos;
    }

    public List<Map<String, Object>> obtenerPendientes() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("evaluaciones")
                .whereEqualTo("estado", "PENDIENTE")
                .get();

        List<Map<String, Object>> pendientes = new ArrayList<>();
        for (QueryDocumentSnapshot document : future.get().getDocuments()) {
            Map<String, Object> eval = document.getData();
            eval.put("id", document.getId()); // Inyectamos el ID de Firestore
            pendientes.add(eval);
        }
        return pendientes;
    }

    public void actualizarEstado(String id, String nuevoEstado) throws ExecutionException, InterruptedException {
        firestore.collection("evaluaciones").document(id).update("estado", nuevoEstado).get();
    }
}