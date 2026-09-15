exports.pageNotFound = (req, res, next) => {
	res.status(404)
	.render("404", {
		PageTitle: "404 - Error",
		currentPage: "404",
		isLoggedIn: req.session.isLoggedIn,
		user: req.session.user
	});
};
