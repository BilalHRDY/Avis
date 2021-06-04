import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEditeur, Editeur } from '../editeur.model';

import { EditeurService } from './editeur.service';

describe('Service Tests', () => {
  describe('Editeur Service', () => {
    let service: EditeurService;
    let httpMock: HttpTestingController;
    let elemDefault: IEditeur;
    let expectedResult: IEditeur | IEditeur[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EditeurService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Editeur', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Editeur()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Editeur', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Editeur', () => {
        const patchObject = Object.assign(
          {
            nom: 'BBBBBB',
          },
          new Editeur()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Editeur', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Editeur', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEditeurToCollectionIfMissing', () => {
        it('should add a Editeur to an empty array', () => {
          const editeur: IEditeur = { id: 123 };
          expectedResult = service.addEditeurToCollectionIfMissing([], editeur);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(editeur);
        });

        it('should not add a Editeur to an array that contains it', () => {
          const editeur: IEditeur = { id: 123 };
          const editeurCollection: IEditeur[] = [
            {
              ...editeur,
            },
            { id: 456 },
          ];
          expectedResult = service.addEditeurToCollectionIfMissing(editeurCollection, editeur);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Editeur to an array that doesn't contain it", () => {
          const editeur: IEditeur = { id: 123 };
          const editeurCollection: IEditeur[] = [{ id: 456 }];
          expectedResult = service.addEditeurToCollectionIfMissing(editeurCollection, editeur);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(editeur);
        });

        it('should add only unique Editeur to an array', () => {
          const editeurArray: IEditeur[] = [{ id: 123 }, { id: 456 }, { id: 22000 }];
          const editeurCollection: IEditeur[] = [{ id: 123 }];
          expectedResult = service.addEditeurToCollectionIfMissing(editeurCollection, ...editeurArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const editeur: IEditeur = { id: 123 };
          const editeur2: IEditeur = { id: 456 };
          expectedResult = service.addEditeurToCollectionIfMissing([], editeur, editeur2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(editeur);
          expect(expectedResult).toContain(editeur2);
        });

        it('should accept null and undefined values', () => {
          const editeur: IEditeur = { id: 123 };
          expectedResult = service.addEditeurToCollectionIfMissing([], null, editeur, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(editeur);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
