const path = require('path')
const express = require('express')
const http = require('http')
const Filter = require('bad-words')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, getTopRooms } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.port || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

/**
 * connection gets invoked when new user join the room
 */
io.on('connection', (socket) => {
    console.log("New Connection")

    socket.on('join', (options, callback) => {
        const { user, error } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage("Admin", `Welcome ${user.username}!!`))
        socket.broadcast.to(user.room).emit('message', generateMessage("Admin", `${user.username} has joined!!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    /**
     * When user hit send message button it passed to server via socker
     * and recieved here then this socket checks that if there is profanity
     * in the message or not then it emits that message to the same room so
     * all the users of that particular room will be able to see it
     */

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback('Message delivered!')
    })

    /**
     * this socket listens when users left the room it notifies other
     * users that user with particular room has left the room
     */

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage("Admin", `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    /**
     * this socket listens when user shares it's location from client side
     * then it emits that location to users of same room
     */

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback('Location shared!!')
    })

    /**
     * socket to fetch request of gettinng top rooms from
     * client side and emitting the rooms to server side.
     */
    socket.on('getTopRooms', (callback) => {
        const rooms = getTopRooms()
        io.emit('sendTopRooms', rooms)
        callback()
    })
})

/**
 * listening on port 3000 on localhost
 */
server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})
