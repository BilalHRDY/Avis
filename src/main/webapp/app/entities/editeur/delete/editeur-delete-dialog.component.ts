import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEditeur } from '../editeur.model';
import { EditeurService } from '../service/editeur.service';

@Component({
  templateUrl: './editeur-delete-dialog.component.html',
})
export class EditeurDeleteDialogComponent {
  editeur?: IEditeur;

  constructor(protected editeurService: EditeurService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.editeurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
