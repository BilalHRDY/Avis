import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAvis, getAvisIdentifier } from '../avis.model';

export type EntityResponseType = HttpResponse<IAvis>;
export type EntityArrayResponseType = HttpResponse<IAvis[]>;

@Injectable({ providedIn: 'root' })
export class AvisService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/avis');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(avis: IAvis): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avis);
    return this.http
      .post<IAvis>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(avis: IAvis): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avis);
    return this.http
      .put<IAvis>(`${this.resourceUrl}/${getAvisIdentifier(avis) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(avis: IAvis): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avis);
    return this.http
      .patch<IAvis>(`${this.resourceUrl}/${getAvisIdentifier(avis) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAvis>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAvis[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAvisToCollectionIfMissing(avisCollection: IAvis[], ...avisToCheck: (IAvis | null | undefined)[]): IAvis[] {
    const avis: IAvis[] = avisToCheck.filter(isPresent);
    if (avis.length > 0) {
      const avisCollectionIdentifiers = avisCollection.map(avisItem => getAvisIdentifier(avisItem)!);
      const avisToAdd = avis.filter(avisItem => {
        const avisIdentifier = getAvisIdentifier(avisItem);
        if (avisIdentifier == null || avisCollectionIdentifiers.includes(avisIdentifier)) {
          return false;
        }
        avisCollectionIdentifiers.push(avisIdentifier);
        return true;
      });
      return [...avisToAdd, ...avisCollection];
    }
    return avisCollection;
  }

  protected convertDateFromClient(avis: IAvis): IAvis {
    return Object.assign({}, avis, {
      dateEnvoi: avis.dateEnvoi?.isValid() ? avis.dateEnvoi.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateEnvoi = res.body.dateEnvoi ? dayjs(res.body.dateEnvoi) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((avis: IAvis) => {
        avis.dateEnvoi = avis.dateEnvoi ? dayjs(avis.dateEnvoi) : undefined;
      });
    }
    return res;
  }
}
