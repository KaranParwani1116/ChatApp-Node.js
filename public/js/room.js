const socket = io()

const roomTemplate = document.querySelector('#room-template').innerHTML
const counts = document.querySelector('#counting')

/**
 * socket to request top trending rooms from client side
 */

socket.emit('getTopRooms', (error) => {
    if (error) {
        throw new Error('unable to fetch trending rooms')
    }
})

/**
 * socket to fetch top trending rooms from server side
 */

socket.on('sendTopRooms', (rooms) => {
    console.log("hello")
    const html = Mustache.render(roomTemplate, {
        rooms
    })

    counts.innerHTML = html
})