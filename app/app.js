const express = require("express");
const path = require("path");
const { router } = require("./routes");
const { createServer } = require("http");
const { server } = require("./server");

const app = express();
const httpServer = createServer(app);

//Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "public", "views"));
// app.use(cookieParser());

//Routes
app.use(router);

//Public
app.use(express.static(path.join(__dirname, "public")));

//Start server
httpServer.listen(app.get("port"), () => {
    console.log("Server running on:\t", app.get("port"));
});

//Call socket.io server
server(httpServer);
