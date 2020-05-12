var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

router.get("/:params", async function (req, res, next) {
  try {
    const response = await fetch("https://steamspy.com/api.php?request=" + req.params.params);
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
