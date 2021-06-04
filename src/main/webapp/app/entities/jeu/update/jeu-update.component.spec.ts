jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JeuService } from '../service/jeu.service';
import { IJeu, Jeu } from '../jeu.model';
import { IAvis } from 'app/entities/avis/avis.model';
import { AvisService } from 'app/entities/avis/service/avis.service';

import { JeuUpdateComponent } from './jeu-update.component';

describe('Component Tests', () => {
  describe('Jeu Management Update Component', () => {
    let comp: JeuUpdateComponent;
    let fixture: ComponentFixture<JeuUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jeuService: JeuService;
    let avisService: AvisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JeuUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JeuUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JeuUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jeuService = TestBed.inject(JeuService);
      avisService = TestBed.inject(AvisService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Avis query and add missing value', () => {
        const jeu: IJeu = { id: 456 };
        const avis: IAvis = { id: 69990 };
        jeu.avis = avis;

        const avisCollection: IAvis[] = [{ id: 48274 }];
        spyOn(avisService, 'query').and.returnValue(of(new HttpResponse({ body: avisCollection })));
        const additionalAvis = [avis];
        const expectedCollection: IAvis[] = [...additionalAvis, ...avisCollection];
        spyOn(avisService, 'addAvisToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        expect(avisService.query).toHaveBeenCalled();
        expect(avisService.addAvisToCollectionIfMissing).toHaveBeenCalledWith(avisCollection, ...additionalAvis);
        expect(comp.avisSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const jeu: IJeu = { id: 456 };
        const avis: IAvis = { id: 7835 };
        jeu.avis = avis;

        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jeu));
        expect(comp.avisSharedCollection).toContain(avis);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jeu = { id: 123 };
        spyOn(jeuService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jeu }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jeuService.update).toHaveBeenCalledWith(jeu);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jeu = new Jeu();
        spyOn(jeuService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jeu }));
        saveSubject.complete();

        // THEN
        expect(jeuService.create).toHaveBeenCalledWith(jeu);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jeu = { id: 123 };
        spyOn(jeuService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jeu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jeuService.update).toHaveBeenCalledWith(jeu);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAvisById', () => {
        it('Should return tracked Avis primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAvisById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
