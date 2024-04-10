import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeInterface } from 'src/app/interfaces/recipe';
import { RecipesService } from 'src/app/recipes.service';

@Injectable()
export class RecipeResolver implements Resolve<RecipeInterface> {
  constructor(private recipeService: RecipesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<RecipeInterface> {
    return this.recipeService.fetchRecipeById(route.params['id']);
  }
}
