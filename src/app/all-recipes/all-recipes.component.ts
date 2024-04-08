import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { RecipeInterface } from '../interfaces/recipe';
import { RecipesService } from '../recipes.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-recepies',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AllRecipesComponent implements OnInit {
  allRecipes: RecipeInterface[] = [];
  selectedRecipe!: RecipeInterface | null;
  searchText: string = '';
  searchField: RecipeInterface[] = [];
  private searchTextSubject$ = new Subject<string>();
  destroySubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private recipesService: RecipesService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchTextSubject$.pipe(debounceTime(300)).subscribe(() => {
      this.searchTagOrRecipeName();
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.getAllRecipes();
  }

  getAllRecipes(): void {
    this.recipesService
      .getAllRecipes()
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe((data) => {
        this.allRecipes = data;
        this.searchField = this.allRecipes;
        this.cdr.detectChanges();
      });
  }

  displayRecipePreview(recipe: RecipeInterface) {
    this.recipesService
      .fetchRecipeById(recipe._id)
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe((recipe) => {
        this.selectedRecipe = recipe;
        this.cdr.detectChanges();
      });
  }

  deleteRecipe(id: string) {
    this.recipesService
      .delete(id)
      .pipe(takeUntil(this.destroySubscribe$))
      .subscribe(() => {
        this.allRecipes = this.allRecipes.filter((recipe) => recipe._id !== id);
        this.searchTagOrRecipeName();
      });
  }

  searchTagOrRecipeName(): void {
    if (!this.searchText) {
      this.searchField = this.allRecipes;
      return;
    }
    this.searchField = this.allRecipes.filter(
      (el) =>
        el.tags.some((tag) =>
          tag.toLowerCase().includes(this.searchText.toLowerCase())
        ) || el.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  trackById(index: number, item: RecipeInterface): string | RecipeInterface {
    return item._id || item;
  }

  onSearchTextChange(value: string): void {
    this.searchTextSubject$.next(value);
  }

  closeModal() {
    this.selectedRecipe = null;
  }

  ngOnDestroy() {
    this.searchTextSubject$.unsubscribe();
    this.destroySubscribe$.unsubscribe();
  }
}
