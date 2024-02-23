import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { RecipeInterface } from '../interfaces/recipe';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { Ingredient } from '../interfaces/ingredient';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AddRecipeComponent implements OnInit {
  newRecipe: RecipeInterface = {
    name: '',
    ingredients: [],
    description: '',
    tags: [],
  };

  ingredient: Ingredient = {
    name: '',
    amount: null,
    type: 'g',
  };

  tag = '';

  readonly unitTypes = ['g', 'dag', 'kg', 'ml', 'l', 'szklanki', 'szt'];
  constructor(private recipesService: RecipesService, private router: Router) {}

  ngOnInit(): void {}

  addIngredient(): void {
    this.newRecipe.ingredients.push({
      name: this.ingredient.name,
      amount: this.ingredient.amount,
      type: this.ingredient.type,
    });
    this.ingredient.name = '';
    this.ingredient.type = 'g';
    this.ingredient.amount = null;
  }

  isButtonDisabled(): boolean {
    return !this.tag.trim();
  }

  addTag(): void {
    this.newRecipe.tags.push(this.tag);
    this.tag = '';
  }

  create(): void {
    this.recipesService.create(this.newRecipe).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  removeIngredient(ingredient: Ingredient) {
    this.newRecipe.ingredients = this.newRecipe.ingredients.filter(
      (item) => item !== ingredient
    );
  }

  removeTag(tag: string) {
    this.newRecipe.tags = this.newRecipe.tags.filter((item) => item !== tag);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Backspace' && this.newRecipe.name.length >= 40) {
      event.preventDefault();
    }
  }
}
