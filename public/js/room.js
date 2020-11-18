const socket = io()

const roomTemplate = document.querySelector('#room-template').innerHTML 
const counts = document.querySelector('#counting')

socket.emit('getTopRooms', (error) => {
    if(error) {
        throw new Error()
    }
})

socket.on('sendTopRooms', (rooms) => {
    console.log("hello")
    const html = Mustache.render(roomTemplate, {
        rooms
    })
    
    counts.innerHTML = html
})