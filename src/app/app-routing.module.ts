import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRecepiesComponent } from './all-recepies/all-recepies.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';

const routes: Routes = [
  {
    path: '',
    component: AllRecepiesComponent
  },
  {
    path: 'create',
    component: AddRecipeComponent
  },
  {
    path: 'edit/:id',
    component: EditRecipeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
