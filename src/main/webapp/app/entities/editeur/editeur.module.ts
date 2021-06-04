import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EditeurComponent } from './list/editeur.component';
import { EditeurDetailComponent } from './detail/editeur-detail.component';
import { EditeurUpdateComponent } from './update/editeur-update.component';
import { EditeurDeleteDialogComponent } from './delete/editeur-delete-dialog.component';
import { EditeurRoutingModule } from './route/editeur-routing.module';

@NgModule({
  imports: [SharedModule, EditeurRoutingModule],
  declarations: [EditeurComponent, EditeurDetailComponent, EditeurUpdateComponent, EditeurDeleteDialogComponent],
  entryComponents: [EditeurDeleteDialogComponent],
})
export class EditeurModule {}
