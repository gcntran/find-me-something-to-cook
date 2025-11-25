// src/app.js
import { getRandomRecipes, getRecipesByIngredient } from './api.js';
import { displayRecipes, displayNotebook } from './dom.js';

const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const results = document.getElementById('results');
const notebookContainer = document.getElementById('notebook');

// Notebook storage in localStorage
let notebook = JSON.parse(localStorage.getItem('notebook')) || [];

// Save recipe to notebook
function saveToNotebook(recipe) {
    if (!notebook.find(fav => fav.idMeal === recipe.idMeal)) {
        notebook.push(recipe);
        localStorage.setItem('notebook', JSON.stringify(notebook));
        alert(`${recipe.strMeal} saved to notebook!`);
        displayNotebook(notebook, notebookContainer, deleteFromNotebook);
    } else {
        alert(`${recipe.strMeal} is already in your notebook.`);
    }
}

// Delete recipe from notebook
function deleteFromNotebook(idMeal) {
    const recipeToDelete = notebook.find(fav => fav.idMeal === idMeal);
    notebook = notebook.filter(fav => fav.idMeal !== idMeal);
    localStorage.setItem('notebook', JSON.stringify(notebook));
    if (recipeToDelete) {
        alert(`${recipeToDelete.strMeal} removed from notebook.`);
    }
    displayNotebook(notebook, notebookContainer, deleteFromNotebook);
}

// Show multiple random recipes on page load
window.addEventListener('load', async () => {
    try {
        const randomRecipes = await getRandomRecipes(3);
        console.log('Random Recipes on Load:', randomRecipes);
        displayRecipes(randomRecipes, results, saveToNotebook);
        displayNotebook(notebook, notebookContainer, deleteFromNotebook);
    } catch (error) {
        console.error('Error loading initial recipes:', error);
        results.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
    }
});

// Search recipes by ingredient
function fetchRecipesByIngredient() {
    getRecipesByIngredient(ingredient)
        .then(recipes => {
            if (recipes && recipes.length > 0) {
                cancelIdleCallback(recipes.slice(0, 3));
            } else {
                results.innerHTML = '<p>No recipes found for the given ingredient.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            results.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
        });
}

searchBtn.addEventListener('click', () => {
    const inputEl = document.getElementById('ingredientInput');
    if (!inputEl) {
        alert('Ingredient input not found.');
        return;
    }

    const ingredient = inputEl.value.trim();
    if (!ingredient) {
        alert('Please enter an ingredient to search.');
        return;
    }

    fetchRecipesByIngredient(ingredient, (limitedRecipes) => {
        displayRecipes(limitedRecipes, results, saveToNotebook);
    });
});

// Clear search results
clearBtn.addEventListener('click', () => {
    results.innerHTML = '';
});

// Refresh random recipes
refreshBtn.addEventListener('click', () => {
    getRandomRecipes(3)
        .then(randomRecipes => {
            displayRecipes(randomRecipes, results, saveToNotebook);
        })
        .catch(error => {
            console.error("Error refreshing recipes:", error);
        });
});