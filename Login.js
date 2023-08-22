const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Users = require("./Schema/UserSchema");
const expiresIn = "2h";
var bcrypt = require("bcryptjs");

//Create operation to create a new user with first name, last name, age and course
router.post("/signup", async (req, res) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.Password, salt);
  const newUser = {
    Username: req.body.Username,
    Password: hash,
  };

  const user = new Users(newUser);

  const userAdded = await user.save();

  if (userAdded) {
    console.log(userAdded);
    console.log("New user added successfully");
  }
});

const getDecodedOAuthJwtGoogle = async (token) => {
  const CLIENT_ID_GOOGLE =
    "389088782021-n86h8rplmrhivt5kc70rf14q0mn92c60.apps.googleusercontent.comyourGoogleClientId";

  try {
    const client = new OAuth2Client(CLIENT_ID_GOOGLE);

    const ticket = await client.verifyIdToken({
      idToken: token,
    });

    return ticket;
  } catch (error) {
    return { status: 500, data: error };
  }
};
//Read operation
// router.post("/getusers", async (req, res) => {
//   const users = await Users.find({});

//   if (users) {
//     console.log(users);
//   }

//   const user = await Users.findOne({ Username: req.body.username });

//   if (user) {
//     console.log("single user " + user);
//   }
// });

router.post("/loginapi", async (req, res) => {
  //   console.log(req.body);

  // const username = req.body.username;
  // const password = req.body.password;
  const { username, password } = req.body;

  //req.body.usrername = "test1user"

  const userExist = await Users.findOne({ Username: username });

  if (userExist) {
    // const passMatched = bcrypt.compareSync(password, userExist.Password);
    if (userExist.Password === password) {
      // if (passMatched) {
      const userDetails = { uid: userExist._id };
      const token = jwt.sign(userDetails, "mysecretkey", { expiresIn });
      res.status(200).send({ token: token });
    } else {
      res.status(403).send({ msg: "Username or password is incorrect" });
    }
  } else {
    res.status(401).send({ msg: "User is not registered" });
  }

  // if (username == data.user.username) {
  //   if (password == data.user.password) {
  //     const userDetails = data.userData;
  //     const token = jwt.sign(userDetails, "mysecretkey");
  //     console.log(token);
  //     res.status(200).send({ token: token });
  //   } else {
  //     res.status(403).send({ msg: "Username or password is incorrect" });
  //   }
  // } else {
  //   res.status(401).send({ msg: "User is not registered" });
  // }
});

router.post("/oauth", async (req, res) => {
  const tokenInfo = await getDecodedOAuthJwtGoogle(req.body.token);

  // take a look at the scopes originally provisioned for the access token
  const useremail = JSON.parse(JSON.stringify(tokenInfo)).payload.email;

  const alreadyExists = await Users.findOne({ Username: useremail });

  if (alreadyExists) {
    const userDetails = { uid: alreadyExists._id };
    const jwttoken = jwt.sign(userDetails, "mysecretkey", { expiresIn });
    res.status(200).send({ msg: "Already verified user", token: jwttoken });
  } else {
    const newuser = {
      Username: useremail,
      Password: "googlepass",
    };

    const thirdpartypuser = new Users(newuser);

    const thirdpartyuseradded = await thirdpartypuser.save();

    if (thirdpartyuseradded) {
      const userDetails = { uid: thirdpartyuseradded._id };
      const jwttoken = jwt.sign(userDetails, "mysecretkey", { expiresIn });
      res.status(200).send({ msg: "oauth successfull", token: jwttoken });
    }
  }
});
// //200 OK
// //401 Unauthorised
// //403 Forbidden
// //500 Internal server error

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   host: "smtp.gmail.com",
//   auth: {
//     user: "kshitizagarwal27@gmail.com ",
//     pass: "",
//   },
// });

// const mailHtml =
//   "<h1>Welcome to Letsupgrade</h1><ul><li>full stack</li><li>Data science</li></ul><img src='https://w7.pngwing.com/pngs/452/24/png-transparent-js-logo-node-logos-and-brands-icon.png' />";

// router.post("/forgotpassword", async (req, res) => {
//   const info = await transporter.sendMail({
//     from: "kshitizagarwal27@gmail.com", // sender address
//     to: "kshitizagarwal27@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: mailHtml, // html body
//   });
// });
module.exports = router;
