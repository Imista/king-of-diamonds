const express = require("express");
const router = express.Router();
const path = require("path");

const views = path.join(__dirname, "/../public/views");

router.get("/", (req, res) => {
    res.sendFile(views + "/index.html");
});

module.exports = { router };
