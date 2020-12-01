const users = require('../src/utils/users')
const { user } = require('./fixtures/users')

/**
 * adding user before testing test cases
 */


beforeEach(() => {
    users.addUser(user)
})

afterEach(() => {
    users.clearData()
})

test('addUser', () => {
    /**
     * creating and adding a dummy user
    */

    const user = {
        id: '1323142142',
        username: 'Karan',
        room: 'India'
    }

    expect(users.addUser(user)).not.toBeNull()

    /**
     * fetching latest user array and it's count
     */

    const { count } = users.getTotalUsers()

    expect(count).toEqual(2)

})

/**
 * Remove User that is not existed
 */
test('Remove not existing user', () => {
    let users_latest = users.removeUser('abcsdada')
    expect(users_latest).toEqual(-1)
})

/**
 * Remove existed user
 */

test('Remove Existing User', () => {
    let users_latest = users.removeUser(user.id)
    expect(users_latest).not.toBeNull()

    /**
     * checking that removed user attributes
     * similar to add user attributes
     */
    expect(users_latest.id).toBe(user.id)
    expect(users_latest.username).toBe(user.username)
    expect(users_latest.room).toBe(user.room)
})

/**
 * get not existing user by id
 */
test('get not existing user', () => {
    expect(users.getUser('abcdef')).toBeUndefined()
})


/**
 * get User by Id
 */

test('get existing user', () => {
    const users_latest = users.getUser(user.id)

    expect(users_latest).not.toBeUndefined()

    expect(users_latest.id).toBe(user.id)
    expect(users_latest.username).toBe(user.username)
    expect(users_latest.room).toBe(user.room)
})

/**
 * get user in not existing room
 */

test('get users in non existent room', () => {
    expect(users.getUsersInRoom('NodeJs').length).toBe(0)
})

/**
 * get users in a room
 */

test('get users in room', () => {
    const users_arr = users.getUsersInRoom(user.room)
    const users_latest = users_arr[0]

    expect(users_arr.length).toBe(1)

    expect(users_latest.id).toBe(user.id)
    expect(users_latest.username).toBe(user.username)
    expect(users_latest.room).toBe(user.room)
})

/**
 * checking trending rooms
 */
test('get top trending rooms', () => {
    const rooms_arr = users.getTopRooms()

    expect(rooms_arr.length).toBe(1)
    expect(rooms_arr[0]).toMatchObject({
        count: 1,
        name: "ipl"
    })
})