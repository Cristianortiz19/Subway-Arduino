class Ingredient {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.type = Math.floor(random(0, 5));
        this.ingredientRandom();
        this.imageFile = loadImage('src/'+this.ingredientType+'.png');
    }
    ingredientRandom() {
        switch (this.type) {
            case 0:
                this.ingredientType = 'Lechuga';
                break;
            case 1:
                this.ingredientType = 'Champiñones';
                break;
            case 2:
                this.ingredientType = 'Mostaza';
                break;
            case 3:
                this.ingredientType = 'Cebolla';
                break;
            case 4:
                this.ingredientType = 'Tocineta';
                break;
            default:
                break;
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(newX) {
        this.x = newX;
    }

    setY(newY) {
        this.y = newY;
    }
}