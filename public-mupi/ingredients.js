class Ingredient {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.type = Math.floor(random(0, 10));
        this.ingredientRandom();
    }

    ingredientRandom() {
        switch (this.type) {
            case 0:
                this.ingredientType = 'Cebolla';
                break;
            case 1:
                this.ingredientType = 'Lechuga';
                break;
            case 2:
                this.ingredientType = 'Pepinillos';
                break;
            case 3:
                this.ingredientType = 'Queso';
                break;
            case 4:
                this.ingredientType = 'Tomate';
                break;
            case 5:
                this.ingredientType = 'Camarones';
                break;
            case 6:
                this.ingredientType = 'Champiñones';
                break;
            case 7:
                this.ingredientType = 'Mostaza';
                break;
            case 8:
                this.ingredientType = 'BBQ';
                break;
            case 9:
                this.ingredientType = 'Tocineta';
                break;
            case 10:
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