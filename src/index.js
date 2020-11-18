const path = require('path')
const express = require('express')
const http = require('http')
const Filter = require('bad-words')
const socketio = require('socket.io')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom, getTopRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.port || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log("New Connection")

    socket.on('join', (options, callback) => {
        const {user, error} = addUser({id: socket.id, ...options})

        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage("Admin", `Welcome ${user.username}!!`))
        socket.broadcast.to(user.room).emit('message', generateMessage("Admin",`${user.username} has joined!!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback('Message delivered!')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage("Admin",`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback('Location shared!!')
    })

    socket.on('getTopRooms', (callback) => {
        const rooms = getTopRoom()
        io.emit('sendTopRooms', rooms)
        callback()
    })
})


server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})