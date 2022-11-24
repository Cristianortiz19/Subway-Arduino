const NGROK = `http://${window.location.hostname}:5050`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let mupiScreen = 1;
let ingredients = [];
let userSandwich = [];

let mupiImageFiles = [];

let fonts = [];

let count = 0;

let results = null;

let correct = [];
let userAttempt = [];
let isCorrect = false;

let source = 'src/LoopSong.mp3'
let audio = document.createElement("audio")
audio.autoplay = true
audio.load()
audio.addEventListener('load', () => {
    audio.play()
}, true)
audio.src = source;

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
    createIngredients();
    timer();
    fonts[0] = loadFont('src/Poppins-Medium.otf');
}

function draw() {
    fill(255);
    textFont(fonts[0]);
    switch (mupiScreen) {
        case 0:
            background(0, 102,42);
            image(mupiImageFiles[50], 0, 0, 480, 720);

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
            image(mupiImageFiles[20], 240, 630 + sizeChange*10, 400, 400);
            for (let i = ingredients.length-1; i >= 0; i--) {
                const element = ingredients[i];
                imageMode(CENTER);
                image(element.imageFile, 240, (55 * i) + 400 + sizeChange*8, 280, 280);
            }
            image(mupiImageFiles[20], 240, 320 + sizeChange*10, 400, 400);
            textSize(60);
            textAlign(CENTER);
            timerAnimation1();
            
            break;
        case 4:
            imageMode(CORNER);
            image(mupiImageFiles[4], 0, 0, 480, 720);
            imageMode(CENTER);
            image(mupiImageFiles[20], 240, 480+ sizeChange * 2, 290+sizeChange, 290+sizeChange);
            userSandwich.forEach((element, index) => {
                imageMode(CENTER);
                image(mupiImageFiles[element.index + 100], 240, (40 * index) + 310 + sizeChange * 2, 200+sizeChange, 200+sizeChange);
            });
            image(mupiImageFiles[20], 240, 250+ sizeChange * 2, 290+sizeChange, 290+sizeChange);
            image(mupiImageFiles[51], 250, 600 + sizeChange*10,450, 220);
            checkSandwich();

            timerAnimation2();

            break;
        case 5:
            imageMode(CORNER);
            image(mupiImageFiles[5], 0, 0, 480, 720);
            socket.on('mupi-status', mupiStatus => {
                console.log(mupiStatus)
                if(mupiStatus == 'connected'){
                    mupiScreen = 1;
                }
            })
            break;
        case 6:
            imageMode(CORNER);
            image(mupiImageFiles[6], 0, 0, 480, 720);
            break;
        case 8:
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
    mupiImageFiles[50] = loadImage('src/Animation.jpg')
    mupiImageFiles[51] = loadImage('src/Options.png')

    mupiImageFiles[20] = loadImage('src/pan.png');
    mupiImageFiles[100] = loadImage('src/Lechuga.png');
    mupiImageFiles[101] = loadImage('src/Champiñones.png');
    mupiImageFiles[102] = loadImage('src/Mostaza.png');
    mupiImageFiles[103] = loadImage('src/Cebolla.png');
    mupiImageFiles[104] = loadImage('src/Tocineta.png');

    //soundFormats('mp3')
    //songFiles[0] = loadSound('src/LoopSong.mp3');
}

socket.on('arduinoData', (arduinoMessage) => {
    arduinoMessage.forEach((element, index) => {
        switch (mupiScreen) {
            case 0:
                
                break;
            case 1:
                if(index == 5 && element == 1){
                    mupiScreen = 2;
                    //songFiles[0].play();
                }
                break;
            case 2:
                if(index == 5 && element == 1){
                    mupiScreen = 3;
                    count = 10;
                    sizeChange = 0;
                }
                break;
            case 3:
                //screen = 2;
                break;
            case 4:
                if(element == 1 && userSandwich.length < 5){
                    addIngredient(index);
                }
                if(index == 5 && element == 1){
                    userSandwich.splice(userSandwich.length - 1, 1);
                    userAttempt.splice(userAttempt.length - 1, 1);
                }
                break;
            case 6:
                if(index == 5 && element == 1){
                    mupiScreen = 1;
                    ingredients = [];
                    correct = [];
                    userSandwich = [];
                    userAttempt = [];
                    createIngredients();
                }
                break;
            default:
                break;
        }
    })
})

function addIngredient(index) {
    switch (index) {
        case 0:
            userSandwich.push({ingredient: 'Lechuga', index: 0});
            userAttempt.push('Lechuga');
            break;
        case 1:
            userSandwich.push({ingredient: 'Champiñones', index: 1})
            userAttempt.push('Champiñones');
            break;
        case 2:
            userSandwich.push({ingredient: 'Mostaza', index: 2})
            userAttempt.push('Mostaza');
            break;
        case 3:
            userSandwich.push({ingredient: 'Cebolla', index: 3})
            userAttempt.push('Cebolla');
            break;
        case 4:
            userSandwich.push({ingredient: 'Tocineta', index: 4})
            userAttempt.push('Tocineta');
            break;
        default:
            break;
    }
    console.log(userSandwich);
}

let sizeChange = 0;
function timerAnimation1(){
    let size = 0;
    if(frameCount % 20 == 0 && count <= 5 && count > 3){
        size += 5;
    }
    if(frameCount % 10 == 0 && count <= 3 && count > 0){
        size += 7;
    }
    
    if(count > 0){
        textSize(60 + size);
        if(count < 10){
            text("00 : 0" + count, 240, 180);
        } else {
            text("00 : " + count, 240, 180);
        }
    }
    
    
    if(count == 0){
        if(sizeChange < 60){
            sizeChange ++;
        }
        textSize(60 + sizeChange/2)
        text("00 : 00", 240, 180 + sizeChange*2);
        textSize(40);
        text('¡Tiempo fuera!', 240, 230 + sizeChange*2);
        setTimeout(function() {
            mupiScreen = 4;
            count = 10;
            sizeChange = 0;
        }, 4000)
    }
}

function timerAnimation2(){
    let size = 0;
    if(frameCount % 20 == 0 && count <= 5 && count > 3){
        size += 5;
    }
    if(frameCount % 10 == 0 && count <= 3 && count > 0){
        size += 7;
    }

    fill(242,183,0);
    textSize(60 + size);

    if(count != 0){
        if(count < 10){
            text("00 : 0" + count, 240, 180);
        } else {
            text("00 : " + count, 240, 180);
        }
    }
    textSize(30);
    if(count == 0){
        text("¡Tu subway está listo!", 240, 180);
    }
    if(count == 0){
        if(sizeChange < 60){
            sizeChange ++;
        }
    }
}

function checkSandwich(){
    if(JSON.stringify(userAttempt) === JSON.stringify(correct)){
        isCorrect = true;
    }
    if(isCorrect == true && count == 0){
        setTimeout(function() {
            mupiScreen = 5;
        }, 4000)
    }
    if(isCorrect == false && count == 0){
        setTimeout(function() {
            mupiScreen = 6
        }, 4000)
    }
}

function createIngredients() {
    for (let i = 0; i < 5; i++) {
        ingredients.push(new Ingredient(windowWidth/2, (45 * i) + 170));
    }
    ingredients.forEach(element => {
        correct.push(element.ingredientType);
    });
    console.log(correct)
}


