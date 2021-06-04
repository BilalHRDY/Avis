package fr.bilal.avis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Jeu.
 */
@Entity
@Table(name = "jeu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Jeu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "description")
    private String description;

    @Column(name = "date_sortie")
    private Instant dateSortie;

    @OneToMany(mappedBy = "jeu")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "jeu" }, allowSetters = true)
    private Set<Editeur> editeurs = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "joueurs", "jeus" }, allowSetters = true)
    private Avis avis;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Jeu id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Jeu nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public Jeu description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateSortie() {
        return this.dateSortie;
    }

    public Jeu dateSortie(Instant dateSortie) {
        this.dateSortie = dateSortie;
        return this;
    }

    public void setDateSortie(Instant dateSortie) {
        this.dateSortie = dateSortie;
    }

    public Set<Editeur> getEditeurs() {
        return this.editeurs;
    }

    public Jeu editeurs(Set<Editeur> editeurs) {
        this.setEditeurs(editeurs);
        return this;
    }

    public Jeu addEditeur(Editeur editeur) {
        this.editeurs.add(editeur);
        editeur.setJeu(this);
        return this;
    }

    public Jeu removeEditeur(Editeur editeur) {
        this.editeurs.remove(editeur);
        editeur.setJeu(null);
        return this;
    }

    public void setEditeurs(Set<Editeur> editeurs) {
        if (this.editeurs != null) {
            this.editeurs.forEach(i -> i.setJeu(null));
        }
        if (editeurs != null) {
            editeurs.forEach(i -> i.setJeu(this));
        }
        this.editeurs = editeurs;
    }

    public Avis getAvis() {
        return this.avis;
    }

    public Jeu avis(Avis avis) {
        this.setAvis(avis);
        return this;
    }

    public void setAvis(Avis avis) {
        this.avis = avis;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Jeu)) {
            return false;
        }
        return id != null && id.equals(((Jeu) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Jeu{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateSortie='" + getDateSortie() + "'" +
            "}";
    }
}
