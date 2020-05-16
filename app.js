const express = require("express");
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var apiRouter = require("./routes/api");
const fetch = require("node-fetch");
var mcache = require("memory-cache");

var app = express();

var cache = (duration) => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "/client/build")));

// view engine setup

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(cache(604800));

app.use("/api", apiRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 8000;
app.listen(port);

// setInterval(async () => {
//   try {
//     const response = await fetch("https://steamspy.com/api.php?request=top100in2weeks");
//     if (!response.ok) {
//       throw response;
//     }
//     const data = await response.json();
//     for (let i = 0; i < Object.keys(data)){}
//   } catch (err) {
//     console.log(err);
//   }
// }, 2000);
