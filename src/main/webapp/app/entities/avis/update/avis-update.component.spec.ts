jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AvisService } from '../service/avis.service';
import { IAvis, Avis } from '../avis.model';

import { AvisUpdateComponent } from './avis-update.component';

describe('Component Tests', () => {
  describe('Avis Management Update Component', () => {
    let comp: AvisUpdateComponent;
    let fixture: ComponentFixture<AvisUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let avisService: AvisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AvisUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AvisUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AvisUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      avisService = TestBed.inject(AvisService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const avis: IAvis = { id: 456 };

        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(avis));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avis = { id: 123 };
        spyOn(avisService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: avis }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(avisService.update).toHaveBeenCalledWith(avis);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avis = new Avis();
        spyOn(avisService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: avis }));
        saveSubject.complete();

        // THEN
        expect(avisService.create).toHaveBeenCalledWith(avis);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const avis = { id: 123 };
        spyOn(avisService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ avis });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(avisService.update).toHaveBeenCalledWith(avis);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
