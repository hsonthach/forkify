
import axios from 'axios' ; 
import {key} from '../base' ; 
import {Fraction} from 'fractional';

export default class Recipe { 
    constructor(id){
        this.id = id ; 
    }
    async getRecipe(){
        try{
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`); 
            const recipe = res.data.recipe;
            this.image = recipe.image_url;
            this.ingredients = recipe.ingredients;
            this.author = recipe.publisher;
            this.url = recipe.image_url;
            this.title = recipe.title;

        }catch (error){
            console.log(error) ; 
        }
    }

    calcTime(){
        
            this.time = Math.ceil(this.ingredients.length/3)*15 ; 

        
    }

    calcServings(){
        this.servings = 4 ; 
    }

    updateServings (type){
        let value,newIngredients ; 
        if (type ==='dec'){
            this.servings-- ; 
            value = new Fraction(this.servings, this.servings+1);
            newIngredients  = this.ingredients ; 
            this.ingredients.forEach((el,i)=>{
                newIngredients[i].count = new Fraction(newIngredients[i].count.numerator*value.numerator,newIngredients[i].count.denominator*value.denominator)
                //newIngredients[i].count = el.count.multiply(value) ; // review 
           })
        }else if (type ==='inc'){
            this.servings++ ; 
            value = new Fraction(this.servings, this.servings-1);
            newIngredients  = this.ingredients ; 
            this.ingredients.forEach((el,i)=>{
                newIngredients[i].count = new Fraction(newIngredients[i].count.numerator*value.numerator,newIngredients[i].count.denominator*value.denominator)
           })
        }
        this.ingredients  = newIngredients ; 
    }

    parseIngredients() { 
        // UNIFORM UNIT 
        const longUnit = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const shortUnit = ['tnsp', 'tnsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el=>{
            let ingredient = el.toLowerCase() ; 
            ingredient = ingredient.replace('-','');
            longUnit.forEach((unit,i)=>{
                ingredient = ingredient.replace(unit,shortUnit[i]) ; 
            })
            
            // REMOVE PARENTHESES
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            
            // PARSE INTO VALUE,UNIT,INGREDIENTS
            let ingredientArr = ingredient.split(' ') ; 
            let unitIndex = ingredientArr.findIndex((cur)=>shortUnit.includes(cur)) ; 
            let finalIngre =[]; 
            if ((parseInt(ingredientArr[0]) || ingredient.includes('/'))  ){
                /// num and unit 
                 // num but no unit 
                 // ex: 2 slices bread
                finalIngre.push(ingredientArr[0]) ; 
                if (ingredientArr[1].includes('/')){
                    finalIngre[0] +=  ' ' + (ingredientArr[1]) ; 
                    
                    finalIngre.push(ingredientArr[2]) ; 
                    finalIngre.push(ingredientArr.slice(3,ingredientArr.length).join(' ')) ; 
                }else {
                    

                    finalIngre.push(ingredientArr[1]) ; 
                    finalIngre.push(ingredientArr.slice(2,ingredientArr.length).join(' ')) ; 
                }
            }else if (unitIndex !== -1 && !(parseInt(ingredientArr[0]) || ingredient.includes('/')) ){
                /// no num but unit 
                ingredientArr.unshift(1) ;
                if (ingredientArr[1].includes('/')){
                    finalIngre[0] += ' ' + (ingredientArr[1]) ;
                    
                    finalIngre.push(ingredientArr[2]) ; 
                    finalIngre.push(ingredientArr.slice(3,ingredientArr.length).join(' ')) ; 
                }else {

                    finalIngre.push(ingredientArr[1]) ; 
                    finalIngre.push(ingredientArr.slice(2,ingredientArr.length).join(' ')) ; 
                }
            }else { //if (unitIndex === -1 && !(parseInt(ingredientArr[0]) || ingredient.includes('/')) ){ 
                /// no num and no unit 
                finalIngre.push(ingredientArr.join(' ')) ; 
                finalIngre.unshift('unit'); 
                finalIngre.unshift('unit');

            }
            // Handling count 
            const count = new Fraction((finalIngre[0])) ; 
            
            return {
                count:(count.numerator)?count:{numerator:1,denominator:1}, 
                unit:finalIngre[1],
                ingredient:finalIngre[2]
            }
        })
        
        

        this.ingredients = newIngredients ; 
    }

}























// // "4 1/2 ounces cream cheese, room temperature"
// // "2 tablespoons green pepper, sliced"

// const findNumber = cur =>{
//     const curArr = cur.split(' ') ; 
//     let res = -1 ; 
//     curArr.forEach((curArr,index,arr) =>{
//         if ((parseInt(curArr)>=1 && parseInt(curArr)<=9 ) && !curArr.includes('/'))  res = curArr ; 
        
//     })
//     if (res!=-1) return res  ; else return undefined ; 
// }

// const findFraction = cur => {
//     let res = -1 ; 
//     const curArr = cur.split(' ') ; 
//     curArr.forEach((cur,index,arr) =>{
//         if (cur.includes('/')) {
//             res = cur ; 
//         }
//     })
//     if (res != -1 ) return res ; 
// }

// const findUnit =(cur,unit) =>{
//     let res = -1 ; 
//     const curArr = cur.split(' ') ; 
//     unit.forEach((unit,i)=>{
//         if(curArr.find(unit)){
//             res = [unit,unit.length] ; 
//         } ; 
//     })
//     if (res!=-1) return res ; 
// }