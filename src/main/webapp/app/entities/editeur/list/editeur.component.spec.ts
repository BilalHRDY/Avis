import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EditeurService } from '../service/editeur.service';

import { EditeurComponent } from './editeur.component';

describe('Component Tests', () => {
  describe('Editeur Management Component', () => {
    let comp: EditeurComponent;
    let fixture: ComponentFixture<EditeurComponent>;
    let service: EditeurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EditeurComponent],
      })
        .overrideTemplate(EditeurComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EditeurComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EditeurService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.editeurs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
