import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeInterface } from './interfaces/recipe';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private http: HttpClient) {}

  getAllRecipes() {
    return this.http.get<RecipeInterface[]>('http://localhost:3000/recipe');
  }

  getRecipesForPagination(
    page: number,
    limit: number,
    textSearch: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());
    params = params.append('name', textSearch);
    return this.http.get<RecipeInterface[]>(
      'http://localhost:3000/recipe/pagination',
      { params }
    );
  }

  createRecipe(newRecipe: RecipeInterface) {
    console.log(newRecipe);
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
