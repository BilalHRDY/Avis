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
 * A Avis.
 */
@Entity
@Table(name = "avis")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Avis implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "note")
    private Float note;

    @Column(name = "description")
    private String description;

    @Column(name = "date_envoi")
    private Instant dateEnvoi;

    @OneToMany(mappedBy = "avis")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "avis" }, allowSetters = true)
    private Set<Joueur> joueurs = new HashSet<>();

    @OneToMany(mappedBy = "avis")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "editeurs", "avis" }, allowSetters = true)
    private Set<Jeu> jeus = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Avis id(Long id) {
        this.id = id;
        return this;
    }

    public Float getNote() {
        return this.note;
    }

    public Avis note(Float note) {
        this.note = note;
        return this;
    }

    public void setNote(Float note) {
        this.note = note;
    }

    public String getDescription() {
        return this.description;
    }

    public Avis description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateEnvoi() {
        return this.dateEnvoi;
    }

    public Avis dateEnvoi(Instant dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
        return this;
    }

    public void setDateEnvoi(Instant dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public Set<Joueur> getJoueurs() {
        return this.joueurs;
    }

    public Avis joueurs(Set<Joueur> joueurs) {
        this.setJoueurs(joueurs);
        return this;
    }

    public Avis addJoueur(Joueur joueur) {
        this.joueurs.add(joueur);
        joueur.setAvis(this);
        return this;
    }

    public Avis removeJoueur(Joueur joueur) {
        this.joueurs.remove(joueur);
        joueur.setAvis(null);
        return this;
    }

    public void setJoueurs(Set<Joueur> joueurs) {
        if (this.joueurs != null) {
            this.joueurs.forEach(i -> i.setAvis(null));
        }
        if (joueurs != null) {
            joueurs.forEach(i -> i.setAvis(this));
        }
        this.joueurs = joueurs;
    }

    public Set<Jeu> getJeus() {
        return this.jeus;
    }

    public Avis jeus(Set<Jeu> jeus) {
        this.setJeus(jeus);
        return this;
    }

    public Avis addJeu(Jeu jeu) {
        this.jeus.add(jeu);
        jeu.setAvis(this);
        return this;
    }

    public Avis removeJeu(Jeu jeu) {
        this.jeus.remove(jeu);
        jeu.setAvis(null);
        return this;
    }

    public void setJeus(Set<Jeu> jeus) {
        if (this.jeus != null) {
            this.jeus.forEach(i -> i.setAvis(null));
        }
        if (jeus != null) {
            jeus.forEach(i -> i.setAvis(this));
        }
        this.jeus = jeus;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Avis)) {
            return false;
        }
        return id != null && id.equals(((Avis) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Avis{" +
            "id=" + getId() +
            ", note=" + getNote() +
            ", description='" + getDescription() + "'" +
            ", dateEnvoi='" + getDateEnvoi() + "'" +
            "}";
    }
}
