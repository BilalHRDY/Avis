import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJeu, getJeuIdentifier } from '../jeu.model';

export type EntityResponseType = HttpResponse<IJeu>;
export type EntityArrayResponseType = HttpResponse<IJeu[]>;

@Injectable({ providedIn: 'root' })
export class JeuService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/jeus');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(jeu: IJeu): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jeu);
    return this.http
      .post<IJeu>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(jeu: IJeu): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jeu);
    return this.http
      .put<IJeu>(`${this.resourceUrl}/${getJeuIdentifier(jeu) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(jeu: IJeu): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jeu);
    return this.http
      .patch<IJeu>(`${this.resourceUrl}/${getJeuIdentifier(jeu) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IJeu>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IJeu[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJeuToCollectionIfMissing(jeuCollection: IJeu[], ...jeusToCheck: (IJeu | null | undefined)[]): IJeu[] {
    const jeus: IJeu[] = jeusToCheck.filter(isPresent);
    if (jeus.length > 0) {
      const jeuCollectionIdentifiers = jeuCollection.map(jeuItem => getJeuIdentifier(jeuItem)!);
      const jeusToAdd = jeus.filter(jeuItem => {
        const jeuIdentifier = getJeuIdentifier(jeuItem);
        if (jeuIdentifier == null || jeuCollectionIdentifiers.includes(jeuIdentifier)) {
          return false;
        }
        jeuCollectionIdentifiers.push(jeuIdentifier);
        return true;
      });
      return [...jeusToAdd, ...jeuCollection];
    }
    return jeuCollection;
  }

  protected convertDateFromClient(jeu: IJeu): IJeu {
    return Object.assign({}, jeu, {
      dateSortie: jeu.dateSortie?.isValid() ? jeu.dateSortie.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateSortie = res.body.dateSortie ? dayjs(res.body.dateSortie) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((jeu: IJeu) => {
        jeu.dateSortie = jeu.dateSortie ? dayjs(jeu.dateSortie) : undefined;
      });
    }
    return res;
  }
}
