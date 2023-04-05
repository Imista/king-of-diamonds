const { playerController } = require("./playerController");

function tableController(httpServer) {
    const { Server } = require("socket.io");
    const io = new Server(httpServer);
    const players = playerController();
    const tables = [];

    io.on("connection", (socket) => {
        //Create table
        socket.on("create_table", (id) => {
            const code = Math.floor(Math.random() * Date.now())
                .toString(16)
                .slice(0, 5);

            players.add(id);

            tables.push(code);
            socket.join(code);

            io.to(socket.id).emit("connected_table", code);
        });

        //Connect table
        socket.on("connect_table", ({ id, code }) => {
            if (tables.indexOf(code) < 0)
                io.to(socket.id).emit(
                    "error_table",
                    `The table with code ${code} does not exist.`
                );
            else {
                players.add(id);
                socket.join(code);
                io.to(code).emit("new_player", players.data());
            }
        });

        socket.on("vote", ({ id, vote }) => {
            console.log(id, " has voted.");
            players.vote(id, vote);
            console.log(players.data());
        });
    });
}

module.exports = { tableController };
