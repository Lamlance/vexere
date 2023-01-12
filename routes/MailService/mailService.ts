// const { appendFile } = require("fs");
// const nodeMailer = require("nodemailer");
// require("dotenv/config");

// let PORT = process.env.PORT || 8080;

// let transporter = nodeMailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "hanhu2325@gmail.com",
//     pass: "abcyxz",
//   },
//   tls: {
//     rejectUnauthorized: false;
//   }
// });

// let mailOptions = {
//   from: "hanhu2325@gmail.com",
//   to: "phuhanld@gmail.com",
//   subject: "XIN CHAO ANH PHU DEP TRAI",
//   text: "ANH PHU DEP TRAI DA TEST MAIL THANH CONG"
// };

// transporter.sendMail(mailOptions, function(err, success) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log("Sent successfully!");
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Hello");
// })

// "use strict";
// const nodemailer = require("nodemailer");

// async function main() {
//   let hostname = "hostname from account page";
//   let username = "username from account page";
//   let password = "password from account page";

//   let transporter = nodemailer.createTransport({
//     host: hostname,
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//       user: username,
//       pass: password,
//     },
//     logger: true,
//   });
//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Group09 VEXERE" <hanphu2325@gmail.com>',
//     to: "phuhanld@gmail.com",
//     subject: "Hello from node",
//     text: "Hello world?",
//     html: "<strong>Hello world?</strong>",
//     headers: { "x-cloudmta-class": "standard" },
//   });

//   console.log("Message sent: %s", info.response);
// }

// main().catch(console.error);
