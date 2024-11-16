package dao;

import model.Grupo;
import model.GrupoAtualizado;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class GrupoDAO extends DAO {

    public GrupoDAO() {
        super();
        conectar();
    }

    public void finalize() {
        close();
    }

    // Função para cadastrar um grupo no banco de dados
    public boolean cadastrar(Grupo grupo) {
        boolean status = false;
        try {

            String sql = "INSERT INTO grupos (nome, data, horario, descricao, local, id_esporte, jogadoresmax, criador) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";

            PreparedStatement stmt = conexao.prepareStatement(sql);

            stmt.setString(1, grupo.getNome());
            stmt.setString(2, grupo.getData());
            stmt.setString(3, grupo.getHorario());
            stmt.setString(4, grupo.getDescricao());
            stmt.setString(5, grupo.getLocal());
            stmt.setInt(6, grupo.getId_esporte());
            stmt.setInt(7, grupo.getJogadoresMax());
            stmt.setString(8, grupo.getCriador());

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                grupo.setId(rs.getInt("id"));
            }

            String nomeCriador = grupo.getCriador();
            int id_grupo = grupo.getId();

            String acharUsuario = "SELECT id FROM usuario WHERE nome = ?";
            PreparedStatement stmte = conexao.prepareStatement(acharUsuario);
            stmte.setString(1, nomeCriador);

            ResultSet result = stmte.executeQuery();
            int idCriador = -1;

            if (result.next()) {
                idCriador = result.getInt("id");
            }

            if (idCriador != -1) {
                String inserirUsuarioGrupo = "INSERT INTO usuario_grupo (id_usuario, id_grupo) VALUES (?, ?)";

                PreparedStatement inserir = conexao.prepareStatement(inserirUsuarioGrupo);
                inserir.setInt(1, idCriador);
                inserir.setInt(2, id_grupo);

                int linhasAfetadas = inserir.executeUpdate();

                if (linhasAfetadas > 0) {
                    status = true;
                    System.out.println("Usuário associado ao grupo com sucesso.");
                } else {
                    status = false;
                    System.out.println("Falha ao associar o usuário ao grupo.");
                }

                inserir.close();
            } else {
                System.out.println("Criador não encontrado.");
            }

            result.close();
            stmte.close();
            status = true;

        } catch (SQLException e) {
            System.err.println("Erro ao cadastrar o grupo: " + e.getMessage());
        }
        return status;
    }

    public ArrayList<Grupo> gruposCriados(String criador) {
        ArrayList<Grupo> grupos = new ArrayList<>();
        try {

            String sql = "SELECT * FROM grupos WHERE criador = ?";
            PreparedStatement stmt = conexao.prepareStatement(sql);

            stmt.setString(1, criador);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Grupo grupo = new Grupo();
                grupo.setId(rs.getInt("id"));
                grupo.setNome(rs.getString("nome"));
                grupo.setData(rs.getString("data"));
                grupo.setHorario(rs.getString("horario"));
                grupo.setDescricao(rs.getString("descricao"));
                grupo.setLocal(rs.getString("local"));
                grupo.setId_esporte(rs.getInt("id_esporte"));
                grupo.setJogadoresMax(rs.getInt("jogadoresmax"));
                grupo.setCriador(rs.getString("criador"));

                grupos.add(grupo);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return grupos;
    }

    // Método para deletar grupo no banco de dados
    public boolean deletarGrupo(int idGrupo) {
        boolean status = false;

        try {

            String sql = "DELETE FROM grupos WHERE id = ?";

            PreparedStatement stmt = conexao.prepareStatement(sql);
            stmt.setInt(1, idGrupo);

            int linhasAfetadas = stmt.executeUpdate();
            if (linhasAfetadas > 0) {
                status = true;
            }

        } catch (SQLException e) {
            System.err.println("Erro ao deletar grupo: " + e.getMessage());
        }

        return status;
    }

    // Método para obter os detalhes do grupo pelo ID
    public Grupo obterDetalhesDoGrupo(int idGrupo) {
        Grupo grupo = null;
        String sql = "SELECT * FROM grupos WHERE id = ?";

        try {
            PreparedStatement stmt = conexao.prepareStatement(sql);
            stmt.setInt(1, idGrupo);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                grupo = new Grupo();
                grupo.setId(rs.getInt("id"));
                grupo.setNome(rs.getString("nome"));
            }

            rs.close();
            stmt.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return grupo;
    }

    // Método para obter os participantes do grupo pelo ID do grupo
    public List<String> getParticipantesDoGrupo(int idGrupo) {
        List<String> participantes = new ArrayList<>();
        String sql = "SELECT u.nome FROM usuario u " +
                "JOIN usuario_grupo ug ON u.id = ug.id_usuario " +
                "WHERE ug.id_grupo = ?";

        try {
            PreparedStatement stmt = conexao.prepareStatement(sql);
            stmt.setInt(1, idGrupo);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                participantes.add(rs.getString("nome"));
            }

            rs.close();
            stmt.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return participantes;
    }

    public ArrayList<Grupo> getTodosGrupos(String usuario) {
        ArrayList<Grupo> grupos = new ArrayList<>();
    
        // Consulta para obter o ID do usuário com base no nome
        String sqlGetUserId = "SELECT id FROM usuario WHERE nome = ?";
        
        // Consulta para obter todos os grupos em que o usuário não está participando
        String sqlGetGroups = "SELECT * FROM grupos WHERE id NOT IN (SELECT id_grupo FROM usuario_grupo WHERE id_usuario = ?)";
    
        try {
            // Primeiro, obtemos o ID do usuário
            PreparedStatement stmtUser = conexao.prepareStatement(sqlGetUserId);
            stmtUser.setString(1, usuario);  // Nome do usuário passado para o método
            ResultSet rsUser = stmtUser.executeQuery();
    
            int userId = -1;
            if (rsUser.next()) {
                userId = rsUser.getInt("id");
                System.out.println("ID do usuário obtido: " + userId);
            }
    
            rsUser.close();
            stmtUser.close();
    
            // Se o usuário não for encontrado, retornar a lista vazia
            if (userId == -1) {
                System.out.println("Usuário não encontrado: " + usuario);
                return grupos;
            }
    
            // Agora obtemos todos os grupos onde o usuário não está participando
            PreparedStatement stmtGroups = conexao.prepareStatement(sqlGetGroups);
            stmtGroups.setInt(1, userId);  // Passa o ID do usuário para a query
            ResultSet rsGroups = stmtGroups.executeQuery();
    
            while (rsGroups.next()) {
                Grupo grupo = new Grupo();
                grupo.setId(rsGroups.getInt("id"));
                grupo.setNome(rsGroups.getString("nome"));
                grupo.setData(rsGroups.getString("data"));
                grupo.setCriador(rsGroups.getString("criador"));
                grupo.setLocal(rsGroups.getString("local"));
    
                grupos.add(grupo);
            }
    
            rsGroups.close();
            stmtGroups.close();
    
        } catch (SQLException e) {
            e.printStackTrace();
        }
    
        return grupos;
    }

    public boolean atualizar(GrupoAtualizado grupo) {
        String sql = "UPDATE grupos SET nome = ?, data = ?, horario = ?, local = ?, jogadoresmax = ? WHERE id = ?";
    
        try {
            // Prepara a instrução SQL
            PreparedStatement stmt = conexao.prepareStatement(sql);
            
            // Define os valores dos parâmetros
            stmt.setString(1, grupo.getNome());               // Nome do grupo
            stmt.setString(2, grupo.getData());               // Data (caracteres variáveis)
            stmt.setString(3, grupo.getHorario());            // Horário (caracteres variáveis)
            stmt.setString(4, grupo.getLocal());              // Local
            stmt.setInt(5, grupo.getJogadoresMax());          // Número máximo de jogadores
            stmt.setInt(6, grupo.getId());                    // ID do grupo (PK)
    
            // Executa a atualização
            int rowsAffected = stmt.executeUpdate();
    
            return rowsAffected > 0; // Se atualizou alguma linha, retorna true
    
        } catch (SQLException e) {
            e.printStackTrace(); // Loga o erro
            return false;
        }
    }

    public boolean entrarNoGrupo(String nomeUsuario, int idGrupo) {
        String sqlGetUserId = "SELECT id FROM usuario WHERE nome = ?";
        String sqlInsertUserGroup = "INSERT INTO usuario_grupo (id_usuario, id_grupo) VALUES (?, ?)";
    
        try {
            // Obter o ID do usuário pelo nome
            PreparedStatement stmtUser = conexao.prepareStatement(sqlGetUserId);
            stmtUser.setString(1, nomeUsuario);
            ResultSet rsUser = stmtUser.executeQuery();
    
            int userId = -1;
            if (rsUser.next()) {
                userId = rsUser.getInt("id");
            }
    
            rsUser.close();
            stmtUser.close();
    
            // Se o usuário não for encontrado, retornar falso
            if (userId == -1) {
                System.out.println("Usuário não encontrado: " + nomeUsuario);
                return false;
            }
    
            // Inserir o usuário no grupo
            PreparedStatement stmtInsert = conexao.prepareStatement(sqlInsertUserGroup);
            stmtInsert.setInt(1, userId);
            stmtInsert.setInt(2, idGrupo);
    
            int rowsAffected = stmtInsert.executeUpdate();
            stmtInsert.close();
    
            // Retornar true se a inserção foi bem-sucedida
            return rowsAffected > 0;
    
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Retorna falso em caso de erro
        }
    }
    
    public int getUsuarioIdByName(String nomeUsuario) {
        String sql = "SELECT id FROM usuario WHERE nome = ?";
        
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, nomeUsuario);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return -1; // Retorna -1 se o usuário não for encontrado
    }
    
    public boolean sairDoGrupo(int idUsuario, int idGrupo) {
        String sql = "DELETE FROM usuario_grupo WHERE id_usuario = ? AND id_grupo = ?";
    
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            // Define os parâmetros da query
            stmt.setInt(1, idUsuario);
            stmt.setInt(2, idGrupo);
    
            // Executa a remoção da associação
            int rowsAffected = stmt.executeUpdate();
    
            // Se pelo menos uma linha foi afetada, a operação foi bem-sucedida
            return rowsAffected > 0;
    
        } catch (SQLException e) {
            e.printStackTrace();
            return false;  // Retorna falso em caso de erro
        }
    }

    public ArrayList<Grupo> getGruposParticipando(String nomeUsuario) {
        ArrayList<Grupo> grupos = new ArrayList<>();
        
        // Consulta SQL para obter grupos onde o usuário participa, mas não é o criador
        String sql = "SELECT g.* FROM grupos g " +
                     "JOIN usuario_grupo ug ON g.id = ug.id_grupo " +
                     "JOIN usuario u ON u.id = ug.id_usuario " +
                     "WHERE u.nome = ? AND g.criador != u.nome";
    
        try {
            PreparedStatement stmt = conexao.prepareStatement(sql);
            stmt.setString(1, nomeUsuario);  // Nome do usuário
    
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Grupo grupo = new Grupo();
                grupo.setId(rs.getInt("id"));
                grupo.setNome(rs.getString("nome"));
                grupo.setData(rs.getString("data"));
                grupo.setHorario(rs.getString("horario"));
                grupo.setJogadoresMax(rs.getInt("jogadoresmax"));
                grupo.setId_esporte(rs.getInt("id_esporte"));
                grupo.setCriador(rs.getString("criador"));
                grupo.setLocal(rs.getString("local"));
                // Adicione os outros atributos conforme necessário
    
                grupos.add(grupo);  // Adiciona o grupo à lista
            }
    
            rs.close();
            stmt.close();
    
        } catch (SQLException e) {
            e.printStackTrace();
        }
    
        return grupos;  
    }

    public boolean excluirGruposPorCriador(String nomeCriador) {
        String sqlExcluirGrupos = "DELETE FROM grupos WHERE criador = ?";
    
        try (PreparedStatement stmtGrupos = conexao.prepareStatement(sqlExcluirGrupos)) {
            stmtGrupos.setString(1, nomeCriador);
            int rowsAffected = stmtGrupos.executeUpdate();
    
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean associarImagem(int idGrupo, String imagePath) {
        String sqlBuscarID = "SELECT id_imagem FROM imagens WHERE endereco = ?";
        String sqlInserirRelacao = "INSERT INTO imagem_grupo (id_imagem, id_grupo) VALUES (?, ?)";
        String sqlAtualizarGrupo = "UPDATE grupos SET imagem = ? WHERE id = ?";
    
        try (PreparedStatement stmtBuscarID = conexao.prepareStatement(sqlBuscarID)) {
            stmtBuscarID.setString(1, imagePath);
            ResultSet resultSet = stmtBuscarID.executeQuery();
    
            if (resultSet.next()) {
                int idImagem = resultSet.getInt("id_imagem");
    
                // Inserir a relação entre o idImagem e o idGrupo
                try (PreparedStatement stmtInserirRelacao = conexao.prepareStatement(sqlInserirRelacao)) {
                    stmtInserirRelacao.setInt(1, idImagem); 
                    stmtInserirRelacao.setInt(2, idGrupo); 
    
                    int rowsInserted = stmtInserirRelacao.executeUpdate();
    
                    if (rowsInserted > 0) {
                        // Atualizando o grupo com o caminho da imagem na coluna "imagem"
                        try (PreparedStatement stmtAtualizarGrupo = conexao.prepareStatement(sqlAtualizarGrupo)) {
                            stmtAtualizarGrupo.setString(1, imagePath);  // Definindo o caminho da imagem
                            stmtAtualizarGrupo.setInt(2, idGrupo);  // Definindo o ID do grupo
    
                            int rowsUpdated = stmtAtualizarGrupo.executeUpdate();
                            return rowsUpdated > 0; // Retorna true se o update foi bem-sucedido
                        }
                    }
                }
            } else {
                return false; // Caso a imagem não seja encontrada
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Captura exceção e retorna false em caso de erro
        }
        
        return false; // Garantindo retorno caso nenhuma das condições acima seja atendida
    }
    

    // Função que busca o endereço da imagem por grupo
    public String buscarEnderecoImagemPorGrupo(int idGrupo) {

        Integer idImagem = buscarIdImagemPorGrupo(idGrupo);

        if (idImagem != null) {
            return buscarEnderecoImagemPorId(idImagem);
        } else {
            return null;  
        }
    }

    // Função para buscar o id_imagem na tabela imagem_grupo
    private Integer buscarIdImagemPorGrupo(int idGrupo) {
        String sql = "SELECT id_imagem FROM imagem_grupo WHERE id_grupo = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, idGrupo);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt("id_imagem"); 
            } else {
                return null;  
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;  
        }
    }

    // Função para buscar o endereço da imagem na tabela imagens
    private String buscarEnderecoImagemPorId(int idImagem) {
        String sql = "SELECT endereco FROM imagens WHERE id_imagem = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, idImagem);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getString("endereco");  
            } else {
                return null; 
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null; 
        }
    }

    public ArrayList<Grupo> getGruposIA(String esporte) {
        ArrayList<Grupo> grupos = new ArrayList<>();
        String sql = "SELECT * FROM grupos WHERE id_esporte = (SELECT id FROM esporte WHERE nome = ?)";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, esporte);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Grupo grupo = new Grupo();
                grupo.setId(rs.getInt("id"));
                grupo.setNome(rs.getString("nome"));
                grupo.setDescricao(rs.getString("descricao"));
                grupo.setData(rs.getString("data"));
                grupo.setHorario(rs.getString("horario"));
                grupo.setLocal(rs.getString("local"));
                grupo.setJogadoresMax(rs.getInt("jogadoresmax"));
                grupo.setId_esporte(rs.getInt("id_esporte"));
                grupo.setCriador(rs.getString("criador"));
                grupo.setImagem(rs.getString("imagem"));
                grupos.add(grupo);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return grupos;
    }
}
