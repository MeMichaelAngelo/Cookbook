import {
  TuiRootModule,
  TuiButtonModule,
  TuiTooltipModule,
  TuiHintModule,
} from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllRecipesComponent } from './all-recipes/all-recipes.component';
import { HttpClientModule } from '@angular/common/http';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { FormsModule } from '@angular/forms';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiFilterByInputPipeModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiDataListModule } from '@taiga-ui/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  TuiDataListWrapperModule,
  TuiSelectModule,
  TuiTextareaModule,
  TuiIslandModule,
  TuiInputNumberModule,
} from '@taiga-ui/kit';

import { newLineAsEnterPipe } from './directives/newLineAsEnter.pipe';
import { LettersOnly } from './directives/lettersOnly.directive';

@NgModule({
  declarations: [
    AppComponent,
    AllRecipesComponent,
    AddRecipeComponent,
    EditRecipeComponent,
    newLineAsEnterPipe,
    LettersOnly,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiButtonModule,
    TuiTooltipModule,
    TuiHintModule,
    TuiDataListModule,
    TuiSelectModule,
    ScrollingModule,
    TuiFilterByInputPipeModule,
    TuiDataListWrapperModule,
    TuiTextareaModule,
    TuiIslandModule,
    TuiInputNumberModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
