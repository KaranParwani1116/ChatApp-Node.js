const sgMail = require('@sendgrid/mail')

sgMail.setApiKey('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')

const sendRoomJoinEmail = async (username, email, room) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'karanparwani.parwani102@gmail.com', // Change to your verified sender
        subject: `Thanks for joining Chatapp ${username}`,
        html: `<strong>You joined room ${room}. Go Chat and enjoy!!!</strong>`,
    }

    try {
        await sgMail.send(msg)
    } catch (error) {
        console.log(error)
    }
}

const sendRoomLeaveEmail = async (username, email, room) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'karanparwani.parwani102@gmail.com', // Change to your verified sender
        subject: `Leaving ${room}`,
        html: `<strong>We hope you enjoyed our experience</strong>`,
    }

    try {
        await sgMail.send(msg)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendRoomJoinEmail,
    sendRoomLeaveEmail
}

