package model;

public class GrupoAtualizado {
    int id;
    String nome;
    String data;
    String horario;
    String local;
    int jogadoresMax;

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

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public int getJogadoresMax() {
        return jogadoresMax;
    }

    public void setJogadoresMax(int jogadoresMax) {
        this.jogadoresMax = jogadoresMax;
    }

    public GrupoAtualizado (int id, String nome, String data, String horario, String local, int jogadoresMax) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.horario = horario;
        this.local = local;
        this.jogadoresMax = jogadoresMax;
    }
}

