import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeInterface } from './interfaces/recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private http: HttpClient) {}

  getAllRecipes() {
    return this.http.get<RecipeInterface[]>('http://localhost:3000/recipe');
  }

  createRecipe(newRecipe: RecipeInterface) {
    return this.http.post<RecipeInterface>(
      'http://localhost:3000/recipe',
      newRecipe
    );
  }

  fetchRecipeById(id: string | undefined) {
    return this.http.get<RecipeInterface>(`http://localhost:3000/recipe/${id}`);
  }

  update(id: string, recipe: RecipeInterface) {
    return this.http.put(`http://localhost:3000/recipe/${id}`, recipe);
  }

  delete(id: string) {
    return this.http.delete(`http://localhost:3000/recipe/${id}`);
  }
}
