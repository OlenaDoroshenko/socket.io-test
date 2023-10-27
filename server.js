const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

//   io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//       });
//   });

server.listen(process.env.PORT || 3000, function () {
  console.log('Server running in port 3000')
})

app.use(express.static(__dirname + '/public'))

const users = {}

io.sockets.on('connection', (client) => {
console.log("a user Connected.")
  const broadcast = (event, data) => {
    client.emit(event, data)
    client.broadcast.emit(event, data)
  }

  broadcast('user', users)

  client.on('message', (message) => {
    if (users[client.id] !== message.name) {
      users[client.id] = message.name
      broadcast('user', users)
    }
    broadcast('message', message)
  })

  client.on('disconnect', () => {
    delete users[client.id]
    client.broadcast.emit('user', users)
  })
})