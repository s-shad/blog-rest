const jwt = require("jsonwebtoken");

exports.authenticated = (req, res, next) => {
	try {
		const authHeadr = req.get("Authorization");
		if (!authHeadr) {
			const error = new Error("مجوز کافی ندارید");
			error.satausCode = 401;
			throw error;
		}
		const token = authHeadr.split(" ")[1];
		const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!tokenDecoded) {
			const error = new Error("مجوز کافی ندارید");
			error.satausCode = 401;
			throw error;
		}
		req.userId = tokenDecoded.userId;
		next();
	} catch (err) {
		next(err);
	}
};
