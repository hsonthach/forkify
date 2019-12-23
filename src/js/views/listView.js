import { element } from "../base";

export const renderShoppingList = (shoppingList) => {
    /* [
            {
                count: {
                    numerator
                    denominator
                }
                unit:
                ingredient:
            }
        ] 
        */

    shoppingList.forEach((el) => {
        renderShoppingItem(el);

    });


}

const renderShoppingItem = (shoppingItem) => {
    let floatCount;
    try {
        floatCount = (eval(shoppingItem.count.toString().replace(' ', '+'))) ? (eval(shoppingItem.count.toString().replace(' ', '+'))) : 1;

    }
    catch (error) {
        floatCount = 1;
    }


    const markup =
        `   <li class="shopping__item" id=${shoppingItem.id}>
            <div class="shopping__count">
                <input type="number" value="${floatCount}" step="${floatCount / 5}" class="shopping__count-value">
                    <p>${shoppingItem.unit}</p>
            </div>
            <p class="shopping__description">${shoppingItem.ingredient}</p>
            <button class="btn-tiny shopping__delete">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;


    element.shoppingList.insertAdjacentHTML('beforeend', markup);
}

export const clearList = () => {
    element.shoppingList.innerHTML = '';
}

export const removeItem = (element) => {
    element.parentNode.removeChild(element);
}