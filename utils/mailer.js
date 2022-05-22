const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
	host: "mail.sokhanesabz.com",
	port: 465,
	secure: true,
	auth: {
		user: "saeid@sokhanesabz.com",
		pass: "saeid123698741",
	},
	tls: {
		rejectUnauthorized: false,
	},
});

exports.sendEmail = (email, fullname, subject, message) => {
	const transporter = nodeMailer.createTransport(transporterDetails);
	transporter.sendMail({
		from: "toplearn@ghorbany.dev",
		to: email,
		subject: subject,
		html: `<h1> سلام ${fullname}</h1>
            <p>${message}</p>`,
	});
};
