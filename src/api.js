// src/api.js

// Fetch data from TheMealDB API
// Fetch a random recipe
export async function getRandomRecipe() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        return data.recipes[0];
    }
    catch (error) {
        console.error("Error fetching random recipe:", error);
        return null;
    }
}

// Fetch multiple random recipes for random suggestions when page loads
export async function getRandomRecipes(count = 5) {
    const promise = Array.from({ length: count }, () => getRandomRecipe());
    const results = await Promise.all(promise);
    return results.filter(recipe => recipe !== null);
    }

    // Fetch recipe by ingredient in search bar
    export async function getRecipesByIngredient(ingredient) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=$ingredient`);
            const data = await response.json();
            return data.recipes;
        }
        catch (error) {
            console.error("Error fetching recipes by ingredient:", error);
            return null;
        }
    }