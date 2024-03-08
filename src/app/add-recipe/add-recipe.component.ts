import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RecipeInterface } from '../interfaces/recipe';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { Ingredient } from '../interfaces/ingredient';
import { KitchenMeasures } from '../enums/kitchen-measures.enum';
import { Subject, first, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AddRecipeComponent {
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
  kitchenMeasures = Object.values(KitchenMeasures);
  displayError: string | null = null;
  destroySubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private recipesService: RecipesService, private router: Router) {}

  addIngredient(): void {
    const { name, amount, type } = this.ingredient;
    const newIngredient = { name, amount, type };

    this.newRecipe.ingredients.push(newIngredient);
    this.newRecipe = { ...this.newRecipe };

    this.resetIngredient();
  }

  resetIngredient(): void {
    this.ingredient = {
      name: '',
      amount: null,
      type: 'g',
    };
  }

  disableTagWhenEmpty(): boolean {
    return !this.tag.trim() || !!this.displayError;
  }

  refreshTextForChild() {
    return (this.newRecipe = { ...this.newRecipe });
  }

  addTag(): void {
    this.newRecipe.tags.push(this.tag);
    this.newRecipe = { ...this.newRecipe };
    this.tag = '';
  }

  addTagByEnter(): void {
    if (this.tag.trim() !== '') {
      this.addTag();
    }
  }

  createRecipe(): void {
    this.recipesService
      .createRecipe(this.newRecipe)
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  removeIngredient(ingredient: Ingredient): void {
    this.newRecipe.ingredients = this.newRecipe.ingredients.filter(
      (item) => item !== ingredient
    );
  }

  removeTag(tag: string): void {
    this.newRecipe.tags = this.newRecipe.tags.filter((item) => item !== tag);
  }

  handlingOfRecipeTitle(event: KeyboardEvent): void {
    if (event.key !== 'Backspace' && this.newRecipe.name.length >= 40) {
      event.preventDefault();
    }
  }

  preventTagRepetiton(value: string) {
    const tag = this.newRecipe.tags.find((el) => el === value);
    this.displayError = tag ? 'Tag istnieje' : null;
  }

  ngOnDestroy() {
    this.destroySubscribe$.unsubscribe();
  }
}
