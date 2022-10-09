const { response } = require('express');
const express = require('express');
const { Server } = require('socket.io');
const PORT = 5050;
const SERVER_IP = '192.168.1.59';

const app = express();
app.use(express.json());
app.use('/app', express.static('public-app'));
app.use('/mupi', express.static('public-mupi'));

const httpServer = app.listen(PORT, () => {
    console.table(
        {
            'App:' : `http://${SERVER_IP}:${PORT}/app`,
            'Mupi:' : `http://${SERVER_IP}:${PORT}/mupi`,
        }
    )
});

const io = new Server(httpServer, { path: '/real-time' });

io.on('connection', socket => {
    console.log('Conectado', socket.id);

    socket.on('app-screen', screen => {
        socket.broadcast.emit('mupi-screen', screen);
    })

    socket.on('app-ingredients', ingredientList => {
        socket.broadcast.emit('mupi-ingredients', ingredientList);
        console.log('Recibí ingredientes')
    })

    socket.on('fill-ingredients', fillIngredient => {
        socket.broadcast.emit('attempt', fillIngredient)
    })
});

let userData;
app.post('/user-data', (req, res) => {
    userData = req.body;
    res.send({Data: `User data is: ${userData}`})
    console.log(userData);
})



