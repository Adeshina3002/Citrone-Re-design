const nodemailer = require("nodemailer")

const sendMail = async(email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Email successfully sent: " + info.response)

    } catch (error) {
        console.log("Email was not sent: ", error)
        return { sent: false, error: error.message }
    }
}

module.exports = sendMail