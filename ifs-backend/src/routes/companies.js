var express = require("express");
var router = express.Router();

const {
  getCompaniesList,
  createCompanies,
} = require("../controllers/companyController");

router.post("/", createCompanies);
router.get("/", getCompaniesList);

module.exports = router;
