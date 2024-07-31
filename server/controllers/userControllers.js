const Users = require("../schema/users");

const InternalServerError = require("../errors/interServerError");

exports.userEmailCheck = async (req, res, next) => {
  try {
    const email = req.params.email;
    const userCheck = await Users.findOne({ email: email });
    if (userCheck)
      return res
        .status(200)
        .send({ ok: false, message: "Email already exists" });

    res.status(200).send({ ok: true, message: "Email is available" });
  } catch (error) {
    console.error("Error in userEmailCheck: ", error);
    next(new InternalServerError());
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName, resumeURL } = req.body;
    const newUser = new Users({
      email,
      firstName,
      lastName,
      resumeURL,
    });
    await newUser.save();
    res.status(200).send({ ok: true, message: "User created" });
  } catch (error) {
    console.error("Error in createUser: ", error);
    next(new InternalServerError());
  }
};
