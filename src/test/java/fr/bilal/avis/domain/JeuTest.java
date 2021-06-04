package fr.bilal.avis.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.bilal.avis.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JeuTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Jeu.class);
        Jeu jeu1 = new Jeu();
        jeu1.setId(1L);
        Jeu jeu2 = new Jeu();
        jeu2.setId(jeu1.getId());
        assertThat(jeu1).isEqualTo(jeu2);
        jeu2.setId(2L);
        assertThat(jeu1).isNotEqualTo(jeu2);
        jeu1.setId(null);
        assertThat(jeu1).isNotEqualTo(jeu2);
    }
}
