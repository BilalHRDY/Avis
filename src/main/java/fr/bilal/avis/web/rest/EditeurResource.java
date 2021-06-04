package fr.bilal.avis.web.rest;

import fr.bilal.avis.domain.Editeur;
import fr.bilal.avis.repository.EditeurRepository;
import fr.bilal.avis.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.bilal.avis.domain.Editeur}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EditeurResource {

    private final Logger log = LoggerFactory.getLogger(EditeurResource.class);

    private static final String ENTITY_NAME = "editeur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EditeurRepository editeurRepository;

    public EditeurResource(EditeurRepository editeurRepository) {
        this.editeurRepository = editeurRepository;
    }

    /**
     * {@code POST  /editeurs} : Create a new editeur.
     *
     * @param editeur the editeur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new editeur, or with status {@code 400 (Bad Request)} if the editeur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/editeurs")
    public ResponseEntity<Editeur> createEditeur(@RequestBody Editeur editeur) throws URISyntaxException {
        log.debug("REST request to save Editeur : {}", editeur);
        if (editeur.getId() != null) {
            throw new BadRequestAlertException("A new editeur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Editeur result = editeurRepository.save(editeur);
        return ResponseEntity
            .created(new URI("/api/editeurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /editeurs/:id} : Updates an existing editeur.
     *
     * @param id the id of the editeur to save.
     * @param editeur the editeur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated editeur,
     * or with status {@code 400 (Bad Request)} if the editeur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the editeur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/editeurs/{id}")
    public ResponseEntity<Editeur> updateEditeur(@PathVariable(value = "id", required = false) final Long id, @RequestBody Editeur editeur)
        throws URISyntaxException {
        log.debug("REST request to update Editeur : {}, {}", id, editeur);
        if (editeur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, editeur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!editeurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Editeur result = editeurRepository.save(editeur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, editeur.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /editeurs/:id} : Partial updates given fields of an existing editeur, field will ignore if it is null
     *
     * @param id the id of the editeur to save.
     * @param editeur the editeur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated editeur,
     * or with status {@code 400 (Bad Request)} if the editeur is not valid,
     * or with status {@code 404 (Not Found)} if the editeur is not found,
     * or with status {@code 500 (Internal Server Error)} if the editeur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/editeurs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Editeur> partialUpdateEditeur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Editeur editeur
    ) throws URISyntaxException {
        log.debug("REST request to partial update Editeur partially : {}, {}", id, editeur);
        if (editeur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, editeur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!editeurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Editeur> result = editeurRepository
            .findById(editeur.getId())
            .map(
                existingEditeur -> {
                    if (editeur.getNom() != null) {
                        existingEditeur.setNom(editeur.getNom());
                    }

                    return existingEditeur;
                }
            )
            .map(editeurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, editeur.getId().toString())
        );
    }

    /**
     * {@code GET  /editeurs} : get all the editeurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of editeurs in body.
     */
    @GetMapping("/editeurs")
    public List<Editeur> getAllEditeurs() {
        log.debug("REST request to get all Editeurs");
        return editeurRepository.findAll();
    }

    /**
     * {@code GET  /editeurs/:id} : get the "id" editeur.
     *
     * @param id the id of the editeur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the editeur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/editeurs/{id}")
    public ResponseEntity<Editeur> getEditeur(@PathVariable Long id) {
        log.debug("REST request to get Editeur : {}", id);
        Optional<Editeur> editeur = editeurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(editeur);
    }

    /**
     * {@code DELETE  /editeurs/:id} : delete the "id" editeur.
     *
     * @param id the id of the editeur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/editeurs/{id}")
    public ResponseEntity<Void> deleteEditeur(@PathVariable Long id) {
        log.debug("REST request to delete Editeur : {}", id);
        editeurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
