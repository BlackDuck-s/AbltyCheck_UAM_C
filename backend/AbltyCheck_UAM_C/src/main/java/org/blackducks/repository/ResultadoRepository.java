package org.blackducks.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.blackducks.entity.ResultadoHistorico;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class ResultadoRepository {

    private static final String COLLECTION_NAME = "resultados";
    private final Firestore firestore;

    public ResultadoRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public void guardar(ResultadoHistorico resultado) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> future = firestore.collection(COLLECTION_NAME)
                .document(resultado.getId())
                .set(resultado);
        future.get();
    }

    public List<ResultadoHistorico> obtenerPorUsuario(String usuarioId) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("usuarioId", usuarioId)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<ResultadoHistorico> resultados = new ArrayList<>();

        for (QueryDocumentSnapshot doc : documents) {
            resultados.add(doc.toObject(ResultadoHistorico.class));
        }

        return resultados;
    }
}