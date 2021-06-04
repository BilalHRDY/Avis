jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJoueur, Joueur } from '../joueur.model';
import { JoueurService } from '../service/joueur.service';

import { JoueurRoutingResolveService } from './joueur-routing-resolve.service';

describe('Service Tests', () => {
  describe('Joueur routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JoueurRoutingResolveService;
    let service: JoueurService;
    let resultJoueur: IJoueur | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JoueurRoutingResolveService);
      service = TestBed.inject(JoueurService);
      resultJoueur = undefined;
    });

    describe('resolve', () => {
      it('should return IJoueur returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoueur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJoueur).toEqual({ id: 123 });
      });

      it('should return new IJoueur if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoueur = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJoueur).toEqual(new Joueur());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoueur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJoueur).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
