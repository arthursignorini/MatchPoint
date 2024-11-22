package dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

import model.Usuario;
import model.UsuarioAtualizado;

public class UserDAO extends DAO {
    
    public UserDAO() {
        super();  
        conectar();  
    }


    public void finalize() {
        close();  
    }

    public boolean cadastrar(Usuario usuario) throws Exception {
     
        String sql = "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)";

        try (PreparedStatement stmt = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(3, usuario.getNome());
            stmt.setString(1, usuario.getEmail());
            stmt.setString(2, usuario.getSenha()); 

            int affectedRows = stmt.executeUpdate();

            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        usuario.setId(generatedKeys.getInt(1));  
                        System.out.println("Usuário cadastrado com sucesso, ID: " + usuario.getId());
                    } else {
                        throw new SQLException("Falha ao criar o usuário, nenhum ID foi obtido.");
                    }
                }
            }
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } 
    }

    
    public Usuario verificarCredenciais(String nome, String senha) {
        Usuario user = null;
        String sql = "SELECT * FROM usuario WHERE nome = ? AND senha = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
           
            stmt.setString(1, nome);
            stmt.setString(2, senha);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                user = new Usuario();
                user.setId(rs.getInt("id"));
                user.setNome(rs.getString("nome"));
                user.setEmail(rs.getString("email"));
                user.setSenha(rs.getString("senha"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user; 
    }

    public int verificarNome(String nome) {
        Usuario user = null;
        String sql = "SELECT * FROM usuario WHERE nome = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
           
            stmt.setString(1, nome);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                user = new Usuario();
                user.setId(rs.getInt("id"));
                user.setNome(rs.getString("nome"));
                user.setEmail(rs.getString("email"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user.getId(); 
    }

    // Função para obter todos os usuários do banco de dados
    public ArrayList<Usuario> getAllUsuarios() {
        ArrayList<Usuario> usuarios = new ArrayList<>();

        String sql = "SELECT id, nome, email, senha FROM usuario";

        try (PreparedStatement pegarTodosUsuarios = conexao.prepareStatement(sql)){

            ResultSet resultSet = pegarTodosUsuarios.executeQuery();

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String nome = resultSet.getString("nome");
                String email = resultSet.getString("email");
                String senha = resultSet.getString("senha");

                Usuario usuario = new Usuario(email, senha, nome, id);

                System.out.println(usuario.getNome() + "\n\n\n\n\n\n\n");

                usuarios.add(usuario);
            }
           
        } catch (Exception e) {
            e.printStackTrace();
        }

        return usuarios;
    }

    public boolean updateUsuario(UsuarioAtualizado usuario) {
        String sqlUpdateUsuario = "UPDATE usuario SET nome = ?, biografia = ? WHERE nome = ?";
        String sqlUpdateCriadorGrupo = "UPDATE grupos SET criador = ? WHERE criador = ?";
    
        try {
            // Inicia a transação
            conexao.setAutoCommit(false);
    
            // Atualiza o nome e biografia do usuário
            try (PreparedStatement stmtUsuario = conexao.prepareStatement(sqlUpdateUsuario)) {
                stmtUsuario.setString(1, usuario.getNomeNovo());
                stmtUsuario.setString(2, usuario.getBio());
                stmtUsuario.setString(3, usuario.getNomeLogado());
    
                int rowsAffectedUsuario = stmtUsuario.executeUpdate();
                if (rowsAffectedUsuario == 0) {
                    // Nenhum usuário foi atualizado, faz o rollback
                    conexao.rollback();
                    return false;
                }
            }
    
            // Atualiza o campo "criador" nos grupos
            try (PreparedStatement stmtGrupos = conexao.prepareStatement(sqlUpdateCriadorGrupo)) {
                stmtGrupos.setString(1, usuario.getNomeNovo());
                stmtGrupos.setString(2, usuario.getNomeLogado());
    
                stmtGrupos.executeUpdate(); // Não precisa checar se há grupos, pode não haver nenhum
            }
    
            // Se tudo deu certo, confirma a transação
            conexao.commit();
            return true;
            
        } catch (SQLException e) {
            e.printStackTrace();
            try {
                // Se der erro, faz rollback
                conexao.rollback();
            } catch (SQLException rollbackEx) {
                rollbackEx.printStackTrace();
            }
            return false;
        } finally {
            try {
                // Volta a configuração de auto-commit para o padrão
                conexao.setAutoCommit(true);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }    

    public boolean excluirUsuario(int userId) {
        String getUsuarioNomeSql = "SELECT nome FROM usuario WHERE id = ?";
        String deleteGruposSql = "DELETE FROM grupos WHERE criador = ?";
        String deleteUsuarioSql = "DELETE FROM usuario WHERE id = ?";
    
        try {       
            conexao.setAutoCommit(false);
    
            String nomeUsuario = null;
            try (PreparedStatement stmtNome = conexao.prepareStatement(getUsuarioNomeSql)) {
                stmtNome.setInt(1, userId);
                try (ResultSet rs = stmtNome.executeQuery()) {
                    if (rs.next()) {
                        nomeUsuario = rs.getString("nome");
                    } else {
                        
                        conexao.rollback();
                        return false;
                    }
                }
            }
    
            // Excluir grupos onde o usuário é o criador (pelo nome)
            try (PreparedStatement stmtGrupos = conexao.prepareStatement(deleteGruposSql)) {
                stmtGrupos.setString(1, nomeUsuario);
                stmtGrupos.executeUpdate();
            }
    
            // Excluir o usuário (pelo ID)
            try (PreparedStatement stmtUsuario = conexao.prepareStatement(deleteUsuarioSql)) {
                stmtUsuario.setInt(1, userId);
                int rowsAffected = stmtUsuario.executeUpdate();
    
                // Se a exclusão do usuário foi bem-sucedida, commit na transação
                if (rowsAffected > 0) {
                    conexao.commit();
                    return true;
                } else {
                    conexao.rollback();
                    return false;
                }
            } catch (SQLException e) {
               
                conexao.rollback();
                e.printStackTrace();
                return false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            try {
                conexao.setAutoCommit(true); 
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public int getIdImagem(String imagePath) {
        
        String sql = "SELECT id_imagem FROM imagens WHERE endereco = ?";
        int idImagem = -1;

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
             
            stmt.setString(1, imagePath);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                idImagem = rs.getInt("id_imagem");
            }

        } catch (SQLException e) {
            System.err.println("Erro ao buscar a imagem: " + e.getMessage());
        }

        return idImagem;
    }

    public boolean associarImagem(int idUsuario, int idImagem, String enderecoImagem) {
        // Primeiro, verificar se já existe uma relação entre id_usuario e id_imagem
        String sqlVerificar = "SELECT COUNT(*) FROM imagem_user WHERE id_usuario = ?";
        
        try (PreparedStatement stmtVerificar = conexao.prepareStatement(sqlVerificar)) {
            stmtVerificar.setInt(1, idUsuario);
            ResultSet rs = stmtVerificar.executeQuery();
            
            if (rs.next() && rs.getInt(1) > 0) {
                // Se já existir uma relação, fazer um update na tabela imagem_user
                String sqlAtualizarRelacao = "UPDATE imagem_user SET id_imagem = ? WHERE id_usuario = ?";
                try (PreparedStatement stmtAtualizarRelacao = conexao.prepareStatement(sqlAtualizarRelacao)) {
                    stmtAtualizarRelacao.setInt(1, idImagem);
                    stmtAtualizarRelacao.setInt(2, idUsuario);
                    stmtAtualizarRelacao.executeUpdate(); // Não precisamos verificar o número de linhas aqui, pois faremos um update adicional a seguir
                } catch (SQLException e) {
                    e.printStackTrace();
                    return false;
                }
            } else {
                // Se não existir, fazer a inserção na tabela imagem_user
                String sqlInserirRelacao = "INSERT INTO imagem_user (id_imagem, id_usuario) VALUES (?, ?)";
                try (PreparedStatement stmtInserirRelacao = conexao.prepareStatement(sqlInserirRelacao)) {
                    stmtInserirRelacao.setInt(1, idImagem);
                    stmtInserirRelacao.setInt(2, idUsuario);
                    stmtInserirRelacao.executeUpdate(); // Novamente, sem necessidade de verificar o número de linhas aqui
                } catch (SQLException e) {
                    e.printStackTrace();
                    return false;
                }
            }
    
            // Agora, atualizar o campo 'foto' na tabela 'usuario' com o endereço da nova imagem
            String sqlAtualizarUsuario = "UPDATE usuario SET imagem = ? WHERE id = ?";
            try (PreparedStatement stmtAtualizarUsuario = conexao.prepareStatement(sqlAtualizarUsuario)) {
                stmtAtualizarUsuario.setString(1, enderecoImagem);  
                stmtAtualizarUsuario.setInt(2, idUsuario);  
                int linhasAfetadasUsuario = stmtAtualizarUsuario.executeUpdate();
                return linhasAfetadasUsuario > 0; 
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    

    // Função que busca o endereço da imagem por grupo
    public String obterCaminhoImagem (int idUsuario) {

        Integer idImagem = buscarIdImagemPorUsuario(idUsuario);

        if (idImagem != null) {
            return buscarEnderecoImagemPorId(idImagem);
        } else {
            return null;  
        }
    }

    // Função para buscar o id_imagem na tabela imagem_user
    public Integer buscarIdImagemPorUsuario(int idUsuario) {
        String sql = "SELECT id_imagem FROM imagem_user WHERE id_usuario = ? ORDER BY id_imagem DESC LIMIT 1";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, idUsuario);
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
    public String buscarEnderecoImagemPorId(int idImagem) {
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

    public int obterIdPorNome(String nome) {
        String sql = "SELECT id FROM usuario WHERE nome = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, nome);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt("id");  
            } else {
                return 0; 
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return 0; 
        }
    }

    public Usuario buscarPerfilPorNome(String nomeUsuario) {
        
        String sql = "SELECT u.nome, " +
                 "       COALESCE(u.biografia, 'Sem biografia') AS biografia, " +
                 "       COALESCE(i.endereco, 'assets/img/perfil0.jpg') AS endereco " +
                 "FROM usuario u " +
                 "LEFT JOIN imagem_user iu ON u.id = iu.id_usuario " +
                 "LEFT JOIN imagens i ON iu.id_imagem = i.id_imagem " +
                 "WHERE LOWER(u.nome) = LOWER(?) " +
                 "ORDER BY iu.id_imagem DESC LIMIT 1";
    
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, nomeUsuario.trim());
            ResultSet rs = stmt.executeQuery();
    
            if (rs.next()) {
                Usuario usuario = new Usuario();
                usuario.setNome(rs.getString("nome"));
                usuario.setBio(rs.getString("biografia") != null ? rs.getString("biografia") : "Sem biografia");
                usuario.setFoto(rs.getString("endereco") != null ? rs.getString("endereco") : "assets/img/perfil0.jpg");
    
                return usuario;
            } else {
                return null; 
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null; 
        }
    }
    
    
}
