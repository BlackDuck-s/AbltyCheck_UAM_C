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
import java.util.concurrent.ExecutionException;

@Repository
public class ReactivoRepository {

    private final Firestore firestore;

    public ReactivoRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    // Método para guardar una pregunta (Usando el objeto que Emilio arme con el Builder)
    public void guardarReactivo(Reactivo reactivo) throws ExecutionException, InterruptedException {
        firestore.collection("reactivos").document(reactivo.getId()).set(reactivo).get();
    }

    // Método para buscar preguntas por área (ej. "POO", "Bases de Datos")
    public List<Reactivo> obtenerPorArea(String area) throws ExecutionException, InterruptedException {
        CollectionReference reactivos = firestore.collection("reactivos");
        ApiFuture<QuerySnapshot> query = reactivos.whereEqualTo("area", area).get();

        List<Reactivo> lista = new ArrayList<>();
        for (QueryDocumentSnapshot document : query.get().getDocuments()) {
            lista.add(document.toObject(Reactivo.class));
        }
        return lista;
    }
}