const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let mupiScreen = 0;
let mupiIngredients = null;

let fillIngredients = [];

let mupiImageFiles = [];

let results = null;

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(0);
    mupiLoadImages();
    //Crear 6 Ingredientes aleatorios
    for (let i = 0; i < 5; i++) {
        ingredients.push(new Ingredient(windowWidth/2, (45 * i) + 170));
    }
}

function draw() {
    fill(255);

    switch (mupiScreen) {
        case 0:
            background(0, 102,42);
            image(mupiImageFiles[0], 0, 0, 480, 720);

            break;
        case 1:
            image(mupiImageFiles[1], 0, 0, 480, 720);
            break;
        case 2:
            image(mupiImageFiles[2], 0, 0, 480, 720);
            break;
        case 3:
            background(0, 102,42);
            imageMode(CORNER);
            image(mupiImageFiles[3], 0, 0, 480, 720);
            imageMode(CENTER);
            image(mupiImageFiles[20], windowWidth/2, 600, 300, 300);
            mupiIngredients.forEach((element, index) => {
                imageMode(CENTER);
                image(element.imageFile, 240, (80 * index) + 240, 230, 230);
            });
            image(mupiImageFiles[20], windowWidth/2, 170, 300, 300);
            break;
        case 4:
            imageMode(CORNER);
            image(mupiImageFiles[4], 0, 0, 480, 720);
            imageMode(CENTER);
            image(mupiImageFiles[20], windowWidth/2, 600, 300, 300);
            fillIngredients.forEach((element, index) => {
                imageMode(CENTER);
                image(element.imageFile, 240, (80 * index) + 240, 230, 230);
            });
            image(mupiImageFiles[20], windowWidth/2, 170, 300, 300);

            if(results == true){
                imageMode(CORNER);
                image(mupiImageFiles[5], 0, 0, 480, 720)
            }
            break;
        case 6:
            background(0, 102,42);
            break;
        default:
            break;
    }
}

//Cowndown
timer = function() {
    setInterval(function() {
        if(count > 0){
            count --;
        }
    }, 1000);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
//Recibir información sobre la pantalla actual
socket.on('mupi-screen', screen => {
    let { mobileScreen, result } = screen;
    mupiScreen = mobileScreen;
    results = result;
})

//Recibir ingredientes
socket.on('mupi-ingredients', ingredients => {
    mupiIngredients = ingredients;
    console.log('Ingredients-received!')
    console.log(mupiIngredients)
    mupiIngredients.forEach(ingredient => {
        ingredient.imageFile = loadImage('src/'+ingredient.ingredientType+'.png');
    })
})

socket.on('attempt', fillIngredient => {
    fillIngredients.push({ingredientType: fillIngredient})
    fillIngredients.forEach(ingredient => {
        ingredient.imageFile = loadImage('src/'+ingredient.ingredientType+'.png');
    })
    console.log(fillIngredients);
})


function mupiLoadImages() {
    for (let i = 0; i < 7; i++) {
        mupiImageFiles[i] = loadImage('src\MUPI'+i+'.jpg')
        
    }
}


