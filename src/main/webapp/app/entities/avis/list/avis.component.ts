import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAvis } from '../avis.model';
import { AvisService } from '../service/avis.service';
import { AvisDeleteDialogComponent } from '../delete/avis-delete-dialog.component';

@Component({
  selector: 'jhi-avis',
  templateUrl: './avis.component.html',
})
export class AvisComponent implements OnInit {
  avis?: IAvis[];
  isLoading = false;

  constructor(protected avisService: AvisService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.avisService.query().subscribe(
      (res: HttpResponse<IAvis[]>) => {
        this.isLoading = false;
        this.avis = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAvis): number {
    return item.id!;
  }

  delete(avis: IAvis): void {
    const modalRef = this.modalService.open(AvisDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.avis = avis;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
