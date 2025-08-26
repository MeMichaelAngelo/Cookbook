import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { AppModule } from '../app.module';
import { tuiObjectFromEntries } from '@taiga-ui/cdk';

describe('AddRecipeComponent', () => {
  let component: AddRecipeComponent;
  let fixture: ComponentFixture<AddRecipeComponent>;
  let recipesServiceSpy: jasmine.SpyObj<RecipesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // const recipesSpy = jasmine.createSpyObj('RecipesService', ['createRecipe']);
    // const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        AppModule,
      ],
      declarations: [AddRecipeComponent],
      // providers: [
      //   { provide: RecipesService, useValue: recipesSpy },
      //   { provide: Router, useValue: routerMock },
      // ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipeComponent);
    component = fixture.componentInstance;
    //recipesServiceSpy = TestBed.inject(RecipesService) as jasmine.SpyObj<RecipesService>;
    //routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

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

    //   it('createRecipe - should not call method if form is invalid', () => {
    //     component.recipeForm.get('name')?.setValue('');
    //     component.createRecipe();
    //     expect(recipesServiceSpy.createRecipe).not.toHaveBeenCalled();

    //     component.recipeForm.get('name')?.setValue('Dumplings');
    //     component.recipeForm.get('description')?.setValue('Are very delicious');
    //     expect(recipesServiceSpy.createRecipe).not.toHaveBeenCalled();

    //     component.ingredientsArray.length = 0;
    //     expect(recipesServiceSpy.createRecipe).not.toHaveBeenCalled();
    //   });

    //   it('createRecipe - successed created recipe and navigate to next page', () => {
    //     component.recipeForm.get('name')?.setValue('Cake');
    //     component.recipeForm
    //       .get('description')
    //       ?.setValue('Who want one more piece?');
    //     component.ingredientsArray = [
    //       { name: 'Flour', amount: '600', type: KitchenMeasures.GRAM },
    //     ];
    //     //Check what's wrong with of({})
    //     //recipesServiceSpy.createRecipe.and.returnValue(of({}));

    //     component.createRecipe();

    //     expect(recipesServiceSpy.createRecipe).toHaveBeenCalled();
    //     expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    //   });

    //   it('recipeNameValidation - block typing recipe name if it is longer than 40 characters', () => {
    //     const longName = 'a'.repeat(40);
    //     component.recipeForm.get('name')?.setValue(longName);

    //     const event = new KeyboardEvent('keydown', { key: 'a' });
    //     spyOn(event, 'preventDefault');

    //     component.recipeNameValidation(event);

    //     expect(event.preventDefault).toHaveBeenCalled();
    //   });

    //   it('preventTagRepetiton - show error if tag is already added', () => {
    //     const tags = ['Vegan', 'Quick'];
    //     component.recipeForm.get('tags')?.setValue(tags);

    //     component.preventTagRepetiton('Quick');

    //     expect(component.displayError).toBe('This tag already exists');
    //   });

    //   it('preventTagRepetiton - clear error if tag is new', () => {
    //     component.recipeForm.get('tags')?.setValue(['Easy']);
    //     component.preventTagRepetiton('New');

    //     expect(component.displayError).toBeNull();
    //   });

    //   it('ngOnDestroy - unsubscribe on destroy', () => {
    //     const destroySpy = spyOn(component['destroySubscribe$'], 'unsubscribe');
    //     component.ngOnDestroy();
    //     expect(destroySpy).toHaveBeenCalled();
    //   });
  });
});
