const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let mupiScreen = 4;
let ingredients = [];
let userSandwich = [];

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
            background(255);
            image(mupiImageFiles[0], 0, 0, 480, 720);
            break;
        case 2:
            image(mupiImageFiles[1], 0, 0, 480, 720);
            break;
        case 3:
            background(0, 102,42);
            imageMode(CORNER);
            image(mupiImageFiles[2], 0, 0, 480, 720);
            imageMode(CENTER);
            image(mupiImageFiles[20], 240, 630, 400, 400);
            ingredients.forEach((element, index) => {
                imageMode(CENTER);
                image(element.imageFile, 240, (55 * index) + 400, 280, 280);
            });
            image(mupiImageFiles[20], 240, 320, 400, 400);
            break;
        case 4:
            imageMode(CORNER);
            image(mupiImageFiles[4], 0, 0, 480, 720);
            imageMode(CENTER);
            image(mupiImageFiles[20], 240, 480, 290, 290);
            userSandwich.forEach((element, index) => {
                imageMode(CENTER);
                image(element.imageFile, 240, (40 * index) + 310, 200, 200);
            });
            image(mupiImageFiles[20], 240, 250, 290, 290);

            /*if(results == true){
                imageMode(CORNER);
                image(mupiImageFiles[5], 0, 0, 480, 720)
            }*/
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


function mupiLoadImages() {
    for (let i = 0; i < 7; i++) {
        mupiImageFiles[i] = loadImage('src/MUPI'+i+'.jpg')
    }
    mupiImageFiles[20] = loadImage('src/pan.png')
}


