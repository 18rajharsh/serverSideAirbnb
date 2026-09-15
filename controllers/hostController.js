
const Home = require("../models/home");


exports.getAddHome = (req, res, next) => {
	res.render("host/edit-homes", { PageTitle: "add-Home", currentPage: 'Add Home', editing: false, isLoggedIn: req.session.isLoggedIn,
	user: req.session.user});
};

exports.getHostHomes =  (req, res, next) => {
	Home.find().then(registeredHomes => {
		res.render('host/host-home-list', {registeredHomes : registeredHomes, PageTitle: 'Host Home-List', currentPage: 'host-homes', isLoggedIn: req.session.isLoggedIn,
		user: req.session.user});
	});
};

exports.postAddHome = (req, res, next) => {
	const {houseName, price, location, rating, photourl, description} = req.body;
	const home = new Home({houseName, price, location, rating, photourl, description});
	home.save().then(() => {
		console.log("Home Added successfully");
	});

	res.redirect("/host/host-home-list");
};

exports.getEditHomes = (req, res, next) => {
	const homeId = req.params.homeId;
	const editing = req.query.editing === 'true';

	Home.findById(homeId).then(home => {
		if(!home){
			console.log("Home not found!");
			return res.redirect("/host/host-home-list");
		}

		console.log(homeId, editing, home);
		res.render("host/edit-homes",{
			home: home,
			PageTitle: "Edit your homes",
			currentPage: 'host-homes',
			editing: editing,
			isLoggedIn: req.session.isLoggedIn,
			user: req.session.user
		});
	});
};


exports.postEditHome = (req, res, next) => {
	const {houseName, price, location, rating, photourl, description} = req.body;
	const homeId = req.params.homeId;

	Home.findById(homeId).then(home => {
		home.houseName = houseName,
		home.price = price,
		home.location = location,
		home.rating = rating,
		home.photourl = photourl,
		home.description = description,
		home.save().then(result => {
			console.log("Home Updated ", result);
		}).catch(err => {
			console.log("Error while editing home", err);
		})
		res.redirect("/host/host-home-list");
	}).catch(err => {
		console.log("Error while finding home ", err);
	})

};

exports.postDeleteHome = (req, res, next) => {
	const homeId = req.params.homeId;
	// console.log("Came to delete ", homeId);
	Home.findByIdAndDelete(homeId).then(() => {
		console.log("Deleted successfully", homeId);
		res.redirect('/host/host-home-list');
	}).catch(error => {
		console.log("Error while deleting!", error);
	})
}