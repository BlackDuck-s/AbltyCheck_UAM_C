package org.blackducks.service;

import org.blackducks.dto.AuthResponseDTO;
import org.blackducks.dto.LoginRequestDTO;
import org.blackducks.dto.RegisterRequestDTO;
import org.blackducks.entity.Usuario;
import org.blackducks.repository.UsuarioRepository;
import org.blackducks.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponseDTO register(RegisterRequestDTO request) throws ExecutionException, InterruptedException {
        // 1. Verificar si el alumno ya está registrado
        Optional<Usuario> usuarioExistente = usuarioRepository.findByMatricula(request.getMatricula());
        if (usuarioExistente.isPresent()) {
            throw new RuntimeException("La matrícula ya está registrada en el sistema");
        }

        // 2. Crear el nuevo usuario (Por defecto, todos entran como ALUMNO)
        Usuario nuevoUsuario = new Usuario(
                UUID.randomUUID().toString(),
                request.getMatricula(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "ALUMNO"
        );

        // 3. Guardar en Firebase Firestore
        usuarioRepository.guardarUsuario(nuevoUsuario);

        // 4. Generar el Token JWT
        String token = jwtService.generateToken(nuevoUsuario.getMatricula());

        // 5. Retornar el DTO para el frontend
        return new AuthResponseDTO(token, nuevoUsuario.getMatricula(), nuevoUsuario.getRol());
    }

    public AuthResponseDTO login(LoginRequestDTO request) throws ExecutionException, InterruptedException {
        // 1. Buscar al usuario por matrícula en Firebase
        Usuario usuario = usuarioRepository.findByMatricula(request.getMatricula())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Verificar que la contraseña coincida con el hash guardado
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        // 3. Generar nuevo Token
        String token = jwtService.generateToken(usuario.getMatricula());

        return new AuthResponseDTO(token, usuario.getMatricula(), usuario.getRol());
    }
}