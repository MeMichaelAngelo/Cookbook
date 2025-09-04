import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddRecipeComponent } from './add-recipe.component';
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { KitchenMeasures } from '../enums/kitchen-measures.enum';
import { RecipesService } from '../recipes.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecipeInterface } from '../interfaces/recipe';
import { AppModule } from '../app.module';
import { AllRecipesComponent } from '../all-recipes/all-recipes.component';
import { routes } from '../app-routing.module';
import { Location } from '@angular/common';

describe('AddRecipeComponent', () => {
  let component: AddRecipeComponent;
  let fixture: ComponentFixture<AddRecipeComponent>;
  let serviceSpy: jasmine.SpyObj<RecipesService>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const servSpy = jasmine.createSpyObj('RecipesService', ['createRecipe']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        AppModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [AddRecipeComponent, AllRecipesComponent],
      providers: [{ provide: RecipesService, useValue: servSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();

    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('Form', () => {
    it('Form should has empty, ready to use fields', () => {
      expect(component.recipeForm.contains('name')).toBeTrue();
      expect(component.recipeForm.contains('description')).toBeTrue();
      expect(component.recipeForm.contains('tags')).toBeTrue();
      expect(component.ingredientForm.contains('name')).toBeTrue();
      expect(component.ingredientForm.contains('amount')).toBeTrue();
      expect(component.ingredientForm.contains('type')).toBeTrue();
    });

    it('Form should send valid, entered values', () => {
      component.recipeForm.get('name')?.setValue('Rosół');
      component.recipeForm.get('description')?.setValue('Dobry na niedzielę');
      const tagsArray = component.recipeForm.get('tags') as FormArray;
      tagsArray.push(new FormControl('test'));
      tagsArray.push(new FormControl('values'));
      component.ingredientForm.setValue({
        name: 'seler',
        amount: 400,
        type: 'g',
      });

      expect(component.recipeForm.valid).toBeTrue();
      expect((component.recipeForm.get('tags') as FormArray).length).toBe(2);
      expect(component.ingredientForm.valid).toBeTrue();
    });

    it('Form validate values of his controls', () => {
      let recipeForm = component.recipeForm;
      let ingredientForm = component.ingredientForm;

      recipeForm.controls['name'].setValue('');
      recipeForm.controls['description'].setValue('');
      ingredientForm.controls['name'].setValue('');
      ingredientForm.controls['amount'].setValue(null);
      ingredientForm.controls['type'].setValue('');

      recipeForm.markAsTouched();
      recipeForm.updateValueAndValidity();
      ingredientForm.markAsTouched();
      ingredientForm.updateValueAndValidity();

      expect(recipeForm.status).toBe('INVALID');
      expect(component.recipeForm.get('name')?.hasError('required')).toBeTrue();
      expect(
        component.recipeForm.get('description')?.hasError('required')
      ).toBeTrue();

      expect(ingredientForm.status).toBe('INVALID');
      expect(ingredientForm.get('name')?.hasError('required')).toBeTrue();
      expect(ingredientForm.get('amount')?.hasError('required')).toBeTrue();
    });
  });

  describe('Testing methods', () => {
    it('addIngredientValidator - should return true if ingredients form is invalid', () => {
      component.ingredientForm.setValue({
        name: null,
        amount: null,
        type: KitchenMeasures.DECAGRAM,
      });
      expect(component.addIngredientValidator()).toBeTrue();
    });

    it('addAndResetIngredient - should add ingredient and reset fields', () => {
      component.ingredientForm.setValue({
        name: 'Bread',
        amount: '600',
        type: KitchenMeasures.GRAM,
      });
      component.addAndResetIngredient();
      fixture.detectChanges();

      expect(component.ingredientsArray.length).toBe(1);
      expect(component.ingredientsArray[0].name).toBe('Bread');
      expect(component.ingredientsArray[0].amount).toBe('600');
      expect(component.ingredientForm.value.name).toBeNull();
    });

    it('disableTagButtonIfEmpty - should disable tag button when tag is empty or error exists', () => {
      component.tag = '   ';
      expect(component.disableTagButtonIfEmpty()).toBeTrue();

      component.tag = 'Test';
      component.displayError = 'Error';
      expect(component.disableTagButtonIfEmpty()).toBeTrue();
    });

    it('addTag - method push tag to tag array and reset tag control', () => {
      component.tag = 'New tag';
      component.recipeForm.get('tags')?.setValue([]);

      component.addTag();

      const tagsArray = component.recipeForm.get('tags')?.value;
      expect(tagsArray).toContain('New tag');
      expect(component.tag).toBe('');
    });

    it('preventTagRepetiton - clear error if tag is new', () => {
      const tags = component.recipeForm.get('tags') as FormArray;
      tags.push(new FormControl('Easy'));
      component.preventTagRepetiton('New');

      expect(component.displayError).toBeNull();
    });

    it('recipeNameValidation - block typing recipe name if it is longer than 40 characters', () => {
      const longName = 'a'.repeat(40);
      component.recipeForm.get('name')?.setValue(longName);

      const event = new KeyboardEvent('keydown', { key: 'a' });
      spyOn(event, 'preventDefault');
      component.recipeNameValidation(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('preventTagRepetiton - show error if tag is already added', () => {
      const tags = component.recipeForm.get('tags') as FormArray;
      tags.push(new FormControl('Vegan'));
      tags.push(new FormControl('Quick'));
      component.preventTagRepetiton('Quick');

      expect(component.displayError).toBe('Taki tag już istnieje');
    });

    it('ngOnDestroy - unsubscribe on destroy', () => {
      const destroySpy = spyOn(component['destroySubscribe$'], 'unsubscribe');
      component.ngOnDestroy();
      fixture.detectChanges();
      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('Service tests', () => {
    it('createRecipe - should not call method if form is invalid', () => {
      serviceSpy = TestBed.inject(
        RecipesService
      ) as jasmine.SpyObj<RecipesService>; // teraz to działa (dodanie "as jasmine.SpyObj<RecipesService>;")

      component.recipeForm.get('name')?.setValue('');
      fixture.detectChanges();
      component.createRecipe();
      expect(component.recipeForm?.status).toBe('INVALID');
      expect(serviceSpy.createRecipe).not.toHaveBeenCalled();

      component.recipeForm.get('name')?.setValue('Dumplings');
      component.recipeForm.get('description')?.setValue('Are very delicious');
      expect(serviceSpy.createRecipe).not.toHaveBeenCalled();

      component.ingredientsArray.length = 0;
      expect(serviceSpy.createRecipe).not.toHaveBeenCalled();
    });

    it('createRecipe - successed created recipe and navigate to next page', fakeAsync(() => {
      //fakeAsync - używane do obsługi route, który jest asynchroniczny!
      //Część serwisu
      //symulowanie danych na podstawie przyjmowanego typu w metodzie (interfejsu RecipeInterface)
      const mockData: RecipeInterface = {
        name: 'Soup',
        ingredients: [
          {
            name: 'water',
            amount: '3',
            type: KitchenMeasures.LITER,
          },
        ],
        description: 'Best soup',
        tags: [],
      };
      serviceSpy = TestBed.inject(
        RecipesService
      ) as jasmine.SpyObj<RecipesService>;
      //zasymulowanie użycia metody po stronie serwisu wraz z danymi
      serviceSpy.createRecipe.and.returnValue(of(mockData));
      //Część komponentu
      //zasymulowanie formularza z wprowadzonymi danymi
      component.recipeForm.setValue({
        name: 'Soup',
        description: 'Best soup',
        tags: [],
      });

      component.ingredientsArray = mockData.ingredients;
      //Przygotowanie routera pod testy
      router.navigate(['']);
      tick(); //wykonuje akcje asynchroniczne natychmiast - takie metody nie muszą czekać do końca na ich wykonanie
      //Symulacja kliknięcia createRecipe() z "wprowadzonymi" wcześniej danymi
      component.createRecipe();

      expect(serviceSpy.createRecipe).toHaveBeenCalled();
      expect(location.path()).toBe('/'); //path() sprowadza ścieżkę '' do ścieżki '/'
    }));
  });
});
