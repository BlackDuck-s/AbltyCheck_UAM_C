package org.blackducks.config;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.blackducks.security.JwtAuthenticationFilter;
import org.blackducks.security.CustomUserDetailsService;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Deshabilitamos CSRF porque usaremos JWT
                .csrf(AbstractHttpConfigurer::disable)

                // Habilitamos CORS para conectar con React/Vite
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Las sesiones serán sin estado (Stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configuramos las rutas públicas y privadas
                // Configuramos las rutas públicas y privadas
                .authorizeHttpRequests(auth -> auth
                        // 1. ZONA PÚBLICA (Cualquiera puede iniciar sesión o registrarse)
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // ¡ESTA ES LA LÍNEA MÁGICA QUE SE BORRÓ! (Deja pasar el saludo de React)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. ZONA EXCLUSIVA ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/evaluaciones/pendientes").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/evaluaciones/*/estado").authenticated()

                        // 3. ZONA DE CROWDSOURCING (Alumnos y Admins pueden proponer exámenes)
                        .requestMatchers(HttpMethod.POST, "/api/v1/evaluaciones").authenticated()
                        // 4. Todo lo demás (como obtenerPorArea para practicar) requiere estar logueado
                        .anyRequest().authenticated()
                )

                // Le decimos a Spring que nuestro proveedor de usuarios es CustomUserDetailsService
                .userDetailsService(userDetailsService)

                // Insertamos el filtro JWT antes que el de Spring
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Puerto para conectar con VITE
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}