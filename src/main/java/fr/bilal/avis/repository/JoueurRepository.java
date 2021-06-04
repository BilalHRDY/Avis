package fr.bilal.avis.repository;

import fr.bilal.avis.domain.Joueur;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Joueur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JoueurRepository extends JpaRepository<Joueur, Long> {}
