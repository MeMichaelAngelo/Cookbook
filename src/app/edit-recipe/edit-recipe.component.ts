import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../recipes.service';
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
    private recipesService: RecipesService,
    private cdr: ChangeDetectorRef
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
    this.recipesService.fetchRecipeById(this.itemId).subscribe((data) => {
      this.recipe = data;
      this.cdr.detectChanges();
    });
  }

  addIngredient(): void {
    const newIngredient = {
      name: this.ingredient.name,
      amount: this.ingredient.amount,
      type: this.ingredient.type,
    };
    this.recipe.ingredients.push(newIngredient);
    this.recipe = { ...this.recipe };
    this.ingredient.name = '';
    this.ingredient.type = 'g';
    this.ingredient.amount = null;
  }

  addTagByEnter(): void {
    if (this.tag.trim() !== '') {
      this.addTag();
    }
  }

  refreshTextForChild() {
    return (this.recipe = { ...this.recipe });
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
    this.recipe = { ...this.recipe };
    this.tag = '';
  }

  handlingOfRecipeTitle(event: KeyboardEvent): void {
    if (event.key !== 'Backspace' && this.recipe.name.length >= 40) {
      event.preventDefault();
    }
  }

  update() {
    this.recipesService.update(this.itemId, this.recipe).subscribe(() => {
      this.router.navigate(['/']).then();
    });
  }
}
