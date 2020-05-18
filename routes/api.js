var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

router.get("/steam/ccu", async function (req, res, next) {
  try {
    const response = await fetch("https://store.steampowered.com/stats/userdata.json");
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get("/text/:params", async function (req, res, next) {
  try {
    const response = await fetch("https://steamspy.com/api.php?request=" + req.params.params);
    if (!response.ok) {
      throw response;
    }
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.json("Connection failed: Too many connections");
  }
});

router.get("/wait", async function (req, res, next) {
  res.send("");
});

router.get("/:params", async function (req, res, next) {
  try {
    const response = await fetch("https://steamspy.com/api.php?request=" + req.params.params);
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json("Connection failed: Too many connections");
  }
});

module.exports = router;
