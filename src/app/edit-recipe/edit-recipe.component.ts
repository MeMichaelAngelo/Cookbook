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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-recipe',
  styleUrls: ['./edit-recipe.component.scss'],
  templateUrl: './edit-recipe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditRecipeComponent implements OnInit {
  itemId: string = '';
  tag: string = '';
  destroySubscribe$: Subject<boolean> = new Subject<boolean>();
  displayError: string | null = null;
  kitchenMeasures = Object.values(KitchenMeasures);
  recipe!: RecipeInterface;
  recipeForm!: FormGroup;
  ingredientForm!: FormGroup;
  mobilePreview: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.params['id'];
    this.initForms();
    this.getRecipe();
  }

  getRecipe() {
    this.recipesService
      .fetchRecipeById(this.itemId)
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe((data) => {
        this.recipe = data;
        this.recipeForm.patchValue({
          name: data.name,
          description: data.description,
        });
        this.cdr.detectChanges();
      });
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

  addAndResetIngredient(): void {
    this.recipe.ingredients.push(this.ingredientForm.value);
    this.recipe = { ...this.recipe };
    this.resetIngredient();
  }

  private resetIngredient(): void {
    this.ingredientForm?.setValue({
      name: null,
      amount: null,
      type: KitchenMeasures.GRAM,
    });
    this.ingredientForm.markAsUntouched();
  }

  addTagByEnter(): void {
    if (this.tag.trim() !== '') {
      this.addTag();
    }
  }

  addTag(): void {
    this.recipe.tags.push(this.tag);
    this.recipe = { ...this.recipe };
    this.tag = '';
  }

  disableTagButtonIfEmpty(): boolean {
    return !this.tag.trim() || !!this.displayError;
  }

  preventTagRepetiton(value: string) {
    const tag = this.recipe?.tags?.find((el: string) => el === value);
    this.displayError = tag ? 'Taki tag już istnieje' : null;
  }

  removeIngredient(ingredient: Ingredient) {
    this.recipe.ingredients = this.recipe.ingredients.filter(
      (item) => item !== ingredient
    );
  }

  removeTag(tag: string) {
    this.recipe.tags = this.recipe.tags.filter((item) => item !== tag);
  }

  handlingOfRecipeTitle(event: KeyboardEvent): void {
    if (event.key !== 'Backspace' && this.recipe.name.length >= 40) {
      event.preventDefault();
    }
  }

  addIngredientValidator(): boolean {
    return (
      !this.ingredientForm.value.name ||
      !this.ingredientForm.value.type ||
      !this.ingredientForm.value.amount
    );
  }

  updateRecipe(): void {
    if (!this.recipeForm.value || !this.ingredientForm.value) return;
    this.recipesService
      .update(this.itemId, this.recipe)
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe(() => {
        this.router.navigate(['']).then();
      });
  }

  fetchErrors(controlName: string, form: FormGroup): string[] | undefined {
    const formControl = form.get(controlName);
    if (!formControl?.touched) return;

    return formControl?.errors ? Object.values(formControl?.errors) : [];
  }

  openMobilePreview() {
    this.mobilePreview = true;
  }

  closeMobilePreview() {
    this.mobilePreview = false;
  }

  ngOnDestroy() {
    this.destroySubscribe$.unsubscribe();
  }
}
