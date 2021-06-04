jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEditeur, Editeur } from '../editeur.model';
import { EditeurService } from '../service/editeur.service';

import { EditeurRoutingResolveService } from './editeur-routing-resolve.service';

describe('Service Tests', () => {
  describe('Editeur routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EditeurRoutingResolveService;
    let service: EditeurService;
    let resultEditeur: IEditeur | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EditeurRoutingResolveService);
      service = TestBed.inject(EditeurService);
      resultEditeur = undefined;
    });

    describe('resolve', () => {
      it('should return IEditeur returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEditeur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEditeur).toEqual({ id: 123 });
      });

      it('should return new IEditeur if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEditeur = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEditeur).toEqual(new Editeur());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEditeur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEditeur).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
