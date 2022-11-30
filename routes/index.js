const express = require("express");
const router = express.Router();

const request = require("request"),
  cachedRequest = require("cached-request")(request),
  cacheDirectory = "./tmp/cache";

cachedRequest.setCacheDirectory(cacheDirectory);

router.get("/", function (req, res, body) {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.socket.remoteAddress;

  const options = {
    url: `https://ipapi.co/${ip}/json/`,
    ttl: 30000,
  };

  cachedRequest(options, function (error, response, body) {
    res.render("index", { data: body });
  });
});

module.exports = router;
