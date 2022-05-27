const router = require("express").Router();

// Controller
const { signUp, signIn, getUsers, getMe } = require("./user.controller");

// Utils
const ERRORS = require("../../lib/errors");
const { jwtTokenPayload } = require("../../lib/jwt");
const { isAuthorized } = require("../../middlewares");
const { WEB_SERVER } = require("../../lib/configs");

// Validation
const validate = require("../../lib/validation");
const signinSchema = require("../../lib/validation/schemas/signin");
const signupSchema = require("../../lib/validation/schemas/signup");

// GET ../v1/users/
router.get("/", isAuthorized, async (req, res, next) => {
  try {
    const result = await getUsers();
    const { _id } = await jwtTokenPayload(req.cookies.token);

    return res.status(200).json({ requester: _id, users: result });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/users/
router.get("/me", isAuthorized, async (req, res, next) => {
  try {
    const { _id } = await jwtTokenPayload(req.cookies.token);
    const me = await getMe(_id);

    return res.status(200).json(me);
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/users/signin
router.post("/signin", async (req, res, next) => {
  try {
    // Validate
    await validate(req.body, signinSchema);

    const { username, token } = await signIn(req.body);
    return res
      .status(200)
      .cookie("token", token, {
        secure: WEB_SERVER.ENV === "production" ? true : false,
        httpOnly: WEB_SERVER.ENV === "production" ? true : false,
        sameSite: "none", //on production
        maxAge: 1000 * 60 * 60 * 24 * 14, // Two Weeks
      })
      .json({ username });
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/users/signup
router.post("/signup", async (req, res, next) => {
  try {
    // Validate
    await validate(req.body, signupSchema);

    const { username, token } = await signUp(req.body);

    return res
      .status(201)
      .cookie("token", token, {
        secure: WEB_SERVER.ENV === "production" ? true : false,
        httpOnly: WEB_SERVER.ENV === "production" ? true : false,
        sameSite: "none", //on production
        maxAge: 1000 * 60 * 60 * 24 * 14, // Two Weeks
      })
      .json({ username });
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/users/signup
router.get("/signout", async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json({ status: 1, message: "Successfully signed out." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
