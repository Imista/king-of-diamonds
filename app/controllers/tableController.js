const { playerController } = require("./playerController");

function tableController(httpServer) {
    const { Server } = require("socket.io");
    const io = new Server(httpServer);
    const tables = {};

    io.on("connection", (socket) => {
        //Create table
        socket.on("create_table", (id) => {
            const code = Math.floor(Math.random() * Date.now())
                .toString(16)
                .slice(0, 5);

            tables[code] = playerController();
            tables[code].add(id);
            socket.join(code);

            io.to(socket.id).emit("connected_table", code);
        });

        //Connect table
        socket.on("connect_table", ({ id, code }) => {
            if (Object.keys(tables).indexOf(code) < 0)
                io.to(socket.id).emit(
                    "error_table",
                    `The table with code ${code} does not exist.`
                );
            else {
                tables[code].add(id);
                socket.join(code);

                io.to(socket.id).emit("connected_table", code);
                io.to(code).emit("new_player", tables[code].data());
            }
        });

        socket.on("vote", ({ id, table: code, vote }) => {
            console.log(id, " has voted.");
            tables[code].vote(id, vote);
            console.log(tables[code].data());
        });
    });
}

module.exports = { tableController };
