jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JoueurService } from '../service/joueur.service';
import { IJoueur, Joueur } from '../joueur.model';
import { IAvis } from 'app/entities/avis/avis.model';
import { AvisService } from 'app/entities/avis/service/avis.service';

import { JoueurUpdateComponent } from './joueur-update.component';

describe('Component Tests', () => {
  describe('Joueur Management Update Component', () => {
    let comp: JoueurUpdateComponent;
    let fixture: ComponentFixture<JoueurUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let joueurService: JoueurService;
    let avisService: AvisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JoueurUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JoueurUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JoueurUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      joueurService = TestBed.inject(JoueurService);
      avisService = TestBed.inject(AvisService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Avis query and add missing value', () => {
        const joueur: IJoueur = { id: 456 };
        const avis: IAvis = { id: 8874 };
        joueur.avis = avis;

        const avisCollection: IAvis[] = [{ id: 34816 }];
        spyOn(avisService, 'query').and.returnValue(of(new HttpResponse({ body: avisCollection })));
        const additionalAvis = [avis];
        const expectedCollection: IAvis[] = [...additionalAvis, ...avisCollection];
        spyOn(avisService, 'addAvisToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ joueur });
        comp.ngOnInit();

        expect(avisService.query).toHaveBeenCalled();
        expect(avisService.addAvisToCollectionIfMissing).toHaveBeenCalledWith(avisCollection, ...additionalAvis);
        expect(comp.avisSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const joueur: IJoueur = { id: 456 };
        const avis: IAvis = { id: 38917 };
        joueur.avis = avis;

        activatedRoute.data = of({ joueur });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(joueur));
        expect(comp.avisSharedCollection).toContain(avis);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joueur = { id: 123 };
        spyOn(joueurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joueur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: joueur }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(joueurService.update).toHaveBeenCalledWith(joueur);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joueur = new Joueur();
        spyOn(joueurService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joueur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: joueur }));
        saveSubject.complete();

        // THEN
        expect(joueurService.create).toHaveBeenCalledWith(joueur);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joueur = { id: 123 };
        spyOn(joueurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joueur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(joueurService.update).toHaveBeenCalledWith(joueur);
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
