import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'jeu',
        data: { pageTitle: 'avisApp.jeu.home.title' },
        loadChildren: () => import('./jeu/jeu.module').then(m => m.JeuModule),
      },
      {
        path: 'editeur',
        data: { pageTitle: 'avisApp.editeur.home.title' },
        loadChildren: () => import('./editeur/editeur.module').then(m => m.EditeurModule),
      },
      {
        path: 'avis',
        data: { pageTitle: 'avisApp.avis.home.title' },
        loadChildren: () => import('./avis/avis.module').then(m => m.AvisModule),
      },
      {
        path: 'joueur',
        data: { pageTitle: 'avisApp.joueur.home.title' },
        loadChildren: () => import('./joueur/joueur.module').then(m => m.JoueurModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
