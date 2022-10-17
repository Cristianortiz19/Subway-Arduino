 const express = require('express');
const { Server } = require('socket.io');
const {SerialPort, ReadlineParser} = require('serialport');
const cors = require('cors');
const PORT = 5050;

// ⚙️ HTTPS COMMUNICATION SETUP________________________________________________
const app = express();
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



