package fr.bilal.avis.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.bilal.avis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EditeurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Editeur.class);
        Editeur editeur1 = new Editeur();
        editeur1.setId(1L);
        Editeur editeur2 = new Editeur();
        editeur2.setId(editeur1.getId());
        assertThat(editeur1).isEqualTo(editeur2);
        editeur2.setId(2L);
        assertThat(editeur1).isNotEqualTo(editeur2);
        editeur1.setId(null);
        assertThat(editeur1).isNotEqualTo(editeur2);
    }
}
