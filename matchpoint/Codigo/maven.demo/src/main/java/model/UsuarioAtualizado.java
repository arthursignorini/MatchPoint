package model;

public class UsuarioAtualizado {
    private String loggedUser;
    private String username;
    private String bio;
    
    public UsuarioAtualizado(String nomeLogado, String nomeNovo, String bio) {
        this.loggedUser = nomeLogado;
        this.username = nomeNovo;
        this.bio = bio;
    }
    public String getNomeLogado() {
        return loggedUser;
    }
    public void setNomeLogado(String nomeLogado) {
        this.loggedUser = nomeLogado;
    }
    public String getNomeNovo() {
        return username;
    }
    public void setNomeNovo(String nomeNovo) {
        this.username = nomeNovo;
    }
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }

    
}
