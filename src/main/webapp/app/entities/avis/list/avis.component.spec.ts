import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AvisService } from '../service/avis.service';

import { AvisComponent } from './avis.component';

describe('Component Tests', () => {
  describe('Avis Management Component', () => {
    let comp: AvisComponent;
    let fixture: ComponentFixture<AvisComponent>;
    let service: AvisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AvisComponent],
      })
        .overrideTemplate(AvisComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AvisComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AvisService);

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
      expect(comp.avis?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
