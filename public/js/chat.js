const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username, room, email} = Qs.parse(location.search, {ignoreQueryPrefix: true})

console.log(email)

const autoScroll = () => {
	const $newMessage = $messages.lastElementChild

	//height of the new message
	const newMessageStyles = getComputedStyle($newMessage)
	const newMessageMargin = parseInt(newMessageStyles.marginBottom)
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

	//visible height
	const visibleHeight = $messages.offsetHeight

	//height of message container
	const containerHeight = $messages.scrollHeight

	//how far i have scrolled?
	const scrollOffset = $messages.scrollTop + visibleHeight

	if(containerHeight - newMessageHeight <= scrollOffset) {
		$messages.scrollTop = $messages.scrollHeight
	}
}

/**
 * socket listens when some other user sends the message to the user
 * and displayed it to screen
 */
socket.on('message', (message) => {
	console.log(message)
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a')
	})

	$messages.insertAdjacentHTML('beforeend', html)
	autoScroll()
})

/**
 * socket listens when some other user shares the location to the user
 * and displayed it to screen
 */

socket.on('locationMessage', (locationMessage) => {
	console.log(locationMessage)
	const html = Mustache.render(locationTemplate, {
		username: locationMessage.username,
		url: locationMessage.url,
		createdAt: moment(locationMessage.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
	autoScroll()
})

/**
 * this socket is used to populate the sidebar of chatscreen
 * which shows the title of the room we are in and the number
 *  of users in that room
 */

socket.on('roomData', ({room, users}) => {
	const html = Mustache.render(sidebarTemplate, {
		room,
		users
	})
	document.querySelector('#sidebar').innerHTML = html
})

/**
 * this invokes when message send button hits
 */

$messageForm.addEventListener('submit', (e) => {
	e.preventDefault()
	//disable the button
	$messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (ack) => {
		$messageFormButton.removeAttribute('disabled')
		$messageFormInput.value = ''
		$messageFormInput.focus()
		
		console.log(ack)
	})
})

/**this gets invoked when share location button gets hits */

$shareLocationButton.addEventListener('click', () => {
	if(!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser')
	}

	$shareLocationButton.setAttribute('disabled', 'disabled')

	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('sendLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, (ack) => {
			$shareLocationButton.removeAttribute('disabled')
			console.log(ack)
		})
	})
})

socket.emit('join', {username, room, email}, (error) => {
	if(error) {
		alert(error)
		location.href = '/'
	}
})
