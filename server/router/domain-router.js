const express = require("express");
const router = express.Router();
const domaincontrollers = require("../controllers/domain-controller.js");


router.route("/getdomaindetails/:id").get(domaincontrollers.getdomaindetails);

module.exports = router;