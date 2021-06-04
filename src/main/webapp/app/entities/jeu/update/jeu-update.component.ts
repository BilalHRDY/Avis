import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IJeu, Jeu } from '../jeu.model';
import { JeuService } from '../service/jeu.service';
import { IAvis } from 'app/entities/avis/avis.model';
import { AvisService } from 'app/entities/avis/service/avis.service';

@Component({
  selector: 'jhi-jeu-update',
  templateUrl: './jeu-update.component.html',
})
export class JeuUpdateComponent implements OnInit {
  isSaving = false;

  avisSharedCollection: IAvis[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    description: [],
    dateSortie: [],
    avis: [],
  });

  constructor(
    protected jeuService: JeuService,
    protected avisService: AvisService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jeu }) => {
      if (jeu.id === undefined) {
        const today = dayjs().startOf('day');
        jeu.dateSortie = today;
      }

      this.updateForm(jeu);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jeu = this.createFromForm();
    if (jeu.id !== undefined) {
      this.subscribeToSaveResponse(this.jeuService.update(jeu));
    } else {
      this.subscribeToSaveResponse(this.jeuService.create(jeu));
    }
  }

  trackAvisById(index: number, item: IAvis): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJeu>>): void {
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

  protected updateForm(jeu: IJeu): void {
    this.editForm.patchValue({
      id: jeu.id,
      nom: jeu.nom,
      description: jeu.description,
      dateSortie: jeu.dateSortie ? jeu.dateSortie.format(DATE_TIME_FORMAT) : null,
      avis: jeu.avis,
    });

    this.avisSharedCollection = this.avisService.addAvisToCollectionIfMissing(this.avisSharedCollection, jeu.avis);
  }

  protected loadRelationshipsOptions(): void {
    this.avisService
      .query()
      .pipe(map((res: HttpResponse<IAvis[]>) => res.body ?? []))
      .pipe(map((avis: IAvis[]) => this.avisService.addAvisToCollectionIfMissing(avis, this.editForm.get('avis')!.value)))
      .subscribe((avis: IAvis[]) => (this.avisSharedCollection = avis));
  }

  protected createFromForm(): IJeu {
    return {
      ...new Jeu(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateSortie: this.editForm.get(['dateSortie'])!.value ? dayjs(this.editForm.get(['dateSortie'])!.value, DATE_TIME_FORMAT) : undefined,
      avis: this.editForm.get(['avis'])!.value,
    };
  }
}
