package app;

import static spark.Spark.*;
import java.util.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import model.*;
import service.GrupoService;
import service.UsuarioService;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Aplicacao {

    // GERAR SENHA POR HASH
    public static String gerarHashMD5(String senha) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(senha.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash MD5", e);
        }
    }

    public static void main(String[] args) {

        port(4567);
        staticFiles.location("/public");

        UsuarioService usuarioService = new UsuarioService();
        GrupoService grupoService = new GrupoService();

        // USUÁRIOS
        post("/cadastrar", (request, response) -> {
            String nome = request.queryParams("nome");
            String email = request.queryParams("email");
            String senha = request.queryParams("senha");
        
            String senhaHasheada = gerarHashMD5(senha);
        
            Usuario novoUsuario = new Usuario(nome, email, senhaHasheada, 0);
            usuarioService.cadastrarUsuario(novoUsuario);
        
            response.redirect("/Login.html");
            return null;
        });

        post("/login", (request, response) -> {
            String usuario = request.queryParams("usuario");
            String senha = request.queryParams("senha");
        
            String senhaHasheada = gerarHashMD5(senha);
        
            Usuario user = usuarioService.verificarCredenciais(usuario, senhaHasheada);
        
            if (user != null) {
                response.status(200);
                response.type("application/json");
                return "{\"usuario\": \"" + user.getNome() + "\", \"email\": \"" + user.getEmail() + "\"}";
            } else {
                response.status(401);
                response.type("application/json");
                return "{\"error\": \"Login falhou\"}";
            }
        });
        

        post("/updateUsuario", (req, res) -> {
            res.type("application/json");

            String requestBody = req.body();
            Gson gson = new Gson();
            UsuarioAtualizado usuarioAtualizado = gson.fromJson(requestBody, UsuarioAtualizado.class);

            boolean sucesso = usuarioService.atualizarUsuario(usuarioAtualizado);

            if (sucesso) {
                res.status(200);
                return gson.toJson(usuarioAtualizado.getNomeNovo());
            } else {
                res.status(500);
                return "{\"success\": false, \"message\": \"Erro ao atualizar o usuário.\"}";
            }
        });

        delete("/deleteUsuario", (request, response) -> {
            String usuario = request.queryParams("usuario");
            String senha = request.queryParams("senha");

            Usuario user = usuarioService.verificarCredenciais(usuario, senha);

            if (user != null) {
                boolean isDeleted = usuarioService.excluirUsuario(user.getId());

                if (isDeleted) {
                    response.status(200);
                    response.type("application/json");
                    return "{\"message\": \"Usuário excluído com sucesso!\"}";
                } else {
                    response.status(500);
                    response.type("application/json");
                    return "{\"error\": \"Erro ao excluir o usuário.\"}";
                }
            } else {
                response.status(401);
                response.type("application/json");
                return "{\"error\": \"Autenticação falhou. Não foi possível excluir o usuário.\"}";
            }
        });

        get("/mostrarTodosUsuarios", (req, res) -> {
            res.type("application/json");

            ArrayList<Usuario> usuariosCadastrados = usuarioService.getTodosUsuarios();

            return new Gson().toJson(usuariosCadastrados);
        });

        // CADASTRO DO GRUPO
        post("/cadastrarGrupo", (req, res) -> {
            res.type("application/json");

            String requestBody = req.body();
            Gson gson = new Gson();
            Grupo novoGrupo = gson.fromJson(requestBody, Grupo.class);

            boolean sucesso = grupoService.cadastrarGrupo(novoGrupo);

            if (sucesso) {
                res.status(201);
                return gson.toJson(novoGrupo);
            } else {
                res.status(500);
                return "{\"message\":\"Erro ao cadastrar o grupo.\"}";
            }
        });

        // Endpoint para retornar os grupos criados pelo usuário
        post("/gruposCriados", (req, res) -> {
            Gson gson = new Gson();
            res.type("application/json");

            Map<String, String> requestBody = gson.fromJson(req.body(), new TypeToken<Map<String, String>>() {
            }.getType());
            String criador = requestBody.get("criador");

            ArrayList<Grupo> gruposCriados = grupoService.gruposCriados(criador);
            return gson.toJson(gruposCriados);
        });

        // Rota DELETE para deletar um grupo
        delete("/deletarGrupo/:id", (req, res) -> {
            res.type("application/json");

            int groupId = Integer.parseInt(req.params(":id"));

            boolean deletado = grupoService.deletarGrupo(groupId);

            if (deletado) {
                res.status(200);
                return new Gson().toJson("Grupo deletado com sucesso.");
            } else {
                res.status(404);
                return new Gson().toJson("Grupo não encontrado.");
            }
        });

        // Rota para obter os detalhes do grupo e seus participantes
        get("/participantes/:id", (req, res) -> {
            res.type("application/json");

            int idGrupo = Integer.parseInt(req.params(":id"));

            Grupo grupo = grupoService.obterDetalhesDoGrupo(idGrupo);

            if (grupo != null) {
                List<String> participantes = grupoService.getParticipantesDoGrupo(idGrupo);

                Map<String, Object> resposta = new HashMap<>();
                resposta.put("nome", grupo.getNome());
                resposta.put("participantes", participantes);

                return new Gson().toJson(resposta);
            } else {
                res.status(404); // Grupo não encontrado
                return new Gson().toJson("Grupo não encontrado");
            }
        });

        // Rota para retornar todos os grupos, exceto aqueles criados pelo usuário logado
        get("/todosGrupos", (req, res) -> {
            res.type("application/json");

            String usuario = req.queryParams("usuario");

            ArrayList<Grupo> todosGrupos = grupoService.getTodosGrupos(usuario);

            return new Gson().toJson(todosGrupos);
        });

        // ATUALIZAR AS INFORMAÇÕES DO GRUPO
        post("/updateGrupo", (req, res) -> {
            res.type("application/json");

            String requestBody = req.body();
            Gson gson = new Gson();
            GrupoAtualizado grupoAtualizado = gson.fromJson(requestBody, GrupoAtualizado.class);

            boolean sucesso = grupoService.atualizarGrupo(grupoAtualizado);

            if (sucesso) {
                res.status(200);
                return gson.toJson(grupoAtualizado);
            } else {
                res.status(500);
                return "{\"success\": false, \"message\": \"Erro ao atualizar o grupo.\"}";
            }
        });

        // ENTRAR NO GRUPO
        post("/entrarNoGrupo", (request, response) -> {
            String nomeUsuario = request.queryParams("usuario");
            String grupoIdParam = request.queryParams("grupoId");

            if (nomeUsuario == null || grupoIdParam == null || grupoIdParam.isEmpty()) {
                response.status(400); // Bad Request
                return "{\"error\":\"Parâmetros inválidos\"}";
            }

            int idGrupo;
            try {
                idGrupo = Integer.parseInt(grupoIdParam);
            } catch (NumberFormatException e) {
                response.status(400);
                return "{\"error\":\"ID do grupo inválido\"}";
            }

            boolean sucesso = grupoService.entrarNoGrupo(nomeUsuario, idGrupo);

            if (sucesso) {
                response.status(200);
                return "{\"message\":\"Usuário entrou no grupo com sucesso!\"}";
            } else {
                response.status(500);
                return "{\"error\":\"Erro ao entrar no grupo. Tente novamente.\"}";
            }
        });

        // TIRAR O USUÁRIO DO GRUPO
        delete("/sairDoGrupo/:id", (request, response) -> {
            int groupId = Integer.parseInt(request.params(":id"));
            String nomeUsuario = request.queryParams("usuario");

            int usuarioId = grupoService.getUsuarioIdByName(nomeUsuario);

            if (usuarioId == -1) {
                response.status(400); // Bad Request
                return "{\"error\":\"Usuário não encontrado.\"}";
            }

            boolean sucesso = grupoService.sairDoGrupo(usuarioId, groupId);

            if (sucesso) {
                response.status(200);
                return "{\"message\":\"Usuário saiu do grupo com sucesso!\"}";
            } else {
                response.status(500);
                return "{\"error\":\"Erro ao sair do grupo.\"}";
            }
        });

        // USUÁRIO PARTICIPA MAS NAO É O CRIADOR
        get("/gruposParticipando", (request, response) -> {
            String nomeUsuario = request.queryParams("usuario");

            ArrayList<Grupo> gruposParticipando = grupoService.getGruposParticipando(nomeUsuario);

            Gson gson = new Gson();
            return gson.toJson(gruposParticipando);
        });

        // Atualizar imagem associada ao grupo
        post("/associarImagem", (request, response) -> {
            Gson gson = new Gson();
            Map<String, String> requestBody = gson.fromJson(request.body(), new TypeToken<Map<String, String>>() {
            }.getType());

            String idGrupoStr = requestBody.get("id_grupo");
            String imagePath = requestBody.get("imagePath");

            if (idGrupoStr == null || imagePath == null) {
                response.status(400);
                return "{\"message\":\"Dados inválidos fornecidos.\"}";
            }

            int idGrupo;
            try {
                idGrupo = Integer.parseInt(idGrupoStr);
            } catch (NumberFormatException e) {
                response.status(400);
                return "{\"message\":\"ID do grupo inválido.\"}";
            }

            boolean sucesso = grupoService.associarImagem(idGrupo, imagePath);

            if (sucesso) {
                response.status(200);
                return "{\"message\":\"Imagem associada ao grupo com sucesso!\"}";
            } else {
                response.status(500);
                return "{\"message\":\"Falha ao associar a imagem ao grupo.\"}";
            }
        });

        // Buscar o caminho da imagem associada ao grupo
        get("/enderecoImagemPorGrupo", (request, response) -> {
            String idGrupoStr = request.queryParams("id_grupo");

            if (idGrupoStr == null || idGrupoStr.isEmpty()) {
                response.status(400);
                return "{\"message\":\"ID do grupo não fornecido.\"}";
            }

            int idGrupo;
            try {
                idGrupo = Integer.parseInt(idGrupoStr);
            } catch (NumberFormatException e) {
                response.status(400);
                return "{\"message\":\"ID do grupo inválido.\"}";
            }

            String enderecoImagem = grupoService.buscarEnderecoImagemPorGrupo(idGrupo);

            if (enderecoImagem != null) {
                response.status(200);
                response.type("application/json");
                return "{\"endereco\":\"" + enderecoImagem + "\"}";
            } else {
                response.status(404);
                response.type("application/json");
                return "{\"message\":\"Nenhuma imagem encontrada para este grupo.\"}";
            }
        });

        // Atualizar foto de perfil do usuário
        post("/updateUserPhoto", (request, response) -> {
            Gson gson = new Gson();
            Map<String, String> requestBody = gson.fromJson(request.body(), new TypeToken<Map<String, String>>() {
            }.getType());

            String nomeUsuario = requestBody.get("loggedUser");
            String imagePath = requestBody.get("photoPath");

            if (nomeUsuario == null || imagePath == null) {
                response.status(400);
                return "{\"message\":\"Dados inválidos fornecidos.\"}";
            }

            int idUsuario = grupoService.getUsuarioIdByName(nomeUsuario);

            if (idUsuario == -1) {
                response.status(404);
                return "{\"message\":\"Usuário não encontrado.\"}";
            }

            int idImagem = usuarioService.getIdImagem(imagePath);

            boolean sucesso = usuarioService.associarImagem(idUsuario, idImagem, imagePath);

            if (sucesso) {
                response.status(200);
                response.type("application/json");
                return "{\"message\":\"Imagem associada ao usuário com sucesso!\"}";
            } else {
                response.status(500);
                response.type("application/json");
                return "{\"message\":\"Falha ao associar a imagem ao usuário.\"}";
            }
        });

        // Buscar o caminho da imagem de um usuário
        get("/obterCaminhoImagem/:idUsuario", (request, response) -> {
            int idUsuario = Integer.parseInt(request.params(":idUsuario"));
            String caminhoImagem = usuarioService.obterCaminhoImagem(idUsuario);

            return caminhoImagem;
        });

        get("/obterIdUsuario/:nomeUsuario", (request, response) -> {
            String nomeUsuario = request.params(":nomeUsuario");

            int idUsuario = usuarioService.obterIdPorNome(nomeUsuario);

            if (idUsuario != 0) {
                response.status(200);
                response.type("application/json");
                return "{\"idUsuario\": " + idUsuario + "}";
            } else {
                response.status(404);
                return "{\"error\": \"Usuário não encontrado\"}";
            }
        });

        // Rota para obter os detalhes do perfil do usuário pelo nome
        get("/obterPerfilUsuario", (request, response) -> {
            String nomeUsuario = request.queryParams("nome");

            if (nomeUsuario == null) {
                response.status(400); // Bad Request
                return "{\"error\":\"Parâmetro 'nome' é obrigatório.\"}";
            }

            Usuario perfil = usuarioService.buscarPerfilPorNome(nomeUsuario);
            
            if (perfil != null) {
                response.status(200);
                response.type("application/json");
                return new Gson().toJson(perfil);
            } else {
                response.status(404); // Not Found
                return "{\"error\":\"Usuário não encontrado.\"}";
            }
        });

        get("/gruposIA", (req, res) -> {
            res.type("application/json");

            String esporte = req.queryParams("esporte");
            System.out.println("\n\n\n\n\n\n\n\n\n\nEsporte: " + esporte);


            if(esporte.equals("Vôlei")) {
                esporte = "Volei";
            }

            ArrayList<Grupo> gruposIA = grupoService.getGruposIA(esporte);
            for(int i=0; i<gruposIA.size();i++) {
                System.out.println(gruposIA.get(i));
            }

            if (gruposIA == null || gruposIA.isEmpty()) {
                res.status(404); // Not Found
                return "{\"error\": \"Nenhum grupo encontrado para o esporte " + esporte + "\"}";
            }

            return new Gson().toJson(gruposIA);
        });

        get("/obterParticipantes", (req, res) -> {
            res.type("application/json");
            String grupoId = req.queryParams("grupoId");
            int idGrupo = Integer.parseInt(grupoId);
            System.out.println(idGrupo);

            List<String> participantes = grupoService.getParticipantesDoGrupo(idGrupo);

            System.out.println(participantes);
            

            if (participantes != null) {
                
                return new Gson().toJson(participantes);
                
            } else {
                res.status(404); 
                return new Gson().toJson("Grupo não encontrado");
            }
        });
    }

    
}
