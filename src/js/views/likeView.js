import { element, newTitle } from "../base";


export const saveLiked = (id, image, title, author) => {
    const markup = `
    
            <li>
                <a class="likes__link" href="#${id}">
                    <figure class="likes__fig">
                        <img src="${image}" alt="Test">
                    </figure>
                    <div class="likes__data">
                        <h4 class="likes__name">${newTitle(title,30)}</h4>
                        <p class="likes__author">${author}</p>
                    </div>
                </a>
            </li>
            
            ` ;

    document.querySelector('.likes__list').insertAdjacentHTML('beforeend', markup);

}

export const changeLikeButton = (isLiked) =>{
    const sourceImg = (isLiked)?('img/icons.svg#icon-heart'):('img/icons.svg#icon-heart-outlined')
    //document.querySelector('.test__1').setAttribute('href',"img/icons.svg#icon-heart") ;  
    
    document.querySelector('.recipe__love use').setAttribute('href',sourceImg)  ; 

}

export const deleteLike = (_id) =>{
    /* const likeArr = Array.from(document.querySelectorAll('.likes__link')) ; 
    const index = likeArr.findIndex(el=>{
       

        return el.getAttribute('href') === '#'+_id ; 
    })
    
    if ((index) !== -1) { 
        
        const removeElement = likeArr[index] ; 
        removeElement.parentNode.removeChild(removeElement) ; 
    }
     */
    const deleteElement = document.querySelector(`.likes__link[href="#${_id}"`).parentNode ; 
    deleteElement.parentNode.removeChild(deleteElement) ; 
}

export const toggleMenu = (isThereLike) => {
    element.like.style.visibility = isThereLike ? 'visible' : 'hidden'  ;

}