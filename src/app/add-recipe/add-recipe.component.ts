import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { KitchenMeasures } from '../enums/kitchen-measures.enum';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from '../interfaces/ingredient';
import { RecipeInterface } from '../interfaces/recipe';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AddRecipeComponent {
  tag = '';
  kitchenMeasures = Object.values(KitchenMeasures);
  recipeForm!: FormGroup;
  ingredientForm!: FormGroup;
  displayError: string | null = null;
  destroySubscribe$: Subject<boolean> = new Subject<boolean>();
  ingredientArray: Ingredient[] = [];

  get wholeForm(): RecipeInterface {
    return {
      ...this.recipeForm.value,
      ingredients: this.ingredientArray,
    };
  }

  constructor(
    private recipesService: RecipesService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      tags: this.fb.array([]),
    });

    this.ingredientForm = this.fb.group({
      name: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      type: [KitchenMeasures.GRAM, Validators.required],
    });
  }

  addIngredientValidator(): boolean {
    let ingredientFormStatus = this.ingredientForm.status;
    return ingredientFormStatus === 'INVALID';
  }

  addAndResetIngredient(): void {
    this.ingredientArray.push(this.ingredientForm.value);
    this.resetIngredientFields();
  }

  private resetIngredientFields(): void {
    this.ingredientForm?.setValue({
      name: null,
      amount: null,
      type: KitchenMeasures.GRAM,
    });
    this.ingredientForm.markAsUntouched();
  }

  disableTagIfEmpty(): boolean {
    return !this.tag.trim() || !!this.displayError;
  }

  addTag(): void {
    let formTags = this.recipeForm.get('tags')?.value;
    formTags.push(this.tag);
    formTags = { ...formTags };
    this.tag = '';
  }

  addTagByEnter(): void {
    if (this.tag.trim() !== '') {
      this.addTag();
    }
  }

  createRecipe(): void {
    if (this.recipeForm.valid && this.ingredientArray.length > 0) {
      this.recipesService
        .createRecipe({
          ...this.recipeForm.value,
          ingredients: [...this.ingredientArray],
        })
        .pipe(takeUntil(this.destroySubscribe$))
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
  }

  recipeNameValidation(event: KeyboardEvent): void {
    if (
      event.key !== 'Backspace' &&
      this.recipeForm.get('name')?.value.length >= 40
    ) {
      event.preventDefault();
    }
  }

  preventTagRepetiton(value: string) {
    const tag = this.recipeForm
      .get('tags')
      ?.value.find((el: string) => el === value);
    this.displayError = tag ? 'Taki tag już istnieje' : null;
  }

  ngOnDestroy() {
    this.destroySubscribe$.unsubscribe();
  }

  fetchErrors(controlName: string, form: FormGroup): string[] | undefined {
    const formControl = form.get(controlName);
    if (!formControl?.touched) return;

    return formControl?.errors ? Object.values(formControl?.errors) : [];
  }
}
