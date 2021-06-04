import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEditeur } from '../editeur.model';
import { EditeurService } from '../service/editeur.service';
import { EditeurDeleteDialogComponent } from '../delete/editeur-delete-dialog.component';

@Component({
  selector: 'jhi-editeur',
  templateUrl: './editeur.component.html',
})
export class EditeurComponent implements OnInit {
  editeurs?: IEditeur[];
  isLoading = false;

  constructor(protected editeurService: EditeurService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.editeurService.query().subscribe(
      (res: HttpResponse<IEditeur[]>) => {
        this.isLoading = false;
        this.editeurs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEditeur): number {
    return item.id!;
  }

  delete(editeur: IEditeur): void {
    const modalRef = this.modalService.open(EditeurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.editeur = editeur;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
