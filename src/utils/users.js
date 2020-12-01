let users = []
//adduser, removeuser, getuser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    //clean the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    room = room.trim().toLowerCase()

    //validate the data
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate user
    if (existingUser) {
        return {
            error: 'Username already exists'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => {
        return user.room === room
    })
}

/*
 function to fetch top 5 trending rooms
 to give suggestions to user
*/

const getTopRooms = () => {
    const rooms = []
    users.forEach((item, index) => {
        const ind = rooms.findIndex((room) => room.name === item.room)
        if (ind != -1) {
            rooms[ind].count = rooms[ind].count + 1;
        } else {
            const room = { name: item.room, count: 1 }
            rooms.push(room)
        }
    })

    return sortByCount(rooms)
}

/*
comparator to sort room name by most number of
people in it.
*/
const sortByCount = (rooms) => {
    //sorting in descending order
    rooms.sort(function (a, b) {
        if (a.count < b.count) {
            return -1;
        }

        if (a.count > b.count) {
            return 1;
        }

        return 0;
    })

    return rooms.reverse().splice(0, 5)
}

const getTotalUsers = () => {
    return {
        count: users.length,
        users
    }
}

const clearData = () => {
    users = []
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getTopRooms,
    getTotalUsers,
    clearData
}