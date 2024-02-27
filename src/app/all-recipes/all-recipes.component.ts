import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RecipeInterface } from '../interfaces/recipe';
import { RecipesService } from '../recipes.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-all-recepies',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AllRecipesComponent implements OnInit {
  allRecipes: RecipeInterface[] = [];
  selectedRecipe: RecipeInterface | null = null;
  searchText: string = '';
  searchField: RecipeInterface[] = [];
  private searchTextSubject = new Subject<string>();

  constructor(private recipesService: RecipesService) {
    this.searchTextSubject.pipe(debounceTime(300)).subscribe(() => {
      this.searchTagOrRecipeName();
    });
  }

  ngOnInit(): void {
    this.getAllRecipes();
  }

  getAllRecipes() {
    return this.recipesService.getAllRecipes().subscribe((data) => {
      this.allRecipes = data;
      this.searchField = this.allRecipes;
    });
  }

  displayRecipePreview(recipe: RecipeInterface) {
    this.recipesService.fetchRecipeById(recipe._id).subscribe((recipe) => {
      this.selectedRecipe = recipe;
    });
  }

  deleteRecipe(id: string) {
    this.recipesService.delete(id).subscribe(() => {
      this.allRecipes = this.allRecipes.filter((recipe) => recipe._id !== id);
    });
  }

  searchTagOrRecipeName(): void {
    if (!this.searchText) {
      this.searchField = this.allRecipes;
      return;
    }
    this.searchField = this.allRecipes.filter((el) => {
      return (
        el.tags.some((tag) =>
          tag.toLowerCase().includes(this.searchText.toLowerCase())
        ) || el.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  onSearchTextChange(value: string): void {
    this.searchTextSubject.next(value);
  }
}
