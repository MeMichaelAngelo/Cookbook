import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RecipeInterface } from '../interfaces/recipe';
import { RecipiesService } from '../recipies.service';

@Component({
  selector: 'app-all-recepies',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AllRecipesComponent implements OnInit {
  allRecipies: RecipeInterface[] = [];
  selectedRecipe: RecipeInterface | null = null;

  constructor(private recipiesService: RecipiesService) {}

  ngOnInit(): void {
    this.getAllRecipies();
  }

  getAllRecipies() {
    return this.recipiesService.get().subscribe((data) => {
      this.allRecipies = data;
    });
  }

  displayRecipePreview(recipe: RecipeInterface) {
    this.recipiesService.fetchRecipeById(recipe._id).subscribe((el) => {
      console.log(el);
      this.selectedRecipe = el;
    });
  }

  delete(id: string) {
    this.recipiesService.delete(id).subscribe(() => {
      this.allRecipies = this.allRecipies.filter((recipe) => recipe._id !== id);
    });
  }
}
