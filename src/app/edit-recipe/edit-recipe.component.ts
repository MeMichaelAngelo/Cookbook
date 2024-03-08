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
import { Subject, takeUntil } from 'rxjs';
import { KitchenMeasures } from '../enums/kitchen-measures.enum';

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
  destroySubscribe$: Subject<boolean> = new Subject<boolean>();
  kitchenMeasures = Object.values(KitchenMeasures);

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
    this.recipesService
      .fetchRecipeById(this.itemId)
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe((data) => {
        this.recipe = data;
        this.cdr.detectChanges();
      });
  }

  addIngredient(): void {
    const { name, amount, type } = this.ingredient;
    const newIngredient = { name, amount, type };

    this.recipe.ingredients.push(newIngredient);
    this.recipe = { ...this.recipe };

    this.resetIngredient();
  }

  resetIngredient(): void {
    this.ingredient = {
      name: '',
      amount: null,
      type: 'g',
    };
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
    this.recipesService
      .update(this.itemId, this.recipe)
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe(() => {
        this.router.navigate(['/']).then();
      });
  }
}
