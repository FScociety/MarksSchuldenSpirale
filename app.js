// Imports
const { json } = require("express");
const express = require("express")
const app = express()
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = 3000
const fs = require("fs");

zins = 0.001;
money = 0.8;

//Load the cache/cache.json file, so the money will be saved, even if theres a crash or a restart
fs.readFile("cache/cache.json", "utf-8", (err, jsonString) => {
    if (err) {
        console.log(err)
    } else {
        try {
            const data = JSON.parse(jsonString);
            zins = data.zins;
            money = data.money;
        } catch(err) {
            console.log(err);
        }
    }
});

//Use the public folder for file transfer
app.use(express.static("public"))
//app.use("/css", express.static(__dirname + "public/css"))

//Send the main html file
app.get("", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})

//Schedule a Zins update Timer
const schedule = require("node-schedule")
schedule.scheduleJob("zins-job", "*/1 * * * * *", () => {
    money += money * zins;
    //Send Zins and Money to the client
    io.sockets.emit("zins", {zins : money * zins});
    io.sockets.emit("money", {money : money});

    //Save the current Zins and Money to a .JSON file in cache/
    const newJson = {money : money, zins : zins};
    const jsonString = JSON.stringify(newJson);

    fs.writeFile("cache/cache.json", jsonString, err => {
        if (err) {
            console.log(err);
        }
    })
    //schedule.cancelJob("zins-job");
})

server.listen(port);
