const URL = `https://${window.location.hostname}`;
let socket = io(URL, { path: '/real-time' });

let controllerX, controllerY = 0;

let ingredients = [];

let appIngredients = null;

let fillIngredients = [];

let correct = [];

let result = false;

let userAttempt = [];

let mobileScreen = 1;

let count = 0;

let imageFiles = [];

let ingredientsFiles = [];

let sendIngredient = [];

let user = {};

const DNS = getDNS;

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    controllerX = windowWidth / 2;
    controllerY = windowHeight / 2;
    background(0);
    angleMode(DEGREES);
    ingredients.forEach(element => {
        correct.push(element.ingredientType);
        sendIngredient.push({ingredientType: element.ingredientType})
    });

    appIngredients = ingredients;

    timer();
    //Cargar imágenes del movil
    loadMobileImages();

    //Recolectar datos del usuario
    userName = createInput('');
    userName.position(20, 256);
    userName.size(355, 52);
    userName.input(userNameInput);
    userName.style('display', 'none');
    
    email = createInput('');
    email.position(20, 325);
    email.size(355, 52);
    email.input(emailInput);
    email.style('display', 'none');

    submitButton = createButton("Enviar");
    submitButton.mousePressed(function () {
        userData(user);
        console.log(user);
    });
    submitButton.position(35, 475);
    submitButton.size(315, 75);
    submitButton.style('display', 'none');
}

function userNameInput() {
    user['name'] = this.value();
}

function emailInput() {
    user['email'] = this.value();
}

function draw() {
    fill(255);
    //Bread :D

    switch (mobileScreen) {
        case 1:
            image(imageFiles[20], 0, 0, 395, 853);
            break;
        
        case 2:
            image(imageFiles[21], 0, 0, 395, 853);
            
            break;
        case 3:
            imageMode(CORNER);
            image(imageFiles[22], 0, 0, 395, 853);
            textSize(60);
            textAlign(CENTER);
            text("00 : " + count, windowWidth/2, windowHeight/2);

            if(count == 0){
                mobileScreen = 4;
                count = 20;
            }
            break;
        case 4:
            imageMode(CORNER);
            image(imageFiles[23], 0, 0, 395, 853);
            fill(253, 221, 202);
            imageMode(CENTER);
            image(imageFiles[0], 210, 440, 250, 250);
            rectMode(CENTER);
            textSize(60);
            textAlign(CENTER);
            fill(255);

            let xPos = 70;
            let yPos = 550;
            appIngredients.forEach((element, index) => {
                if(xPos > 400){
                    yPos += 70;
                    xPos = 70;
                }
                element.setX(xPos)
                element.setY(yPos)
                xPos += 120;
                image(element.imageFile, element.getX(), element.getY(), 150, 150);
            });

            fillIngredients.forEach((element, index) => {
                imageMode(CENTER);
                image(element.imageFile, 205, (55 * index) + 210, 210, 210);
            });
            image(imageFiles[0], 210, 150, 250, 250);

            if(JSON.stringify(userAttempt) === JSON.stringify(correct)){
                result = true;
                setTimeout(function() {
                    mobileScreen = 5;
                }, 1500)
            }
            break;
        case 5:
            imageMode(CORNER);
            image(imageFiles[24], 0, 0, 395, 853);
            userName.style('display', 'block')
            email.style('display', 'block')
            submitButton.style('display', 'block')
            break;
    }
    //Enviar pantalla actual al mupi
    socket.emit('app-screen', { mobileScreen, result });
}

function mousePressed() {
    switch (mobileScreen) {
        case 1: // Pantalla Jugar
            if (pmouseX > 40 && pmouseX < 360 &&
                pmouseY > 480 && pmouseY < 550){
                    mobileScreen = 2;
                    socket.emit('app-ingredients', sendIngredient);
                }
            break;
        case 2: // Pantalla instrucciones
            if (pmouseX > 40 && pmouseX < 360 &&
                pmouseY > 480 && pmouseY < 550){
                    mobileScreen = 3; 
                    count = 20;
            }
            
            break;
        case 4:
            appIngredients.forEach((element, i) => {
                if(dist(mouseX, mouseY, element.getX(), element.getY()) < 50){
                    fillIngredients.push(element);
                    userAttempt.push(element.ingredientType);
                    appIngredients.splice(i, 1);
                    let attempt = element.ingredientType
                    socket.emit('fill-ingredients', attempt);
                }
            });
            break;
        case 5:

            break;
        default:
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function loadMobileImages() {
    imageFiles[0] = loadImage('src/pan.png');
    imageFiles[20] = loadImage('src/APP 0.jpg');
    imageFiles[21] = loadImage('src/APP 1.jpg');
    imageFiles[22] = loadImage('src/APP 2.jpg');
    imageFiles[23] = loadImage('src/APP 3.jpg');
    imageFiles[24] = loadImage('src/APP 4.jpg');
    appIngredients.forEach(element => {
        element.imageFile = loadImage('src/'+element.ingredientType+'.png');
    });
}

async function userData() {
    const data = {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    }
    await fetch('/user-data', data);
}