package org.blackducks.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.blackducks.entity.Usuario;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class UsuarioRepository {

    private final Firestore firestore;

    public UsuarioRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public Optional<Usuario> findByMatricula(String matricula) throws ExecutionException, InterruptedException {
        // Realiza una consulta en Firebase buscando por el campo matricula
        ApiFuture<QuerySnapshot> future = firestore.collection("usuarios")
                .whereEqualTo("matricula", matricula)
                .get();

        for (QueryDocumentSnapshot document : future.get().getDocuments()) {
            return Optional.of(document.toObject(Usuario.class));
        }

        return Optional.empty();
    }

    public void guardarUsuario(Usuario usuario) throws ExecutionException, InterruptedException {
        firestore.collection("usuarios").document(usuario.getId()).set(usuario).get();
    }
}