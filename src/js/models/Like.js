export default class Like{
    constructor(){
        this.likeItems = [] ; 
    }
    /* 
        
    */

    saveItem(id,img,title,author){
        const item = {
            id,
            img,
            title,
            author
        }
        this.likeItems.push(item) ; 
        
        // Save storage 
        this.saveStorage() ; 
    }

    isLiked(_id){
        return (this.likeItems.findIndex(el=>el.id === _id) !== -1 )
        
    }

    removeItem(_id){
        const index = this.likeItems.findIndex(el=>el.id===_id) ; 
        if (index !== -1 ){
            this.likeItems.splice(index,1) ; 
        }

        // Save storage 
        this.saveStorage() ; 
    }

    saveStorage(){
        localStorage.setItem('like', JSON.stringify(this.likeItems));
    }
    
    getStorage(){
        return  JSON.parse(localStorage.getItem('like')) ; 
    }

}