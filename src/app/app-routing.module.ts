import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRecipesComponent } from './all-recipes/all-recipes.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { RecipeResolver } from 'src/resolvers/recipe.resolver';

const routes: Routes = [
  {
    path: '',
    component: AllRecipesComponent,
  },
  {
    path: 'create',
    component: AddRecipeComponent,
  },
  {
    path: 'edit/:id',
    component: EditRecipeComponent,
    resolve: { recipe: RecipeResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
