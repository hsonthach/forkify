import Search from "./models/Search";
import { element, renderLoader, clearLoader, elementStrings } from "./base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likeView from "./views/likeView";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Like from "./models/Like";

/** Global state of the app
 * Search Object
 * Current recipe object
 * Shopping list object
 * Liked recipes
 */

const state = {
  page: 1
};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2. Save query into search object in state
    state.search = new Search(query);

    // Render loader
    renderLoader(element.searchResult);

    // 3. get recipe result
    try {
      await state.search.getResults();

      // 4. Render recipes on UI
      // Prepare for UI (clear input,etc..)

      clearLoader(elementStrings.loader);
      searchView.clearInputField();
      searchView.clearRecipes();

      /// Render recipe
      searchView.renderRecipes(state.search.result, state.page);

      /// Render button
      searchView.renderButton(state.page, state.search.result);
    } catch (error) {
      console.log(error);
      // Prepare for UI (clear input,etc..)

      clearLoader(elementStrings.loader);
      searchView.clearInputField();
      searchView.clearRecipes();
    }
  }
};

/** 
    RECIPE CONTROLLER 
*/
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");

  // CREATE NEW RECIPE OBJECT
  state.recipe = new Recipe(id);

  try {
    // PREPARE FOR UI RENDER

    recipeView.clearRecipe();

    renderLoader(element.recipe);

    // HIGHLIGHT SELECTED AND CLEAR OLD SELECTED
    searchView.highlightSelected(id);

    // GET RECIPE RESULT
    await state.recipe.getRecipe();

    clearLoader(elementStrings.loader);

    // GET TIME AND SERVINGS
    if (state.recipe.ingredients) {
      state.recipe.calcTime();
      state.recipe.calcServings();

      // PARSE INGREDIENTS
      state.recipe.parseIngredients();

      // RENDER RECIPE ON UI
      /// Find love button source

      const loveButtonImg =
        state.like && state.like.isLiked(state.recipe.id)
          ? "img/icons.svg#icon-heart"
          : "img/icons.svg#icon-heart-outlined";

      /// Render recipe and love button on UI
      recipeView.renderRecipe(state.recipe, loveButtonImg);
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 *  SHOPPING LIST CONTROLLER
 */

const controlShoppingList = () => {
  // Set ingredients to current shopping list
  //* NOT First time add
  if (state.shoppingList) {
    state.shoppingList.setShoppingList(state.recipe.ingredients);
    state.shoppingList.sortShoppingList();
  } else {
    //* First time add
    state.shoppingList = new List();
    state.shoppingList.setShoppingList(state.recipe.ingredients);
  }

  // Prepare to render it on UI
  listView.clearList();

  // Render it on UI
  listView.renderShoppingList(state.shoppingList.shoppingList);
};

/** 
    LIKE CONTROLLER 
*/
const controlLike = () => {
  if (!state.like) state.like = new Like();

  // LIKE CONTROLLER
  if (!state.like.isLiked(state.recipe.id)) {
    // Add item into like data
    state.like.saveItem(
      state.recipe.id,
      state.recipe.image,
      state.recipe.title,
      state.recipe.author
    );

    // Smash like button on UI
    likeView.changeLikeButton(state.like.isLiked(state.recipe.id));

    // Save it on love button on UI
    likeView.saveLiked(
      state.recipe.id,
      state.recipe.image,
      state.recipe.title,
      state.recipe.author
    );
  }
  // UNLIKE CONTROLLER
  else {
    // Remove item into like data
    state.like.removeItem(state.recipe.id);

    // UNSmash like button on UI
    likeView.changeLikeButton(state.like.isLiked(state.recipe.id));

    // Remove it on love button on UI
    likeView.deleteLike(state.recipe.id);
  }

  likeView.toggleMenu(state.like && state.like.likeItems.length > 0);
};

/** 
    LOAD STORAGE CONTROLLER
*/
const loadStorage = () => {
  state.like = new Like();
  // Get like storage
  const storageLikes = state.like.getStorage();

  // Hide like fields
  likeView.toggleMenu(false);

  if (storageLikes) {
    storageLikes.forEach(el => {
      // Add into state.like
      state.like.saveItem(el.id, el.img, el.title, el.author);

      // Display like fields
      likeView.toggleMenu(true);

      // Display like list
      likeView.saveLiked(el.id, el.img, el.title, el.author);
    });
  }
};

/** 
    EVENT CONTROLLER 
*/

const eventController = () => {
  // RENDER RESULT WHEN CLICKING SEARCH BUTTON
  element.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
  });

  // CLICK NEXT/PREV BUTTON EVENT
  element.searchButton.addEventListener("click", e => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
      const goToPage = parseInt(btn.dataset.goto);

      searchView.clearRecipes();
      /// Render recipe
      searchView.renderRecipes(state.search.result, goToPage);

      /// Render button
      searchView.renderButton(goToPage, state.search.result);
    }
  });

  // CLICK INCREASE OR DECREASE BUTTON
  element.recipe.addEventListener("click", e => {
    // decreases
    if (state.recipe) {
      if (e.target.matches(".btn-decreases, .btn-decreases *")) {
        if (state.recipe.servings > 1) {
          // update data
          state.recipe.updateServings("dec");

          // update UI
          recipeView.updateRecipe(state.recipe);
        }
      } else if (e.target.matches(".btn-increases, .btn-increases *")) {
        // update data
        state.recipe.updateServings("inc");

        // update UI
        recipeView.updateRecipe(state.recipe);
      }

      // CLICK ADD TO SHOPPING LIST BUTTON
      else if (e.target.matches(".btn-list, .btn-list *")) {
        controlShoppingList();
      } else if (e.target.matches(".recipe__love, .recipe__love *")) {
        // REMOVE LIKED RECIPE
        controlLike();
      }
    }
  });

  // CLICK TO REMOVE SHOPPING LIST BUTTON
  element.shoppingList.addEventListener("click", e => {
    if (e.target.matches(".shopping__delete, .shopping__delete *")) {
      const listElement = e.target.closest(".shopping__delete").parentNode;

      const id = listElement.id;

      // Remove element in list data
      state.shoppingList.removeListElement(id);

      // Remove element on UI
      listView.removeItem(listElement);
    }
    // CLICK ON INC OR DEC COUNT
    else if (e.target.matches(".shopping__count-value")) {
      const value = e.target.value;
      const id = e.target.parentNode.parentNode.id;
      state.shoppingList.updateCount(value, id);
    }
  });
};

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

window.addEventListener("load", loadStorage());

eventController();
