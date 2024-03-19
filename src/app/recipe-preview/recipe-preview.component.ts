import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Ingredient } from '../interfaces/ingredient';
import { Subscription } from 'rxjs';
import { RecipeInterface } from '../interfaces/recipe';

@Component({
  selector: 'app-recipe-preview',
  templateUrl: './recipe-preview.component.html',
  styleUrls: ['./recipe-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecipePreviewComponent {
  @Input()
  choosedRecipe!: RecipeInterface;
  @Input()
  isPreviewMode: boolean = false;
  subscription: Subscription | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  removeTag(tag: string) {
    if (this.choosedRecipe != null) {
      this.choosedRecipe.tags = this.choosedRecipe?.tags.filter(
        (item) => item !== tag
      );
    }
  }

  removeIngredient(ingredient: Ingredient) {
    if (this.choosedRecipe != null) {
      this.choosedRecipe.ingredients = this.choosedRecipe.ingredients.filter(
        (item) => item !== ingredient
      );
    }
  }
}
