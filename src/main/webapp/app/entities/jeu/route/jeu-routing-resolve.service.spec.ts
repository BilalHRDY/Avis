jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJeu, Jeu } from '../jeu.model';
import { JeuService } from '../service/jeu.service';

import { JeuRoutingResolveService } from './jeu-routing-resolve.service';

describe('Service Tests', () => {
  describe('Jeu routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JeuRoutingResolveService;
    let service: JeuService;
    let resultJeu: IJeu | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JeuRoutingResolveService);
      service = TestBed.inject(JeuService);
      resultJeu = undefined;
    });

    describe('resolve', () => {
      it('should return IJeu returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJeu = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJeu).toEqual({ id: 123 });
      });

      it('should return new IJeu if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJeu = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJeu).toEqual(new Jeu());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJeu = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJeu).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
