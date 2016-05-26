var app, dist, express, http, path, server;
express = require("express");
http = require('http');
path = require("path");
dist = path.join(__dirname, '/../../dist');
app = express();
app.use(express["static"](dist));
app.set("port", process.env.PORT);

app.use(function(req, res, next) {
    var err;
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    return res.send({
        message: err.message
    });
});

server = http.createServer(app);

server.listen(app.get("port"), function() {
    return console.log("Express server listening on port " + server.address().port);
});
