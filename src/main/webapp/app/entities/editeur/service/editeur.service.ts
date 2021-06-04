import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEditeur, getEditeurIdentifier } from '../editeur.model';

export type EntityResponseType = HttpResponse<IEditeur>;
export type EntityArrayResponseType = HttpResponse<IEditeur[]>;

@Injectable({ providedIn: 'root' })
export class EditeurService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/editeurs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(editeur: IEditeur): Observable<EntityResponseType> {
    return this.http.post<IEditeur>(this.resourceUrl, editeur, { observe: 'response' });
  }

  update(editeur: IEditeur): Observable<EntityResponseType> {
    return this.http.put<IEditeur>(`${this.resourceUrl}/${getEditeurIdentifier(editeur) as number}`, editeur, { observe: 'response' });
  }

  partialUpdate(editeur: IEditeur): Observable<EntityResponseType> {
    return this.http.patch<IEditeur>(`${this.resourceUrl}/${getEditeurIdentifier(editeur) as number}`, editeur, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEditeur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEditeur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEditeurToCollectionIfMissing(editeurCollection: IEditeur[], ...editeursToCheck: (IEditeur | null | undefined)[]): IEditeur[] {
    const editeurs: IEditeur[] = editeursToCheck.filter(isPresent);
    if (editeurs.length > 0) {
      const editeurCollectionIdentifiers = editeurCollection.map(editeurItem => getEditeurIdentifier(editeurItem)!);
      const editeursToAdd = editeurs.filter(editeurItem => {
        const editeurIdentifier = getEditeurIdentifier(editeurItem);
        if (editeurIdentifier == null || editeurCollectionIdentifiers.includes(editeurIdentifier)) {
          return false;
        }
        editeurCollectionIdentifiers.push(editeurIdentifier);
        return true;
      });
      return [...editeursToAdd, ...editeurCollection];
    }
    return editeurCollection;
  }
}
