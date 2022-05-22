const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");

exports.handleLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });

		if (!user) {
			const error = new Error("کاربری با این ایمیل یافت نشد");
			error.statusCode = 404;
			throw error;
		}
		const isEqual = await bcrypt.compare(password, user.password);

		if (isEqual) {
			const token = jwt.sign(
				{
					user: {
						userId: user._id.toString(),
						email: user.email,
						fullname: user.fullname,
					},
				},
				process.env.JWT_SECRET
			);
			res.status(200).json({ token, userId: user._id.toString() });
		} else {
			const error = new Error("ایمیل یا نام کاربری اشتباه است");
			error.statusCode = 422;
			throw error;
		}
	} catch (err) {
		next(err);
	}
};

exports.rememberMe = (req, res) => {
	if (req.body.remember) {
		req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // 1 day 24
	} else {
		req.session.cookie.expire = null;
	}

	res.redirect("/dashboard");
};

exports.logout = (req, res) => {
	req.session = null;
	req.logout();
	res.redirect("/users/login");
};

exports.createUser = async (req, res, next) => {
	try {
		await User.userValidation(req.body);
		const { fullname, email, password } = req.body;
		const user = await User.findOne({ email });

		if (user) {
			const error = new Error("کاربری با این ایمیل وجود است");
			error.statusCode = 422;
			throw error;
		} else {
			await User.create({ fullname, email, password });

			//? Send Welcome Email
			sendEmail(
				email,
				fullname,
				"خوش آمدی به وبلاگ ما",
				"خیلی خوشحالیم که به جمع ما وبلاگرهای خفن ملحق شدی"
			);
			res.status(201).json("عضویت موفقیت آمیز بود");
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.handleForgetPassword = async (req, res, next) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			const error = new Error("کاربری با ایمیل در پایگاه داده ثبت نیست");
			error.statusCode = 404;
			throw error;
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		const resetLink = `http://localhost:3000/users/reset-password/${token}`;

		sendEmail(
			user.email,
			user.fullname,
			"فراموشی رمز عبور",
			`
        جهت تغییر رمز عبور فعلی رو لینک زیر کلیک کنید
        <a href="${resetLink}">لینک تغییر رمز عبور</a>
    `
		);
		res.status(201).json({ message: "ایمیل حاوی لینک تغییر رمز برای شما ارسال شد" });
	} catch (err) {
		next(err);
	}
};

exports.resetPassword = async (req, res, next) => {
	const token = req.params.token;
	const { password, confirmPassword } = req.body;

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ _id: decodedToken.userId });
		if (password !== confirmPassword) {
			const error = new Error("پسورد و تکرار پسود درست نمی باشد");
			error.statusCode = 421;
			throw error;
		} else {
			user.password = password;
			await user.save();
			res.status(201).json({ message: "با موفقیت انجام شد" });
		}
	} catch (err) {
		next(err);
	}
};
