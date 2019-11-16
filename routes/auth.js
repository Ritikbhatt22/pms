var express = require('express');
var router = express.Router();
var controller = require("../controllers/auth")
var middleware = require("../middleware/middleware")

/* GET users listing. */

router.post('/login', controller.login)
router.post('/addUser', middleware.checkToken, controller.addUser)
router.post('/addExperience', middleware.checkToken, controller.addExperience)

// router.get("/",)
module.exports = router;
