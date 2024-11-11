package service;

import dao.UserDAO;
import model.Usuario;
import model.UsuarioAtualizado;

import java.util.ArrayList;

public class UsuarioService {

    private UserDAO userDAO;

    public UsuarioService() {
        this.userDAO = new UserDAO();
    }

    // Função para cadastrar um novo usuário
    public void cadastrarUsuario(Usuario usuario) throws Exception {
        userDAO.cadastrar(usuario);
    }

    // Função para verificar as credenciais de login
    public Usuario verificarCredenciais(String usuario, String senha) {
        return userDAO.verificarCredenciais(usuario, senha);
    }

    // Função para atualizar os dados de um usuário
    public boolean atualizarUsuario(UsuarioAtualizado usuarioAtualizado) {
        return userDAO.updateUsuario(usuarioAtualizado);
    }

    // Função para excluir um usuário pelo ID
    public boolean excluirUsuario(int idUsuario) {
        return userDAO.excluirUsuario(idUsuario);
    }

    // Função para buscar todos os usuários cadastrados
    public ArrayList<Usuario> getTodosUsuarios() {
        return userDAO.getAllUsuarios();
    }

    // Função para buscar o ID de um usuário pelo nome
    public int obterIdPorNome(String nomeUsuario) {
        return userDAO.obterIdPorNome(nomeUsuario);
    }

    // Função para associar uma imagem ao usuário
    public boolean associarImagem(int idUsuario, int idImagem, String imagePath) {
        return userDAO.associarImagem(idUsuario, idImagem, imagePath);
    }

    // Função para buscar o caminho da imagem associada ao usuário
    public String obterCaminhoImagem(int idUsuario) {
        return userDAO.obterCaminhoImagem(idUsuario);
    }

    // Função para buscar o perfil de um usuário pelo nome
    public Usuario buscarPerfilPorNome(String nomeUsuario) {
        return userDAO.buscarPerfilPorNome(nomeUsuario);
    }

    // Função para obter o ID da imagem com base no caminho da imagem
    public int getIdImagem(String imagePath) {
        return userDAO.getIdImagem(imagePath);
    }
}
