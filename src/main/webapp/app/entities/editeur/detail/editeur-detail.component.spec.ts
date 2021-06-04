import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EditeurDetailComponent } from './editeur-detail.component';

describe('Component Tests', () => {
  describe('Editeur Management Detail Component', () => {
    let comp: EditeurDetailComponent;
    let fixture: ComponentFixture<EditeurDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EditeurDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ editeur: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EditeurDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EditeurDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load editeur on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.editeur).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
