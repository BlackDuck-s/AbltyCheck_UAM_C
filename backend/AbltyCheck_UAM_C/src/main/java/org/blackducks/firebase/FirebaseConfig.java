package org.blackducks.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        try {
            // Verificamos si Firebase ya fue inicializado para evitar errores si Spring Boot reinicia el contexto
            if (FirebaseApp.getApps().isEmpty()) {

                // Con esto, Firebase buscará automáticamente la variable de entorno GOOGLE_APPLICATION_CREDENTIALS
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("🔥 ¡Firebase inicializado correctamente con ApplicationDefault!");
            }
        } catch (IOException e) {
            System.err.println("❌ ERROR: No se pudieron cargar las credenciales de Firebase. Verifica la variable GOOGLE_APPLICATION_CREDENTIALS.");
            e.printStackTrace();
        }
    }

    @Bean
    public Firestore firestore() {
        // Como ya nos aseguramos de que FirebaseApp existe arriba en init(), esto ya no fallará
        return FirestoreClient.getFirestore();
    }
}