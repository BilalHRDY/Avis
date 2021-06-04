package fr.bilal.avis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.bilal.avis.IntegrationTest;
import fr.bilal.avis.domain.Editeur;
import fr.bilal.avis.repository.EditeurRepository;
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
 * Integration tests for the {@link EditeurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EditeurResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/editeurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EditeurRepository editeurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEditeurMockMvc;

    private Editeur editeur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Editeur createEntity(EntityManager em) {
        Editeur editeur = new Editeur().nom(DEFAULT_NOM);
        return editeur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Editeur createUpdatedEntity(EntityManager em) {
        Editeur editeur = new Editeur().nom(UPDATED_NOM);
        return editeur;
    }

    @BeforeEach
    public void initTest() {
        editeur = createEntity(em);
    }

    @Test
    @Transactional
    void createEditeur() throws Exception {
        int databaseSizeBeforeCreate = editeurRepository.findAll().size();
        // Create the Editeur
        restEditeurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(editeur)))
            .andExpect(status().isCreated());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeCreate + 1);
        Editeur testEditeur = editeurList.get(editeurList.size() - 1);
        assertThat(testEditeur.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    @Transactional
    void createEditeurWithExistingId() throws Exception {
        // Create the Editeur with an existing ID
        editeur.setId(1L);

        int databaseSizeBeforeCreate = editeurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEditeurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(editeur)))
            .andExpect(status().isBadRequest());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEditeurs() throws Exception {
        // Initialize the database
        editeurRepository.saveAndFlush(editeur);

        // Get all the editeurList
        restEditeurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(editeur.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)));
    }

    @Test
    @Transactional
    void getEditeur() throws Exception {
        // Initialize the database
        editeurRepository.saveAndFlush(editeur);

        // Get the editeur
        restEditeurMockMvc
            .perform(get(ENTITY_API_URL_ID, editeur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(editeur.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM));
    }

    @Test
    @Transactional
    void getNonExistingEditeur() throws Exception {
        // Get the editeur
        restEditeurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEditeur() throws Exception {
        // Initialize the database
        editeurRepository.saveAndFlush(editeur);

        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();

        // Update the editeur
        Editeur updatedEditeur = editeurRepository.findById(editeur.getId()).get();
        // Disconnect from session so that the updates on updatedEditeur are not directly saved in db
        em.detach(updatedEditeur);
        updatedEditeur.nom(UPDATED_NOM);

        restEditeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEditeur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEditeur))
            )
            .andExpect(status().isOk());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
        Editeur testEditeur = editeurList.get(editeurList.size() - 1);
        assertThat(testEditeur.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void putNonExistingEditeur() throws Exception {
        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();
        editeur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEditeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, editeur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(editeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEditeur() throws Exception {
        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();
        editeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditeurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(editeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEditeur() throws Exception {
        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();
        editeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditeurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(editeur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEditeurWithPatch() throws Exception {
        // Initialize the database
        editeurRepository.saveAndFlush(editeur);

        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();

        // Update the editeur using partial update
        Editeur partialUpdatedEditeur = new Editeur();
        partialUpdatedEditeur.setId(editeur.getId());

        partialUpdatedEditeur.nom(UPDATED_NOM);

        restEditeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEditeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEditeur))
            )
            .andExpect(status().isOk());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
        Editeur testEditeur = editeurList.get(editeurList.size() - 1);
        assertThat(testEditeur.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void fullUpdateEditeurWithPatch() throws Exception {
        // Initialize the database
        editeurRepository.saveAndFlush(editeur);

        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();

        // Update the editeur using partial update
        Editeur partialUpdatedEditeur = new Editeur();
        partialUpdatedEditeur.setId(editeur.getId());

        partialUpdatedEditeur.nom(UPDATED_NOM);

        restEditeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEditeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEditeur))
            )
            .andExpect(status().isOk());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
        Editeur testEditeur = editeurList.get(editeurList.size() - 1);
        assertThat(testEditeur.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void patchNonExistingEditeur() throws Exception {
        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();
        editeur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEditeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, editeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(editeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEditeur() throws Exception {
        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();
        editeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditeurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(editeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEditeur() throws Exception {
        int databaseSizeBeforeUpdate = editeurRepository.findAll().size();
        editeur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditeurMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(editeur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Editeur in the database
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEditeur() throws Exception {
        // Initialize the database
        editeurRepository.saveAndFlush(editeur);

        int databaseSizeBeforeDelete = editeurRepository.findAll().size();

        // Delete the editeur
        restEditeurMockMvc
            .perform(delete(ENTITY_API_URL_ID, editeur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Editeur> editeurList = editeurRepository.findAll();
        assertThat(editeurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
