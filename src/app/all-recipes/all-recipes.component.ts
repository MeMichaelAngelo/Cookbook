import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RecipeInterface } from '../interfaces/recipe';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-all-recepies',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AllRecipesComponent implements OnInit {
  allRecipes: RecipeInterface[] = [];
  selectedRecipe: RecipeInterface | null = null;

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.getAllRecipes();
  }

  getAllRecipes() {
    return this.recipesService.get().subscribe((data) => {
      this.allRecipes = data;
    });
  }

  displayRecipePreview(recipe: RecipeInterface) {
    this.recipesService.fetchRecipeById(recipe._id).subscribe((el) => {
      console.log(el);
      this.selectedRecipe = el;
    });
  }

  deleteRecipe(id: string) {
    this.recipesService.delete(id).subscribe(() => {
      this.allRecipes = this.allRecipes.filter((recipe) => recipe._id !== id);
    });
  }
}
