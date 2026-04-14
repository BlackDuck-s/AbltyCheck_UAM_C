package org.blackducks.controller;

import org.blackducks.dto.UsuarioPerfilDTO;
import org.blackducks.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

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
}