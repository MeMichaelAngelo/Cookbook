import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddRecipeComponent } from './add-recipe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { KitchenMeasures } from '../enums/kitchen-measures.enum';

describe('AppComponent', () => {
  let component: AddRecipeComponent;
  let fixture: ComponentFixture<AddRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [AddRecipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
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
      component.recipeForm.controls['name'].setValue('Rosół');
      component.recipeForm.controls['description'].setValue(
        'Dobry na niedzielę'
      );
      component.recipeForm.controls['tags'].setValue('obiad');
      component.ingredientForm.controls['name'].setValue('seler');
      component.ingredientForm.controls['amount'].setValue(400);
      component.ingredientForm.controls['type'].setValue('g');

      expect(component.recipeForm.valid).toBeTrue();
      expect(component.ingredientForm.valid).toBeTrue();
    });

    it('Form validate values of his controls', () => {
      let recipeForm = component.recipeForm;
      let ingredientForm = component.ingredientForm;

      recipeForm.controls['name'].setValue('');
      recipeForm.controls['description'].setValue('');
      ingredientForm.controls['name'].setValue('');
      ingredientForm.controls['amount'].setValue(0.0001);
      ingredientForm.controls['type'].setValue('');

      expect(recipeForm.controls['name'].value).toBeFalse();
      expect(recipeForm.controls['description'].value).toBeFalse();
      expect(ingredientForm.controls['name'].value).toBeFalse();
      expect(ingredientForm.controls['amount'].value).toBeFalse();
      expect(ingredientForm.controls['type'].value).toBeFalse();
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
        amount: 600,
        type: KitchenMeasures.GRAM,
      });
      component.addAndResetIngredient();
      fixture.detectChanges();

      expect(component.ingredientsArray.length).toBe(1);
      expect(component.ingredientsArray[0].name).toBe('Bread');
      expect(component.ingredientForm.value.name).toBeNull();
    });

    it('disableTagButtonIfEmpty - should disable tag button when tag is empty or error exists', () => {
      component.tag = '   ';
      expect(component.disableTagButtonIfEmpty()).toBeTrue();

      component.tag = 'Test';
      component.displayError = 'Error';
      expect(component.disableTagButtonIfEmpty()).toBeTrue();
    });
  });
});
