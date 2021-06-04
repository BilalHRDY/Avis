package fr.bilal.avis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Editeur.
 */
@Entity
@Table(name = "editeur")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Editeur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @ManyToOne
    @JsonIgnoreProperties(value = { "editeurs", "avis" }, allowSetters = true)
    private Jeu jeu;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Editeur id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Editeur nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Jeu getJeu() {
        return this.jeu;
    }

    public Editeur jeu(Jeu jeu) {
        this.setJeu(jeu);
        return this;
    }

    public void setJeu(Jeu jeu) {
        this.jeu = jeu;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Editeur)) {
            return false;
        }
        return id != null && id.equals(((Editeur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Editeur{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
