package service;

import dao.GrupoDAO;
import model.Grupo;
import model.GrupoAtualizado;

import java.util.ArrayList;
import java.util.List;

public class GrupoService {

    private GrupoDAO grupoDAO;

    public GrupoService() {
        this.grupoDAO = new GrupoDAO();
    }

    // Função para cadastrar um novo grupo
    public boolean cadastrarGrupo(Grupo grupo) {
        return grupoDAO.cadastrar(grupo);
    }

    // Função para retornar os grupos criados pelo usuário
    public ArrayList<Grupo> gruposCriados(String criador) {
        return grupoDAO.gruposCriados(criador);
    }

    // Função para deletar um grupo pelo ID
    public boolean deletarGrupo(int groupId) {
        return grupoDAO.deletarGrupo(groupId);
    }

    // Função para obter os detalhes de um grupo específico
    public Grupo obterDetalhesDoGrupo(int idGrupo) {
        return grupoDAO.obterDetalhesDoGrupo(idGrupo);
    }

    // Função para retornar a lista de participantes de um grupo
    public List<String> getParticipantesDoGrupo(int idGrupo) {
        return grupoDAO.getParticipantesDoGrupo(idGrupo);
    }

    // Função para retornar todos os grupos, exceto os criados por um determinado
    // usuário
    public ArrayList<Grupo> getTodosGrupos(String usuario) {
        return grupoDAO.getTodosGrupos(usuario);
    }

    // Função para atualizar as informações de um grupo
    public boolean atualizarGrupo(GrupoAtualizado grupoAtualizado) {
        return grupoDAO.atualizar(grupoAtualizado);
    }

    // Função para permitir que um usuário entre em um grupo
    public boolean entrarNoGrupo(String nomeUsuario, int idGrupo) {
        return grupoDAO.entrarNoGrupo(nomeUsuario, idGrupo);
    }

    // Função para remover um usuário de um grupo
    public boolean sairDoGrupo(int usuarioId, int groupId) {
        return grupoDAO.sairDoGrupo(usuarioId, groupId);
    }

    // Função para retornar os grupos onde o usuário participa, mas não é o criador
    public ArrayList<Grupo> getGruposParticipando(String nomeUsuario) {
        return grupoDAO.getGruposParticipando(nomeUsuario);
    }

    // Função para obter o ID de um usuário pelo nome
    public int getUsuarioIdByName(String nomeUsuario) {
        return grupoDAO.getUsuarioIdByName(nomeUsuario);
    }

    // Função para associar uma imagem ao grupo
    public boolean associarImagem(int idGrupo, String imagePath) {
        return grupoDAO.associarImagem(idGrupo, imagePath);
    }

    // Função para buscar o caminho da imagem associada ao grupo
    public String buscarEnderecoImagemPorGrupo(int idGrupo) {
        return grupoDAO.buscarEnderecoImagemPorGrupo(idGrupo);
    }

    public ArrayList<Grupo> getGruposIA(String esporte) {
        return grupoDAO.getGruposIA(esporte);
    }
}
