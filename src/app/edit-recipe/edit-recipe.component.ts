import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RecipiesService } from "../recipies.service";
import { RecipeInterface } from "../interfaces/recipe";


@Component({
    selector: 'app-edit-recipe',
    templateUrl: './edit-recipe.component.html',
})

export class EditRecipeComponent implements OnInit {

    itemId: string = '';

    constructor(private route: ActivatedRoute,
        private router: Router,
        private recipiesService: RecipiesService) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((param) => {
            //"??" - opcja "powrotu" do wartości domyślnej
            this.itemId = param.get('id') ?? ''
        })
        this.getRecipe()
    }

    recipe: RecipeInterface = {
        name: '',
        ingredients: [],
        description: '',
        tags: []
    }

    getRecipe() {
        this.recipiesService.fetchRecipeById(this.itemId).subscribe((data) => {
            this.recipe.name = data.name;
            this.recipe.description = data.description;
        })
    }

    update() {
        this.recipiesService.update(this.itemId, this.recipe)
        .subscribe(() => {
            this.router.navigate(['/']).then()
        }
        )
    }
}
