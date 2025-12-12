import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipesService } from '../recipes.service';
import { AllRecipesComponent } from './all-recipes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../app.module';
import { RecipePreviewComponent } from '../recipe-preview/recipe-preview.component';
import { RecipeInterface } from '../interfaces/recipe';
import { KitchenMeasures } from '../enums/kitchen-measures.enum';
import { of } from 'rxjs';

describe('AllRecipesComponent', () => {
  let component: AllRecipesComponent;
  let fixture: ComponentFixture<AllRecipesComponent>;
  //let serviceSpy: jasmine.SpyObj<RecipesService>;
  let allRecipes: RecipeInterface[];

  beforeEach(async () => {
    const servSpy = jasmine.createSpyObj('RecipesService', [
      'getAllRecipes',
      'getRecipesForPagination',
      'createRecipe',
      'fetchRecipeById',
      'update',
      'delete',
    ]);

    //Ogarnianie serwisu
    //1. deklaracja zmiennej z nazwą serwisu + jego metodami
    //2. dodanie go do providers
    //3. obsługa metod serwisowych

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        AppModule,
      ],
      declarations: [AllRecipesComponent, RecipePreviewComponent],
      providers: [{ provide: RecipesService, useValue: servSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AllRecipesComponent);
    component = fixture.componentInstance;
    allRecipes = [
      {
        _id: '1',
        name: 'Rosół',
        description: 'Niedzielna zupa',
        tags: ['seler', 'por', 'marchew'],
        ingredients: [
          {
            name: 'Por',
            amount: '200',
            type: KitchenMeasures.GRAM,
          },
          { name: 'Marchew', amount: '200', type: KitchenMeasures.GRAM },
        ],
      },
      {
        _id: '2',
        name: 'Grochówka',
        description: 'Zupa z grochem',
        tags: ['groch', 'kiełbasa', 'woda'],
        ingredients: [
          {
            name: 'Groch',
            amount: '50',
            type: KitchenMeasures.DECAGRAM,
          },
          {
            name: 'Kiełbasa',
            amount: '1',
            type: KitchenMeasures.KILOGRAM,
          },
          {
            name: 'Woda',
            amount: '4',
            type: KitchenMeasures.LITER,
          },
        ],
      },
    ];

    servSpy.getAllRecipes.and.returnValue(of(allRecipes));
    servSpy.getRecipesForPagination.and.returnValue(of(allRecipes));
    servSpy.fetchRecipeById.and.returnValue(of(allRecipes[0]));
    servSpy.delete.and.returnValue(of({}));

    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('Component method tests', () => {
    it('getAllRecipes', () => {
      component.getAllRecipes();
      fixture.detectChanges();

      expect(component.allRecipes.length).toBe(2);
      expect(component.searchField).toEqual(allRecipes);
    });

    it('fetchAllRecipesForPagination', () => {
      component.fetchAllRecipesForPagination();
      fixture.detectChanges();

      expect(component.recipesForPagination.length).toBe(2);
      expect(component.recipesForPagination[0].name).toBe('Rosół');
    });

    it('paginationStepControl should update currentPage and call fetchAllRecipesForPagination', () => {
      const spyFetch = spyOn(component, 'fetchAllRecipesForPagination');
      component.paginationStepControl({ page: 2 } as any);
      expect(component.currentPage).toBe(3);
      expect(spyFetch).toHaveBeenCalled();
    });

    it('displayRecipePreview should set selectedRecipe', () => {
      component.displayRecipePreview({ ...allRecipes[0], _id: '1' });
      fixture.detectChanges();

      expect(component.selectedRecipe?.name).toBe('Rosół');
    });

    it('deleteRecipe should remove recipe from allRecipes', () => {
      component.allRecipes = [...allRecipes];
      component.recipesForPagination = [...allRecipes];

      component.deleteRecipe('1');
      fixture.detectChanges();

      // Remove Rosół from the list
      expect(
        component.allRecipes.find((res) => res._id === '1')
      ).toBeUndefined();
      // Check if Grochówka left on the list
      expect(component.allRecipes.find((res) => res._id === '2')).toBeDefined();
    });

    it('trackById - should return _id if exists', () => {
      const recipe = allRecipes[0];
      expect(component.trackById(0, recipe)).toBe('1');
    });

    it('onSearchTextChange - should push value to searchTextSubject$', () => {
      const spy = spyOn(component.searchTextSubject$, 'next');
      component.onSearchTextChange(allRecipes[0].name);
      expect(spy).toHaveBeenCalledWith('Rosół');
    });

    it('closeModal - should set selectedRecipe to null', () => {
      component.selectedRecipe = allRecipes[1];
      component.closeModal();
      expect(component.selectedRecipe).toBeNull();
    });

    it('searchTagOrRecipeName', () => {
      //Check if input is empty
      component.searchText = '';
      component.searchTagOrRecipeName();
      expect(!component.searchText).toBeTrue();

      //Check if input is presents results
      component.allRecipes = allRecipes;
      component.searchText = 'Woda';
      component.searchTagOrRecipeName();
      expect(component.recipesForPagination[0].name).toBe('Grochówka');
      // //Check if there is no results
      component.allRecipes = allRecipes;
      component.searchText = 'xyz';
      component.searchTagOrRecipeName();
      expect(component.recipesForPagination.length).toBe(0);
    });

    it('ngOnDestroy - call method and remove observables', () => {
      const ngOnDestroy = spyOn(component, 'ngOnDestroy').and.callThrough();
      const searchTextSubject = spyOn(
        component.searchTextSubject$,
        'unsubscribe'
      ).and.callThrough();
      const destroySubscribe = spyOn(
        component.destroySubscribe$,
        'unsubscribe'
      ).and.callThrough();

      component.ngOnDestroy();
      fixture.detectChanges();

      expect(ngOnDestroy).toHaveBeenCalled();
      expect(searchTextSubject).toHaveBeenCalled();
      expect(destroySubscribe).toHaveBeenCalled();
    });
  });
});
