package fr.bilal.avis.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.bilal.avis.IntegrationTest;
import fr.bilal.avis.domain.Avis;
import fr.bilal.avis.repository.AvisRepository;
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
 * Integration tests for the {@link AvisResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AvisResourceIT {

    private static final Float DEFAULT_NOTE = 1F;
    private static final Float UPDATED_NOTE = 2F;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ENVOI = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ENVOI = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/avis";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AvisRepository avisRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAvisMockMvc;

    private Avis avis;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Avis createEntity(EntityManager em) {
        Avis avis = new Avis().note(DEFAULT_NOTE).description(DEFAULT_DESCRIPTION).dateEnvoi(DEFAULT_DATE_ENVOI);
        return avis;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Avis createUpdatedEntity(EntityManager em) {
        Avis avis = new Avis().note(UPDATED_NOTE).description(UPDATED_DESCRIPTION).dateEnvoi(UPDATED_DATE_ENVOI);
        return avis;
    }

    @BeforeEach
    public void initTest() {
        avis = createEntity(em);
    }

    @Test
    @Transactional
    void createAvis() throws Exception {
        int databaseSizeBeforeCreate = avisRepository.findAll().size();
        // Create the Avis
        restAvisMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isCreated());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeCreate + 1);
        Avis testAvis = avisList.get(avisList.size() - 1);
        assertThat(testAvis.getNote()).isEqualTo(DEFAULT_NOTE);
        assertThat(testAvis.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAvis.getDateEnvoi()).isEqualTo(DEFAULT_DATE_ENVOI);
    }

    @Test
    @Transactional
    void createAvisWithExistingId() throws Exception {
        // Create the Avis with an existing ID
        avis.setId(1L);

        int databaseSizeBeforeCreate = avisRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAvisMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isBadRequest());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAvis() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        // Get all the avisList
        restAvisMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(avis.getId().intValue())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.doubleValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].dateEnvoi").value(hasItem(DEFAULT_DATE_ENVOI.toString())));
    }

    @Test
    @Transactional
    void getAvis() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        // Get the avis
        restAvisMockMvc
            .perform(get(ENTITY_API_URL_ID, avis.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(avis.getId().intValue()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE.doubleValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.dateEnvoi").value(DEFAULT_DATE_ENVOI.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAvis() throws Exception {
        // Get the avis
        restAvisMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAvis() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        int databaseSizeBeforeUpdate = avisRepository.findAll().size();

        // Update the avis
        Avis updatedAvis = avisRepository.findById(avis.getId()).get();
        // Disconnect from session so that the updates on updatedAvis are not directly saved in db
        em.detach(updatedAvis);
        updatedAvis.note(UPDATED_NOTE).description(UPDATED_DESCRIPTION).dateEnvoi(UPDATED_DATE_ENVOI);

        restAvisMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAvis.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAvis))
            )
            .andExpect(status().isOk());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
        Avis testAvis = avisList.get(avisList.size() - 1);
        assertThat(testAvis.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testAvis.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAvis.getDateEnvoi()).isEqualTo(UPDATED_DATE_ENVOI);
    }

    @Test
    @Transactional
    void putNonExistingAvis() throws Exception {
        int databaseSizeBeforeUpdate = avisRepository.findAll().size();
        avis.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvisMockMvc
            .perform(
                put(ENTITY_API_URL_ID, avis.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(avis))
            )
            .andExpect(status().isBadRequest());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAvis() throws Exception {
        int databaseSizeBeforeUpdate = avisRepository.findAll().size();
        avis.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvisMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(avis))
            )
            .andExpect(status().isBadRequest());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAvis() throws Exception {
        int databaseSizeBeforeUpdate = avisRepository.findAll().size();
        avis.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvisMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAvisWithPatch() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        int databaseSizeBeforeUpdate = avisRepository.findAll().size();

        // Update the avis using partial update
        Avis partialUpdatedAvis = new Avis();
        partialUpdatedAvis.setId(avis.getId());

        partialUpdatedAvis.note(UPDATED_NOTE).description(UPDATED_DESCRIPTION).dateEnvoi(UPDATED_DATE_ENVOI);

        restAvisMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAvis.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAvis))
            )
            .andExpect(status().isOk());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
        Avis testAvis = avisList.get(avisList.size() - 1);
        assertThat(testAvis.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testAvis.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAvis.getDateEnvoi()).isEqualTo(UPDATED_DATE_ENVOI);
    }

    @Test
    @Transactional
    void fullUpdateAvisWithPatch() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        int databaseSizeBeforeUpdate = avisRepository.findAll().size();

        // Update the avis using partial update
        Avis partialUpdatedAvis = new Avis();
        partialUpdatedAvis.setId(avis.getId());

        partialUpdatedAvis.note(UPDATED_NOTE).description(UPDATED_DESCRIPTION).dateEnvoi(UPDATED_DATE_ENVOI);

        restAvisMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAvis.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAvis))
            )
            .andExpect(status().isOk());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
        Avis testAvis = avisList.get(avisList.size() - 1);
        assertThat(testAvis.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testAvis.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAvis.getDateEnvoi()).isEqualTo(UPDATED_DATE_ENVOI);
    }

    @Test
    @Transactional
    void patchNonExistingAvis() throws Exception {
        int databaseSizeBeforeUpdate = avisRepository.findAll().size();
        avis.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvisMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, avis.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(avis))
            )
            .andExpect(status().isBadRequest());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAvis() throws Exception {
        int databaseSizeBeforeUpdate = avisRepository.findAll().size();
        avis.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvisMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(avis))
            )
            .andExpect(status().isBadRequest());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAvis() throws Exception {
        int databaseSizeBeforeUpdate = avisRepository.findAll().size();
        avis.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvisMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(avis)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Avis in the database
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAvis() throws Exception {
        // Initialize the database
        avisRepository.saveAndFlush(avis);

        int databaseSizeBeforeDelete = avisRepository.findAll().size();

        // Delete the avis
        restAvisMockMvc
            .perform(delete(ENTITY_API_URL_ID, avis.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Avis> avisList = avisRepository.findAll();
        assertThat(avisList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
