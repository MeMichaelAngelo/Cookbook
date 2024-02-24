import { Ingredient } from './ingredient';

export interface RecipeInterface {
  _id?: string;
  name: string;
  ingredients: Ingredient[];
  description: string;
  tags: string[];
}
