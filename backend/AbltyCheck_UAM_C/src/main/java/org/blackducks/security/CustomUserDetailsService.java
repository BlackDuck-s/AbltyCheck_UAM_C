package org.blackducks.security;

import org.blackducks.entity.Usuario;
import org.blackducks.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String matricula) throws UsernameNotFoundException {
        try {
            Usuario usuario = usuarioRepository.findByMatricula(matricula)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con matrícula: " + matricula));

            // Traducimos nuestro Usuario de Firebase al UserDetails de Spring Security
            return User.builder()
                    .username(usuario.getMatricula())
                    .password(usuario.getPassword())
                    .roles(usuario.getRol()) // Esto asignará ROLE_ALUMNO o ROLE_MODERADOR
                    .build();

        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error al consultar Firebase", e);
        }
    }
}