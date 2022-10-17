const URL = `http://${window.location.hostname}:5050`;
let socket = io(URL, { path: '/real-time' });

let mobileScreen = 0;

let imageFiles = [];

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
        mobileScreen = 1;
    });
    submitButton.position(35, 475);
    submitButton.size(315, 75);
    submitButton.style('display', 'none');

    let appStatus = 'connected'

    socket.emit('status', appStatus);
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
        case 0:
            imageMode(CORNER);
            image(imageFiles[0], 0, 0, 395, 853);
            userName.style('display', 'block')
            email.style('display', 'block')
            submitButton.style('display', 'block')
            break;
        case 1:
            image(imageFiles[1], 0, 0, 395, 853);
            break;
    }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function loadMobileImages() {
    imageFiles[0] = loadImage('src/APP0.jpg');
    imageFiles[1] = loadImage('src/APP1.jpg');
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