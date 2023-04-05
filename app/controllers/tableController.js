const { playerController } = require("./playerController");

function tableController(httpServer) {
    const { Server } = require("socket.io");
    const io = new Server(httpServer);
    const players = playerController();

    io.on("connection", (socket) => {
        console.log("Hello:\n", socket.id);

        players.add(socket.id);

        console.log(players.data());

        socket.on("vote", ({ id, vote }) => {
            console.log(id, " has voted.");
            players.vote(id, vote);
            console.log(players.data());
        });
    });
}

module.exports = { tableController };
