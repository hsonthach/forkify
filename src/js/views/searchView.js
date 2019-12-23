import { element, newTitle } from '../base';

export const getInput = () => {
    const input = element.searchInput.value;
    return input;
}

export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
    const start = (page-1)*resPerPage ; 
    const end = (page)*resPerPage ; 

    // Render recipe per page 
    recipes.slice(start,end).forEach(renderRecipe);
}

export const clearInputField = () => {
    element.searchInput.value = '';
}

export const clearRecipes = () => {
    element.searchResultList.innerHTML = '';
    element.searchButton.innerHTML = '';
}

export const renderButton = (page,recipe,resPerPage =10) =>{
    const numPage = Math.floor((recipe.length/resPerPage)) ; 
    let markup  ;
    if (page === 1 && numPage >1 ) {
        // RENDER NEXT BUTTON
        markup = creatButtons('next',page);

    } else if (page === numPage && numPage > 1) {
        // RENDER BACK BUTTON
        markup = creatButtons('prev',page);
    } else if (numPage > 1) {
        // RENDER BACK AND NEXT BUTTON
        markup = creatButtons('next',page);
        markup += creatButtons('prev',page);
    }
        // RENDER NOTHING
    element.searchButton.insertAdjacentHTML('beforeend',markup) ; 
}

const creatButtons = (type,page) =>`
    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev' ? page-1 : page+1 }>
    <span>Page ${type === 'prev' ? page-1:page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type ==='prev'? 'left' : 'right'}"></use>
        </svg>
    </button>
    `; 

const renderRecipe = (recipe) => {
    const title = newTitle(recipe.title);
    const markup = `<li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${title}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>` ;
    element.searchResultList.insertAdjacentHTML('beforeend', markup);

}


// ' Pasta with potato and tomato '



export const highlightSelected =(id)=>{
    // CLEAR OLD SELECTED 
    (Array.from(document.querySelectorAll('.results__link'))).forEach(el=>{
        el.classList.remove('results__link--active') ; 
    })

    // HIGHLIGHT SELECTED 
    if (document.querySelector(`.results__link[href="#${id}"]`)){
       document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active') ; 
    }
}
