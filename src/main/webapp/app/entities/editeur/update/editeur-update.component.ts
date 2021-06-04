import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEditeur, Editeur } from '../editeur.model';
import { EditeurService } from '../service/editeur.service';
import { IJeu } from 'app/entities/jeu/jeu.model';
import { JeuService } from 'app/entities/jeu/service/jeu.service';

@Component({
  selector: 'jhi-editeur-update',
  templateUrl: './editeur-update.component.html',
})
export class EditeurUpdateComponent implements OnInit {
  isSaving = false;

  jeusSharedCollection: IJeu[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    jeu: [],
  });

  constructor(
    protected editeurService: EditeurService,
    protected jeuService: JeuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ editeur }) => {
      this.updateForm(editeur);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const editeur = this.createFromForm();
    if (editeur.id !== undefined) {
      this.subscribeToSaveResponse(this.editeurService.update(editeur));
    } else {
      this.subscribeToSaveResponse(this.editeurService.create(editeur));
    }
  }

  trackJeuById(index: number, item: IJeu): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEditeur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(editeur: IEditeur): void {
    this.editForm.patchValue({
      id: editeur.id,
      nom: editeur.nom,
      jeu: editeur.jeu,
    });

    this.jeusSharedCollection = this.jeuService.addJeuToCollectionIfMissing(this.jeusSharedCollection, editeur.jeu);
  }

  protected loadRelationshipsOptions(): void {
    this.jeuService
      .query()
      .pipe(map((res: HttpResponse<IJeu[]>) => res.body ?? []))
      .pipe(map((jeus: IJeu[]) => this.jeuService.addJeuToCollectionIfMissing(jeus, this.editForm.get('jeu')!.value)))
      .subscribe((jeus: IJeu[]) => (this.jeusSharedCollection = jeus));
  }

  protected createFromForm(): IEditeur {
    return {
      ...new Editeur(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      jeu: this.editForm.get(['jeu'])!.value,
    };
  }
}
