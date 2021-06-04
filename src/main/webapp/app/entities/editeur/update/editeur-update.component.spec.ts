jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EditeurService } from '../service/editeur.service';
import { IEditeur, Editeur } from '../editeur.model';
import { IJeu } from 'app/entities/jeu/jeu.model';
import { JeuService } from 'app/entities/jeu/service/jeu.service';

import { EditeurUpdateComponent } from './editeur-update.component';

describe('Component Tests', () => {
  describe('Editeur Management Update Component', () => {
    let comp: EditeurUpdateComponent;
    let fixture: ComponentFixture<EditeurUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let editeurService: EditeurService;
    let jeuService: JeuService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EditeurUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EditeurUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EditeurUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      editeurService = TestBed.inject(EditeurService);
      jeuService = TestBed.inject(JeuService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Jeu query and add missing value', () => {
        const editeur: IEditeur = { id: 456 };
        const jeu: IJeu = { id: 73746 };
        editeur.jeu = jeu;

        const jeuCollection: IJeu[] = [{ id: 6220 }];
        spyOn(jeuService, 'query').and.returnValue(of(new HttpResponse({ body: jeuCollection })));
        const additionalJeus = [jeu];
        const expectedCollection: IJeu[] = [...additionalJeus, ...jeuCollection];
        spyOn(jeuService, 'addJeuToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ editeur });
        comp.ngOnInit();

        expect(jeuService.query).toHaveBeenCalled();
        expect(jeuService.addJeuToCollectionIfMissing).toHaveBeenCalledWith(jeuCollection, ...additionalJeus);
        expect(comp.jeusSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const editeur: IEditeur = { id: 456 };
        const jeu: IJeu = { id: 4146 };
        editeur.jeu = jeu;

        activatedRoute.data = of({ editeur });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(editeur));
        expect(comp.jeusSharedCollection).toContain(jeu);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const editeur = { id: 123 };
        spyOn(editeurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ editeur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: editeur }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(editeurService.update).toHaveBeenCalledWith(editeur);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const editeur = new Editeur();
        spyOn(editeurService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ editeur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: editeur }));
        saveSubject.complete();

        // THEN
        expect(editeurService.create).toHaveBeenCalledWith(editeur);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const editeur = { id: 123 };
        spyOn(editeurService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ editeur });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(editeurService.update).toHaveBeenCalledWith(editeur);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackJeuById', () => {
        it('Should return tracked Jeu primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJeuById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
