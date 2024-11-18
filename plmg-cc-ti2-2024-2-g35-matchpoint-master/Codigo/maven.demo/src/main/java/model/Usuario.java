package model;

public class Usuario {
	private int id;
	private String email;
	private String senha;
	private String nome;
    private String bio;
    private String foto;


    @Override
    public String toString() {
        return "Usuario [id=" + id + ", email=" + email + ", senha=" + senha + ", nome=" + nome + ", bio=" + bio
                + ", foto=" + foto + "]";
    }

    public Usuario (String email, String senha, String nome, int id) {
		this.email = email;
		this.senha = senha;
		this.nome = nome;
        this.id = id;
        this.bio = null;
        this.foto = null;
	}

    public Usuario () {
        
    }

    
	public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio){
        this.bio = bio;
    }	
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
    
    

    
}
