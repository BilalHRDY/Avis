import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEditeur } from '../editeur.model';

@Component({
  selector: 'jhi-editeur-detail',
  templateUrl: './editeur-detail.component.html',
})
export class EditeurDetailComponent implements OnInit {
  editeur: IEditeur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ editeur }) => {
      this.editeur = editeur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
