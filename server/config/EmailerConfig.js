require('dotenv').config();

module.exports = {
	SupportAccount: {
		pool: true,
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		},
	authMethod: 'LOGIN'
	}
}