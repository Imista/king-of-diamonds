const {
    createTableEvent,
    connectTableEvent,
    voteEvent,
    startTableEvent,
} = require("./controllers/tableController");

function server(httpServer) {
    const { Server } = require("socket.io");
    const io = new Server(httpServer);
    const tables = {};

    io.on("connection", (socket) => {
        //Create table
        socket.on("create_table", (id) => {
            createTableEvent({ tables, socket, id });
        });

        //Connect table
        socket.on("connect_table", ({ id, tableCode }) => {
            connectTableEvent({ tables, socket, id, tableCode });
        });

        socket.on("start_table", (tableCode) => {
            startTableEvent({ tables, socket, tableCode });
        });

        socket.on("vote", ({ id, tableCode, vote }) => {
            voteEvent({ id, tables, tableCode, vote });
        });
    });
}

module.exports = { server };
