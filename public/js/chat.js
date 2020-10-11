const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#share-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (message) => {
	console.log(message)
	const html = Mustache.render(messageTemplate, {
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a')
	})

	$messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationMessage) => {
	console.log(locationMessage)
	const html = Mustache.render(locationTemplate, {
		url: locationMessage.url,
		createdAt: moment(locationMessage.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
})

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
