import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJoueur } from '../joueur.model';
import { JoueurService } from '../service/joueur.service';

@Component({
  templateUrl: './joueur-delete-dialog.component.html',
})
export class JoueurDeleteDialogComponent {
  joueur?: IJoueur;

  constructor(protected joueurService: JoueurService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.joueurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
