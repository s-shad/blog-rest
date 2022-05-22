exports.setHeaders = (req, res, next) => {
	res.set({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "DELETE,GET,PATCH,POST,PUT",
		"Access-Control-Allow-Headers": "Content-Type,Authorization",
	});
	next();
};
