package fr.bilal.avis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.bilal.avis.IntegrationTest;
import fr.bilal.avis.domain.Joueur;
import fr.bilal.avis.repository.JoueurRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link JoueurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JoueurResourceIT {

    private static final String DEFAULT_PSEUDO = "AAAAAAAAAA";
    private static final String UPDATED_PSEUDO = "BBBBBBBBBB";

    private static final String DEFAULT_MOT_DE_PASSE = "AAAAAAAAAA";
    private static final String UPDATED_MOT_DE_PASSE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_INSCRIPTION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_INSCRIPTION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_EST_ADMINISTRATEUR = false;
    private static final Boolean UPDATED_EST_ADMINISTRATEUR = true;

    private static final String ENTITY_API_URL = "/api/joueurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JoueurRepository joueurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJoueurMockMvc;

    private Joueur joueur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Joueur createEntity(EntityManager em) {
        Joueur joueur = new Joueur()
            .pseudo(DEFAULT_PSEUDO)
            .motDePasse(DEFAULT_MOT_DE_PASSE)
            .dateInscription(DEFAULT_DATE_INSCRIPTION)
            .estAdministrateur(DEFAULT_EST_ADMINISTRATEUR);
        return joueur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Joueur createUpdatedEntity(EntityManager em) {
        Joueur joueur = new Joueur()
            .pseudo(UPDATED_PSEUDO)
            .motDePasse(UPDATED_MOT_DE_PASSE)
            .dateInscription(UPDATED_DATE_INSCRIPTION)
            .estAdministrateur(UPDATED_EST_ADMINISTRATEUR);
        return joueur;
    }

    @BeforeEach
    public void initTest() {
        joueur = createEntity(em);
    }

    @Test
    @Transactional
    void createJoueur() throws Exception {
        int databaseSizeBeforeCreate = joueurRepository.findAll().size();
        // Create the Joueur
        restJoueurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(joueur)))
            .andExpect(status().isCreated());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeCreate + 1);
        Joueur testJoueur = joueurList.get(joueurList.size() - 1);
        assertThat(testJoueur.getPseudo()).isEqualTo(DEFAULT_PSEUDO);
        assertThat(testJoueur.getMotDePasse()).isEqualTo(DEFAULT_MOT_DE_PASSE);
        assertThat(testJoueur.getDateInscription()).isEqualTo(DEFAULT_DATE_INSCRIPTION);
        assertThat(testJoueur.getEstAdministrateur()).isEqualTo(DEFAULT_EST_ADMINISTRATEUR);
    }

    @Test
    @Transactional
    void createJoueurWithExistingId() throws Exception {
        // Create the Joueur with an existing ID
        joueur.setId(1L);

        int databaseSizeBeforeCreate = joueurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJoueurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(joueur)))
            .andExpect(status().isBadRequest());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllJoueurs() throws Exception {
        // Initialize the database
        joueurRepository.saveAndFlush(joueur);

        // Get all the joueurList
        restJoueurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(joueur.getId().intValue())))
            .andExpect(jsonPath("$.[*].pseudo").value(hasItem(DEFAULT_PSEUDO)))
            .andExpect(jsonPath("$.[*].motDePasse").value(hasItem(DEFAULT_MOT_DE_PASSE)))
            .andExpect(jsonPath("$.[*].dateInscription").value(hasItem(DEFAULT_DATE_INSCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].estAdministrateur").value(hasItem(DEFAULT_EST_ADMINISTRATEUR.booleanValue())));
    }

    @Test
    @Transactional
    void getJoueur() throws Exception {
        // Initialize the database
        joueurRepository.saveAndFlush(joueur);

        // Get the joueur
        restJoueurMockMvc
            .perform(get(ENTITY_API_URL_ID, joueur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(joueur.getId().intValue()))
            .andExpect(jsonPath("$.pseudo").value(DEFAULT_PSEUDO))
            .andExpect(jsonPath("$.motDePasse").value(DEFAULT_MOT_DE_PASSE))
            .andExpect(jsonPath("$.dateInscription").value(DEFAULT_DATE_INSCRIPTION.toString()))
            .andExpect(jsonPath("$.estAdministrateur").value(DEFAULT_EST_ADMINISTRATEUR.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingJoueur() throws Exception {
        // Get the joueur
        restJoueurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewJoueur() throws Exception {
        // Initialize the database
        joueurRepository.saveAndFlush(joueur);

        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();

        // Update the joueur
        Joueur updatedJoueur = joueurRepository.findById(joueur.getId()).get();
        // Disconnect from session so that the updates on updatedJoueur are not directly saved in db
        em.detach(updatedJoueur);
        updatedJoueur
            .pseudo(UPDATED_PSEUDO)
            .motDePasse(UPDATED_MOT_DE_PASSE)
            .dateInscription(UPDATED_DATE_INSCRIPTION)
            .estAdministrateur(UPDATED_EST_ADMINISTRATEUR);

        restJoueurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJoueur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJoueur))
            )
            .andExpect(status().isOk());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
        Joueur testJoueur = joueurList.get(joueurList.size() - 1);
        assertThat(testJoueur.getPseudo()).isEqualTo(UPDATED_PSEUDO);
        assertThat(testJoueur.getMotDePasse()).isEqualTo(UPDATED_MOT_DE_PASSE);
        assertThat(testJoueur.getDateInscription()).isEqualTo(UPDATED_DATE_INSCRIPTION);
        assertThat(testJoueur.getEstAdministrateur()).isEqualTo(UPDATED_EST_ADMINISTRATEUR);
    }

    @Test
    @Transactional
    void putNonExistingJoueur() throws Exception {
        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();
        joueur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJoueurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, joueur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joueur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJoueur() throws Exception {
        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();
        joueur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoueurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joueur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJoueur() throws Exception {
        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();
        joueur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoueurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(joueur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJoueurWithPatch() throws Exception {
        // Initialize the database
        joueurRepository.saveAndFlush(joueur);

        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();

        // Update the joueur using partial update
        Joueur partialUpdatedJoueur = new Joueur();
        partialUpdatedJoueur.setId(joueur.getId());

        partialUpdatedJoueur.motDePasse(UPDATED_MOT_DE_PASSE);

        restJoueurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJoueur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJoueur))
            )
            .andExpect(status().isOk());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
        Joueur testJoueur = joueurList.get(joueurList.size() - 1);
        assertThat(testJoueur.getPseudo()).isEqualTo(DEFAULT_PSEUDO);
        assertThat(testJoueur.getMotDePasse()).isEqualTo(UPDATED_MOT_DE_PASSE);
        assertThat(testJoueur.getDateInscription()).isEqualTo(DEFAULT_DATE_INSCRIPTION);
        assertThat(testJoueur.getEstAdministrateur()).isEqualTo(DEFAULT_EST_ADMINISTRATEUR);
    }

    @Test
    @Transactional
    void fullUpdateJoueurWithPatch() throws Exception {
        // Initialize the database
        joueurRepository.saveAndFlush(joueur);

        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();

        // Update the joueur using partial update
        Joueur partialUpdatedJoueur = new Joueur();
        partialUpdatedJoueur.setId(joueur.getId());

        partialUpdatedJoueur
            .pseudo(UPDATED_PSEUDO)
            .motDePasse(UPDATED_MOT_DE_PASSE)
            .dateInscription(UPDATED_DATE_INSCRIPTION)
            .estAdministrateur(UPDATED_EST_ADMINISTRATEUR);

        restJoueurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJoueur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJoueur))
            )
            .andExpect(status().isOk());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
        Joueur testJoueur = joueurList.get(joueurList.size() - 1);
        assertThat(testJoueur.getPseudo()).isEqualTo(UPDATED_PSEUDO);
        assertThat(testJoueur.getMotDePasse()).isEqualTo(UPDATED_MOT_DE_PASSE);
        assertThat(testJoueur.getDateInscription()).isEqualTo(UPDATED_DATE_INSCRIPTION);
        assertThat(testJoueur.getEstAdministrateur()).isEqualTo(UPDATED_EST_ADMINISTRATEUR);
    }

    @Test
    @Transactional
    void patchNonExistingJoueur() throws Exception {
        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();
        joueur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJoueurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, joueur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joueur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJoueur() throws Exception {
        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();
        joueur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoueurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joueur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJoueur() throws Exception {
        int databaseSizeBeforeUpdate = joueurRepository.findAll().size();
        joueur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoueurMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(joueur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Joueur in the database
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJoueur() throws Exception {
        // Initialize the database
        joueurRepository.saveAndFlush(joueur);

        int databaseSizeBeforeDelete = joueurRepository.findAll().size();

        // Delete the joueur
        restJoueurMockMvc
            .perform(delete(ENTITY_API_URL_ID, joueur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Joueur> joueurList = joueurRepository.findAll();
        assertThat(joueurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
