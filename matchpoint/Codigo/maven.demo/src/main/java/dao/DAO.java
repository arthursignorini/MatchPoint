package dao;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DAO {
    protected static Connection conexao;

    public DAO() {
        conexao = null;
    }
	public boolean conectar() {
	    String driverName = "org.postgresql.Driver";                    
		String serverName = "matchpoint.postgres.database.azure.com";
		String database = "matchpoint";
		int porta = 5432; 
		String url = "jdbc:postgresql://" + serverName + ":" + porta + "/" + database;
		String username = "adm"; 
		String password = "@match123"; 
		boolean status = false;


	    try {
	        Class.forName(driverName);
	        conexao = DriverManager.getConnection(url, username, password);
	        status = (conexao != null); 
	        System.out.println("Conexão efetuada com o PostgreSQL na Azure!");
	    } catch (ClassNotFoundException e) { 
	        System.err.println("Conexão NÃO efetuada com o PostgreSQL -- Driver não encontrado -- " + e.getMessage());
	    } catch (SQLException e) {
	        System.err.println("Conexão NÃO efetuada com o PostgreSQL -- " + e.getMessage());
	    }

	    return status;
	}
	
	public boolean close() {
        boolean status = false;

        try {
            if (conexao != null && !conexao.isClosed()) {
                conexao.close();
                status = true;
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return status;
    }

    // Gera um hash MD5 com salt
    public static String hashPasswordWithSalt(String senha, String salt) throws Exception {
        String saltedPassword = salt + senha; // Concatena o salt à senha
        MessageDigest m = MessageDigest.getInstance("MD5");
        m.update(saltedPassword.getBytes(), 0, saltedPassword.length());
        return new BigInteger(1, m.digest()).toString(16);
    }

    // Gera um salt aleatório
    public static String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] saltBytes = new byte[16];
        random.nextBytes(saltBytes);
        return new BigInteger(1, saltBytes).toString(16);
    }

}
