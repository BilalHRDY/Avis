import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAvis, Avis } from '../avis.model';
import { AvisService } from '../service/avis.service';

@Component({
  selector: 'jhi-avis-update',
  templateUrl: './avis-update.component.html',
})
export class AvisUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    note: [],
    description: [],
    dateEnvoi: [],
  });

  constructor(protected avisService: AvisService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ avis }) => {
      if (avis.id === undefined) {
        const today = dayjs().startOf('day');
        avis.dateEnvoi = today;
      }

      this.updateForm(avis);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const avis = this.createFromForm();
    if (avis.id !== undefined) {
      this.subscribeToSaveResponse(this.avisService.update(avis));
    } else {
      this.subscribeToSaveResponse(this.avisService.create(avis));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAvis>>): void {
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

  protected updateForm(avis: IAvis): void {
    this.editForm.patchValue({
      id: avis.id,
      note: avis.note,
      description: avis.description,
      dateEnvoi: avis.dateEnvoi ? avis.dateEnvoi.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IAvis {
    return {
      ...new Avis(),
      id: this.editForm.get(['id'])!.value,
      note: this.editForm.get(['note'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateEnvoi: this.editForm.get(['dateEnvoi'])!.value ? dayjs(this.editForm.get(['dateEnvoi'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
