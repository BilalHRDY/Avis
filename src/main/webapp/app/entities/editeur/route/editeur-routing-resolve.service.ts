import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEditeur, Editeur } from '../editeur.model';
import { EditeurService } from '../service/editeur.service';

@Injectable({ providedIn: 'root' })
export class EditeurRoutingResolveService implements Resolve<IEditeur> {
  constructor(protected service: EditeurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEditeur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((editeur: HttpResponse<Editeur>) => {
          if (editeur.body) {
            return of(editeur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Editeur());
  }
}
