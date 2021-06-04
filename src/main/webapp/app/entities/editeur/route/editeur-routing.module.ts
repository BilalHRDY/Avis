import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EditeurComponent } from '../list/editeur.component';
import { EditeurDetailComponent } from '../detail/editeur-detail.component';
import { EditeurUpdateComponent } from '../update/editeur-update.component';
import { EditeurRoutingResolveService } from './editeur-routing-resolve.service';

const editeurRoute: Routes = [
  {
    path: '',
    component: EditeurComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EditeurDetailComponent,
    resolve: {
      editeur: EditeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EditeurUpdateComponent,
    resolve: {
      editeur: EditeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EditeurUpdateComponent,
    resolve: {
      editeur: EditeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(editeurRoute)],
  exports: [RouterModule],
})
export class EditeurRoutingModule {}
