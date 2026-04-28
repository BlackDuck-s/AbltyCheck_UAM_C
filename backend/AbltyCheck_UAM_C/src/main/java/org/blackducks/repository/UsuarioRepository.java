package org.blackducks.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.blackducks.entity.Usuario;
import org.springframework.stereotype.Repository;
import com.google.cloud.firestore.WriteBatch;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class UsuarioRepository {

    private final Firestore firestore;

    public UsuarioRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public Optional<Usuario> findByMatricula(String matricula) throws ExecutionException, InterruptedException {
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

    // --- NUEVO MÉTODO PARA LOS RANKINGS ---
    public List<Usuario> obtenerTodos() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("usuarios").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Usuario> usuarios = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            usuarios.add(document.toObject(Usuario.class));
        }

        return usuarios;
    }

    public List<Usuario> obtenerPorRol(String rol) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("usuarios")
                .whereEqualTo("rol", rol)
                .get();

        List<Usuario> usuarios = new ArrayList<>();
        for (QueryDocumentSnapshot document : future.get().getDocuments()) {
            usuarios.add(document.toObject(Usuario.class));
        }
        return usuarios;
    }

    public String eliminarUsuarioYDependencias(String matricula) {
        try {
            // 1. Iniciamos el Batch (Transacción atómica)
            WriteBatch batch = firestore.batch();

            // 2. Buscar y encolar la eliminación del Usuario
            QuerySnapshot usuarioQuery = firestore.collection("usuarios")
                    .whereEqualTo("matricula", matricula)
                    .get().get();

            if (usuarioQuery.isEmpty()) {
                return "Usuario no encontrado";
            }

            String usuarioId = usuarioQuery.getDocuments().get(0).getId();
            batch.delete(firestore.collection("usuarios").document(usuarioId));

            // 3. Buscar y encolar la eliminación de su Historial (Resultados)
            QuerySnapshot resultadosQuery = firestore.collection("resultados")
                    .whereEqualTo("usuarioId", matricula) // Asegúrate de que este campo se llama así en tu BD
                    .get().get();

            for (QueryDocumentSnapshot doc : resultadosQuery.getDocuments()) {
                batch.delete(doc.getReference());
            }

            // 4. (Opcional) Si quieres borrar las propuestas de Crowdsourcing que hizo y siguen pendientes
            QuerySnapshot crowdsourcingQuery = firestore.collection("evaluaciones")
                    .whereEqualTo("autorId", matricula)
                    .whereEqualTo("estado", "PENDIENTE")
                    .get().get();

            for (QueryDocumentSnapshot doc : crowdsourcingQuery.getDocuments()) {
                batch.delete(doc.getReference());
            }

            // 5. Ejecutar el Batch (Todo se borra al mismo tiempo)
            batch.commit().get();

            return "Usuario " + matricula + " y todo su historial han sido eliminados correctamente.";

        } catch (Exception e) {
            throw new RuntimeException("Error al realizar la eliminación en cascada: " + e.getMessage());
        }
    }

}