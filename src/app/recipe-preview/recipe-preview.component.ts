import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RecipeInterface } from '../interfaces/recipe';
import { Ingredient } from '../interfaces/ingredient';

@Component({
  selector: 'app-recipe-preview',
  templateUrl: './recipe-preview.component.html',
  styleUrls: ['./recipe-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecipePreviewComponent {
  @Input()
  choosedRecipe: RecipeInterface | null = null;

  @Input()
  isPreviewMode: boolean = false;

  constructor() {}

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
