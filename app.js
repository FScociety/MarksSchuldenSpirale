// Imports
const express = require("express")
const app = express()
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = 3000

zins = 0.001;
money = 0.8;

//Static Files
app.use(express.static("public"))
//app.use("/css", express.static(__dirname + "public/css"))

app.get("", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})


const schedule = require("node-schedule")
schedule.scheduleJob("zins-job", "*/1 * * * * *", () => {
    money += money * zins;
    io.sockets.emit("zins", {zins : money * zins});
    io.sockets.emit("money", {money : money});
    //schedule.cancelJob("zins-job");
})

server.listen(port);
