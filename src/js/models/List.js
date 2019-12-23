import { Fraction } from 'fractional';
import uniqid from 'uniqid';
// 
export default class List {
    constructor(shoppingList) {
        this.shoppingList = [];
    }


    setShoppingList(ingredients) {
        /* [
            {
                count: {
                    numerator
                    denominator
                }
                unit:
                ingredient:
                id:
            }
        ] 
        */

        // Push into array 
        ingredients.forEach((ingr) => {
            const item = {
                count: ingr.count,
                unit: ingr.unit,
                ingredient: ingr.ingredient,
                id: uniqid()
            }
            this.shoppingList.push(item);

        })

    }

    sortShoppingList() {
        // re define ingredient again 
        /// ASSIGN ID VALUE 

        this.shoppingList = this.shoppingList.map((el) => {

            return {
                count: new Fraction(el.count.numerator, el.count.denominator),
                unit: el.unit,
                ingredient: el.ingredient,
                id: el.id
            }
        })



        let newShoppingList = [];
        this.shoppingList.forEach((ingr, i) => {
            this.shoppingList.forEach((list, j) => {
                //  The same ingredient 
                if (list.unit === ingr.unit && list.ingredient === ingr.ingredient && j > i) {

                    this.shoppingList[i].count = this.shoppingList[i].count.add(ingr.count);
                    this.shoppingList.splice(j, 1);
                }
                // Diffrent ingredient 

            })
            newShoppingList.push(this.shoppingList[i]);
        })


    }

    removeListElement(_id) {
        this.shoppingList.forEach((el, i) => {
            if (el.id === _id) {
                this.shoppingList.splice(i, 1);
            }
        })
    } 
    
    updateCount(value,_id){
        this.shoppingList.forEach(el=>{
            if (el.id === _id) {
                el.count = el.count.add(new Fraction(value)) ; 
            }
        })
    }

}

