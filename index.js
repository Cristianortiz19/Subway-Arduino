 const express = require('express');
const { Server } = require('socket.io');
const {SerialPort, ReadlineParser} = require('serialport');
const cors = require('cors');
const { FireStoreDB } = require("./firebase-config.js")
const PORT = 5050;

const leadsCollection = new FireStoreDB('Leads');
const interactionsCollection = new FireStoreDB('StartInteraction');

// ⚙️ HTTPS COMMUNICATION SETUP________________________________________________
const app = express();
app.use(cors({origin: "*"}))
app.use(express.json());
app.use('/app', express.static('public-app'));
app.use('/mupi', express.static('public-mupi'));
//============================================ END

// ⚙️ SERIAL COMMUNICATION SETUP________________________________________________
const protocolConfiguration = {
    path: '/COM3',
    baudRate: 9600
}
const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser);
//============================================ END

// ⚙️ WEBSOCKET COMMUNICATION SETUP________________________________________________
const httpServer = app.listen(PORT, () => {
    console.table(
        {
            'App:' : `http://localhost:${PORT}/app`,
            'Mupi:' : `http://localhost:${PORT}/mupi`,
        }
    )
}); 
const io = new Server(httpServer, { path: '/real-time' });
//============================================ END

// 🔄 SERIAL COMMUNICATION WORKING___________________________________________
let ingredientData = [];
parser.on('data', (arduinoData) => {
    ingredientData = arduinoData.split(' ');
    console.log(ingredientData);
    io.emit('arduinoData', ingredientData);
})


// 🔄 WEBSOCKET COMMUNICATION___________________________________________
io.on('connection', socket => {
    console.log('Conectado', socket.id);

    socket.on('status', status => {
        socket.broadcast.emit('mupi-status', status);
    })
});

let userData;
app.post('/user-data', (req, res) => {
    userData = req.body;
    res.send({Data: `User data is: ${userData}`})
    console.log(userData);
})

// FIREBASE COMMUNICATION___________________________________________
app.get('/leads', (request, response) => {
    timeStamp();
    leadsCollection.getCollection()
        .then((leads) => {
            console.log(leads);
            response.send(leads);
        })
})

app.get('/interactions', (request, response) => {
    timeStamp();
    interactionsCollection.getCollection()
        .then((interactions) => {
            console.log(interactions);
            response.send(interactions);
        })
})

app.post('/add-new-lead', (request, response) => {
    timeStamp(),
    console.log(request.body);
    request.body.timeStamp = timeStamp();
    request.body.location = "Universidades"
    leadsCollection.addNewDocument(request.body);
    response.status(200).end();
})

app.post('/add-new-interaction', (request, response) => {
    timeStamp();
    console.log(request.body);
    request.body.timeStamp = timeStamp();
    request.body.location = "Universidades"
    interactionsCollection.addNewDocument(request.body);
    response.status(200).end();
})

function timeStamp(){
    let date = new Date();
    let [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
    let [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    console.log(`${hour}:${minutes}:${seconds} - ${month}/${day}/${year}`);
    return `${hour}:${minutes}:${seconds} - ${month}/${day}/${year}`
}