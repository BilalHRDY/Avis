import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IJoueur, Joueur } from '../joueur.model';
import { JoueurService } from '../service/joueur.service';
import { IAvis } from 'app/entities/avis/avis.model';
import { AvisService } from 'app/entities/avis/service/avis.service';

@Component({
  selector: 'jhi-joueur-update',
  templateUrl: './joueur-update.component.html',
})
export class JoueurUpdateComponent implements OnInit {
  isSaving = false;

  avisSharedCollection: IAvis[] = [];

  editForm = this.fb.group({
    id: [],
    pseudo: [],
    motDePasse: [],
    dateInscription: [],
    estAdministrateur: [],
    avis: [],
  });

  constructor(
    protected joueurService: JoueurService,
    protected avisService: AvisService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joueur }) => {
      if (joueur.id === undefined) {
        const today = dayjs().startOf('day');
        joueur.dateInscription = today;
      }

      this.updateForm(joueur);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const joueur = this.createFromForm();
    if (joueur.id !== undefined) {
      this.subscribeToSaveResponse(this.joueurService.update(joueur));
    } else {
      this.subscribeToSaveResponse(this.joueurService.create(joueur));
    }
  }

  trackAvisById(index: number, item: IAvis): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJoueur>>): void {
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

  protected updateForm(joueur: IJoueur): void {
    this.editForm.patchValue({
      id: joueur.id,
      pseudo: joueur.pseudo,
      motDePasse: joueur.motDePasse,
      dateInscription: joueur.dateInscription ? joueur.dateInscription.format(DATE_TIME_FORMAT) : null,
      estAdministrateur: joueur.estAdministrateur,
      avis: joueur.avis,
    });

    this.avisSharedCollection = this.avisService.addAvisToCollectionIfMissing(this.avisSharedCollection, joueur.avis);
  }

  protected loadRelationshipsOptions(): void {
    this.avisService
      .query()
      .pipe(map((res: HttpResponse<IAvis[]>) => res.body ?? []))
      .pipe(map((avis: IAvis[]) => this.avisService.addAvisToCollectionIfMissing(avis, this.editForm.get('avis')!.value)))
      .subscribe((avis: IAvis[]) => (this.avisSharedCollection = avis));
  }

  protected createFromForm(): IJoueur {
    return {
      ...new Joueur(),
      id: this.editForm.get(['id'])!.value,
      pseudo: this.editForm.get(['pseudo'])!.value,
      motDePasse: this.editForm.get(['motDePasse'])!.value,
      dateInscription: this.editForm.get(['dateInscription'])!.value
        ? dayjs(this.editForm.get(['dateInscription'])!.value, DATE_TIME_FORMAT)
        : undefined,
      estAdministrateur: this.editForm.get(['estAdministrateur'])!.value,
      avis: this.editForm.get(['avis'])!.value,
    };
  }
}
