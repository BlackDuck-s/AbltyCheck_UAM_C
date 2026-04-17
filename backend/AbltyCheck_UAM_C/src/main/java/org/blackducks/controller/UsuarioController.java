package org.blackducks.controller;

import org.blackducks.dto.UsuarioPerfilDTO;
import org.blackducks.entity.Usuario;
import org.blackducks.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioPerfilDTO> obtenerMiPerfil(Principal principal) {
        try {
            String matricula = principal.getName();

            UsuarioPerfilDTO perfil = usuarioService.obtenerPerfilPorMatricula(matricula);
            return ResponseEntity.ok(perfil);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(@RequestBody Map<String, Object> updates) {
        try {
            // 1. Obtener la matrícula del usuario autenticado desde el token de Spring Security
            String matriculaActual = SecurityContextHolder.getContext().getAuthentication().getName();

            // 2. Buscar al usuario en la base de datos (ajusta esto a tu Servicio/Repositorio actual)
            Usuario usuario = usuarioService.obtenerPorMatricula(matriculaActual);

            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }

            // 3. Actualizar solo los campos que vengan en la petición
            if (updates.containsKey("nombre")) {
                usuario.setNombre((String) updates.get("nombre"));
            }
            if (updates.containsKey("biografia")) {
                usuario.setBiografia((String) updates.get("biografia"));
            }
            if (updates.containsKey("fotoUrl")) {
                usuario.setFotoUrl((String) updates.get("fotoUrl"));
            }

            // 4. Guardar los cambios (ajusta al método de tu servicio que guarde en Firestore)
            usuarioService.guardarUsuario(usuario);

            return ResponseEntity.ok(usuario);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensaje", "Error al actualizar el perfil: " + e.getMessage()));
        }
    }
}