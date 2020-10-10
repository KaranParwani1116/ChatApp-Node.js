const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#share-location')

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

socket.on('message', (message) => {
    console.log(message)
})