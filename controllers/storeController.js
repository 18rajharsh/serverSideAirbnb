const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
	console.log(req.session, req.session.isLoggedIn, req.session.user);
	Home.find().then((registeredHomes) => {
		res.render("store/index", {
			registeredHomes: registeredHomes,
			PageTitle: "Index",
			currentPage: "Index",
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user,
		});
	});
};

exports.getHome = (req, res, next) => {
	Home.find().then((registeredHomes) => {
		res.render("store/home-list", {
			registeredHomes: registeredHomes,
			PageTitle: "Home",
			currentPage: "Home",
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user,
		});
	});
};

exports.getBookings = (req, res, next) => {
	Home.find().then((registeredHomes) => {
		res.render("store/bookings", {
			registeredHomes: registeredHomes,
			PageTitle: "Bookings",
			currentPage: "Bookings",
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user,
		});
	});
};

exports.getHomeList = (req, res, next) => {
	Home.find().then((registeredHomes) => {
		res.render("store/home-list", {
			registeredHomes: registeredHomes,
			PageTitle: "HomeList",
			currentPage: "HomeList",
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user,
		});
	});
};

exports.getHomeId = (req, res, next) => {
	const homeId = req.params.homeId;
	Home.findById(homeId).then((home) => {
		if (!home) {
			res.redirect("/homes");
		} else {
			res.render("store/home-detail", {
				home: home,
				PageTitle: "Home-Detail",
				currentPage: "Home",
				isLoggedIn: req.session.isLoggedIn,
				user: req.session.user,
			});
		}
	});
};

exports.getFavouriteList = async (req, res, next) => {
	const userId = req.session.user._id;
	const user = await User.findById(userId).populate("favourites");
	res.render("store/favourite-list", {
		favouriteHomes: user.favourites,
		PageTitle: "My Favourites",
		currentPage: "favourites",
		isLoggedIn: req.session.isLoggedIn,
		user: req.session.user,
	});
};

exports.postAddToFavourite = async (req, res, next) => {
	const homeId = req.body.homeId;
	const userId = req.session.user._id;
	const user = await User.findById(userId);

	if (!user.favourites.includes(homeId)) {
		user.favourites.push(homeId);
		user.save();
	}
	res.redirect("/favourites");
};

exports.deleteFavourite = async (req, res, next) => {
	const homeId = req.params.homeId;
	const userId = req.session.user._id;
	const user = await User.findById(userId);

	if (user.favourites.includes(homeId)) {
		user.favourites = user.favourites.filter((fav) => fav != homeId);
		await user.save();
	}
	res.redirect("/favourites");
};
