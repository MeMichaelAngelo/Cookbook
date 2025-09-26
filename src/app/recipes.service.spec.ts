import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RecipesService } from './recipes.service';
import { RecipeInterface } from './interfaces/recipe';
import { KitchenMeasures } from './enums/kitchen-measures.enum';

describe('RecipesService', () => {
  let httpTestingController: HttpTestingController;
  let service: RecipesService;

  const id = '68d5b610749bd7aa0dbeab4b';
  const exampleData: RecipeInterface = {
    name: 'TestDinner',
    description: 'Test Description',
    tags: ['1', '2', '3'],
    ingredients: [
      {
        name: 'Ingredient 1',
        amount: '1',
        type: KitchenMeasures.CUP,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipesService],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RecipesService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Service - GET method', () => {
    it('getAllRecipes - check if method shows list of all recipies', () => {
      service.getAllRecipes().subscribe((data) => {
        expect(data[0]).toEqual(exampleData);
      });

      const req = httpTestingController.expectOne(
        'http://localhost:3000/recipe'
      );

      expect(req.request.method).toBe('GET');
    });

    it('getRecipesForPagination - check if method uses GET', () => {
      service
        .getRecipesForPagination(1, 10, 'TestDinner')
        .subscribe((data: RecipeInterface) => {
          expect(data).toEqual(exampleData);
        });

      const request = httpTestingController.expectOne(
        (r) => r.method === 'GET'
      );

      request.flush(exampleData);
    });

    it('fetchRecipeById - fetch recipe', () => {
      service
        .fetchRecipeById('68d5b610749bd7aa0dbeab4b')
        .subscribe((data: RecipeInterface) => {
          expect(data).toEqual(exampleData);
        });

      const req = httpTestingController.expectOne(
        `http://localhost:3000/recipe/${id}`
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(`http://localhost:3000/recipe/${id}`);
    });
  });

  describe('Service - POST method', () => {
    it('createRecipe - check if function pushes object and uses POST method', () => {
      const createdRecipe: RecipeInterface = { ...exampleData };

      service.createRecipe(exampleData).subscribe((data: RecipeInterface) => {
        expect(data).toEqual(createdRecipe);
      });

      const req = httpTestingController.expectOne(
        'http://localhost:3000/recipe'
      );

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createdRecipe);

      req.flush(createdRecipe);
    });
  });

  describe('Service - PUT method', () => {
    const updateRecipe: RecipeInterface = {
      name: 'Updated Dinner',
      description: 'Is yummi',
      tags: ['tasty', 'dinner', 'light'],
      ingredients: [
        {
          name: 'Updated ingredient 1',
          amount: '300',
          type: KitchenMeasures.GRAM,
        },
      ],
    };

    it('update - update recipe', () => {
      service.update(id, updateRecipe).subscribe((data: any) => {
        expect(data).toEqual(updateRecipe);
      });

      const req = httpTestingController.expectOne(
        `http://localhost:3000/recipe/${id}`
      );

      expect(req.request.body.name).toEqual('Updated Dinner');
      expect(req.request.body.tags[2]).toEqual('light');

      req.flush(updateRecipe);
    });
  });

  describe('Service - DELETE method', () => {
    it('delete - remove recipe from collection', () => {
      service.delete(id).subscribe((data) => {
        expect(data).toEqual(id);
      });

      const req = httpTestingController.expectOne(
        `http://localhost:3000/recipe/${id}`
      );

      expect(req.request.method).toBe('DELETE');

      req.flush(id);
    });
  });
});
