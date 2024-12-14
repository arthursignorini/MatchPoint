package model;

import java.util.ArrayList;
import java.util.List;

public class Esporte {
    private int id;
    private String nome;

    public Esporte(int id, String nome) {
        this.id = id;
        this.nome = nome;
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
    
    public List<Esporte> cadastrarEsportes () {
    	Esporte futebol = new Esporte (1, "Futebol");
    	Esporte basquete = new Esporte (2, "Basquete");
    	Esporte volei = new Esporte (3, "Volei");
    	
    	List<Esporte> esportes = new ArrayList<>();
        esportes.add(futebol);
        esportes.add(basquete);
        esportes.add(volei);
        
        return esportes;
    }
}
