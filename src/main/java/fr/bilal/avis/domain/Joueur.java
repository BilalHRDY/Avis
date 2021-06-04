package fr.bilal.avis.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Joueur.
 */
@Entity
@Table(name = "joueur")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Joueur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pseudo")
    private String pseudo;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    @Column(name = "date_inscription")
    private Instant dateInscription;

    @Column(name = "est_administrateur")
    private Boolean estAdministrateur;

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

    public Joueur id(Long id) {
        this.id = id;
        return this;
    }

    public String getPseudo() {
        return this.pseudo;
    }

    public Joueur pseudo(String pseudo) {
        this.pseudo = pseudo;
        return this;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public String getMotDePasse() {
        return this.motDePasse;
    }

    public Joueur motDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
        return this;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public Instant getDateInscription() {
        return this.dateInscription;
    }

    public Joueur dateInscription(Instant dateInscription) {
        this.dateInscription = dateInscription;
        return this;
    }

    public void setDateInscription(Instant dateInscription) {
        this.dateInscription = dateInscription;
    }

    public Boolean getEstAdministrateur() {
        return this.estAdministrateur;
    }

    public Joueur estAdministrateur(Boolean estAdministrateur) {
        this.estAdministrateur = estAdministrateur;
        return this;
    }

    public void setEstAdministrateur(Boolean estAdministrateur) {
        this.estAdministrateur = estAdministrateur;
    }

    public Avis getAvis() {
        return this.avis;
    }

    public Joueur avis(Avis avis) {
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
        if (!(o instanceof Joueur)) {
            return false;
        }
        return id != null && id.equals(((Joueur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Joueur{" +
            "id=" + getId() +
            ", pseudo='" + getPseudo() + "'" +
            ", motDePasse='" + getMotDePasse() + "'" +
            ", dateInscription='" + getDateInscription() + "'" +
            ", estAdministrateur='" + getEstAdministrateur() + "'" +
            "}";
    }
}
