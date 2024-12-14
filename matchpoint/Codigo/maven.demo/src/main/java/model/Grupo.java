package model;

public class Grupo {
    private int id;
    private String nome;
    private String data;
    private String horario;
    private String descricao;
    private String local;
    private int id_esporte;
    private int jogadoresMax;
    private String criador;
    private String imagem;

    @Override
    public String toString() {
        return "Grupo [id=" + id + ", nome=" + nome + ", data=" + data + ", horario=" + horario + ", descricao="
                + descricao + ", local=" + local + ", id_esporte=" + id_esporte + ", jogadoresMax=" + jogadoresMax
                + ", criador=" + criador + ", imagem=" + imagem + "]";
    }

    public Grupo(int id, String nome, String data, String horario, String descricao, String local, int id_esporte,
            int jogadoresMax, String criador, String imagem) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.horario = horario;
        this.descricao = descricao;
        this.local = local;
        this.id_esporte = id_esporte;
        this.jogadoresMax = jogadoresMax;
        this.criador = criador;
        this.imagem = imagem;
    }

    public Grupo () {
        id = 0;
        nome = null;
        data = null;
        horario = null;
        descricao = null;
        local = null;
        id_esporte = 0;
        jogadoresMax = 0;
        criador = null;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getData() {
        return data;
    }
    public void setData(String data) {
        this.data = data;
    }
    public String getHorario() {
        return horario;
    }
    public void setHorario(String horario) {
        this.horario = horario;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public String getLocal() {
        return local;
    }
    public void setLocal(String local) {
        this.local = local;
    }
    public int getId_esporte() {
        return id_esporte;
    }
    public void setId_esporte(int id_esporte) {
        this.id_esporte = id_esporte;
    }
    public int getJogadoresMax() {
        return jogadoresMax;
    }
    public void setJogadoresMax(int jogadoresMax) {
        this.jogadoresMax = jogadoresMax;
    }
    public String getCriador() {
        return criador;
    }
    public void setCriador(String criador) {
        this.criador = criador;
    }
    public String getImagem() {
        return imagem;
    }
    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

}
