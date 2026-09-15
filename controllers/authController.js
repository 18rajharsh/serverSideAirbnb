const { check, validationResult } = require("express-validator");
const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
	console.log("came to getlogin middleware line no - 6");
	res.render("auth/login", { PageTitle: "Login", currentPage: "Login", isLoggedIn: false,
		error: [],
		oldInput: {email: ""},
		user: {}
	});
};

exports.postLogin = async (req, res, next) => {
	const email = req.body.email?.trim().toLowerCase();
	const password = req.body.password;

	try {
		const user = await User.findOne({ email });
		if(!user){
			return res.status(422).render('auth/login', {
				PageTitle: "Login",
				currentPage: "Login",
				isLoggedIn: false,
				error: ["User does not exist!"],
				oldInput: {email},
				user: {}
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if(!isMatch){
			return res.status(422).render('auth/login', {
				PageTitle: "Login",
				currentPage: "Login",
				isLoggedIn: false,
				error: ["Invalid Password!"],
				oldInput: {email},
				user: {}
			});
		}

		req.session.isLoggedIn = true;
		req.session.user = user;
		console.log("User Loged in! line - 45");
		try {
		await req.session.save();
		console.log("Session saved successfully");
		console.log('user: ', user)
		} catch (err) {
		console.log("SESSION SAVE ERROR:", err);
		}
		res.redirect('/');
	} catch (err) {
		next(err);
	}
}

exports.postLogout = (req, res, next) => {
	console.log(req.session.id);
	req.session.destroy((err) => {
		if(err){
			return next(err);
		}
		res.redirect('/login');
	})
}

exports.getSignup = (req, res, next) => {
	console.log("Came to signup page");
	res.render('auth/signup', {
		PageTitle: 'signup',
		currentPage: 'signup',
		isLoggedIn: false,
		error: [],
		oldInput: {firstName: '', lastName: '', email: '', userMode: ''},
		user: {}
	});
}

exports.postSignup = [ 
	// First Name Validation
	check("firstName")
	.trim()
	.isLength({min: 2})
	.withMessage("First Name should be atleast 2 characters long")
	.matches(/^[A-Za-z\s]+$/)
	.withMessage("First Name should contain only alphabets"),

	// Last Name Validation
	check("lastName")
	.matches(/^[A-Za-z\s]+$/)
	.withMessage("Last name should contain only alphabets"),

	// Email Validation
	check("email")
	.isEmail()
	.withMessage("Please enter a valid email")
	.normalizeEmail(),

	// Password Validation
	check("password")
	.isLength({min:8})
	.withMessage("Password should be atleast 8 characters long")
	.matches(/[A-Z]/)
	.withMessage("Password should contain atleast one uppercase")
	.matches(/[a-z]/)
	.withMessage("Password should contain atleast one lowercase")
	.matches(/[0-9]/)
	.withMessage("Password should contain atleast one number")
	.matches(/[!@&]/)
	.withMessage("Password should contain atleast one special character")
	.trim(),

	// Confirm Password Validation
	check('confirmPassword')
	.trim()
	.custom((value, {req}) => {
		if(value != req.body.password){
			throw new Error("Password do not match")
		}
		return true;
	}),

	// userMode Validation
	check('userMode')
	.trim()
	.notEmpty()
	.withMessage("Please select a user mode")
	.isIn(["Guest", "Admin"])
	.withMessage("Invalid user mode selection"),

	// terms validation.
	check('terms')
	.notEmpty()
	.withMessage("You must accept the term policy and continue")
	.equals("on")
    .withMessage("You must agree to the terms and conditions"),
	
	(req, res, next) => {
		const {firstName, lastName, email, password, userMode} = req.body;
		const error = validationResult(req);

		if(!error.isEmpty()){
			return res.status(422).render('auth/signup', {
				PageTitle: "Signup",
				currentPage: "Signup",
				isLoggedIn: false,
				error: error.array().map(err => err.msg),
				oldInput: {firstName, lastName, email, userMode},
				user: {}
			});
		}

		bcrypt.hash(password, 12).then(hashedPassword => {
			const user = new User({firstName, lastName, email, password: hashedPassword, userMode});
			return user.save();
		})
		.then(() => {
			console.log("User created and saved in mongodb");
			res.redirect('/login');
		}).catch(err => {
			return res.status(422).render('auth/signup', {
				PageTitle: "Signup",
				currentPage: "Signup",
				isLoggedIn: false,
				error: [err.message],
				oldInput: {firstName, lastName, email, userMode},
				user: {}
			})
		})
	},
]