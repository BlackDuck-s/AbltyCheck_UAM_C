package org.blackducks.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    @PostConstruct
    public void init() {
        try {
            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceAccount.json");

            if (serviceAccount == null) {
                throw new RuntimeException("No se encontró el archivo de credenciales de Firebase");
            }
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Bean
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }

}