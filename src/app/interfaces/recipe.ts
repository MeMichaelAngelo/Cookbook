import { Ingredient } from './ingredient';

export interface RecipeInterface {
  _id?: string;
  name: string;
  ingredients: Ingredient[];
  description: string;
  tags: string[];
}

/* export interface RecipeInterface {
  _id?: string;
  name: string;
  ingredients: Ingredient[];
  description: string;
  tags: TagInterface[];
}

export interface TagInterface {
  _id: string;
  name: string;
} */
