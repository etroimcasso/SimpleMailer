module.exports ={
	PasswordsDoNotMatch: "Passwords Do Not Match",
	AddAdminUserFailure: (error) => `Unable to create admin user: ${error}`,
	AddAdminUserSuccess:  (username) => `Created admin user ${username}`,
	InvalidUsername: `Username is invalid`,
	InvalidPassword: `Passwords are invalid (too short / too long)`
}