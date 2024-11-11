package dao;

import java.math.BigInteger;
import java.security.MessageDigest;
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
		String serverName = "localhost";
		String database = "MatchPoint";
		int porta = 5432; 
		String url = "jdbc:postgresql://" + serverName + ":" + porta + "/" + database;
		String username = "postgres"; 
		String password = "123456"; 
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

    public static String toMD5(String senha) throws Exception {
        MessageDigest m = MessageDigest.getInstance("MD5");
        m.update(senha.getBytes(), 0, senha.length());
        return new BigInteger(1, m.digest()).toString(16);
    }

}
