import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipiesService } from '../recipies.service';
import { RecipeInterface } from '../interfaces/recipe';
import { Ingredient } from '../interfaces/ingredient';

@Component({
  selector: 'app-edit-recipe',
  styleUrls: ['./edit-recipe.component.scss'],
  templateUrl: './edit-recipe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditRecipeComponent implements OnInit {
  itemId: string = '';
  tag = '';
  readonly unitTypes = ['g', 'dag', 'kg', 'ml', 'l', 'szklanki', 'szt'];

  recipe: RecipeInterface = {
    name: '',
    ingredients: [],
    description: '',
    tags: [],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipiesService: RecipiesService
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.params['id'];
    this.getRecipe();
  }

  ingredient: Ingredient = {
    name: '',
    amount: null,
    type: 'g',
  };

  getRecipe() {
    this.recipiesService.fetchRecipeById(this.itemId).subscribe((data) => {
      this.recipe = data;
    });
  }

  addIngredient(): void {
    this.recipe.ingredients.push({
      name: this.ingredient.name,
      amount: this.ingredient.amount,
      type: this.ingredient.type,
    });
    this.ingredient.name = '';
    this.ingredient.type = 'g';
    this.ingredient.amount = null;
    console.log(this.recipe.ingredients);
  }

  removeIngredient(ingredient: Ingredient) {
    this.recipe.ingredients = this.recipe.ingredients.filter(
      (item) => item !== ingredient
    );
  }

  removeTag(tag: string) {
    this.recipe.tags = this.recipe.tags.filter((item) => item !== tag);
  }

  isButtonDisabled(): boolean {
    return !this.tag.trim();
  }

  addTag(): void {
    this.recipe.tags.push(this.tag);
    this.tag = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Backspace' && this.recipe.name.length >= 40) {
      event.preventDefault();
    }
  }

  update() {
    this.recipiesService.update(this.itemId, this.recipe).subscribe(() => {
      this.router.navigate(['/']).then();
    });
  }
}
