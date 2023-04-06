const { playerController } = require("./playerController");

function createTableEvent({ tables, socket, id }) {
    const tableCode = Math.floor(Math.random() * Date.now())
        .toString(16)
        .slice(0, 5);

    tables[tableCode] = playerController();
    tables[tableCode].add(id);

    socket.join(tableCode);
    socket.emit("connected_table", tableCode);
}

function connectTableEvent({ tables, socket, id, tableCode }) {
    if (tables.hasOwnProperty(tableCode)) {
        tables[tableCode].add(id);

        socket.join(tableCode);
        socket.emit("connected_table", tableCode);
        socket.to(tableCode).emit("new_player", tables[tableCode].data());
    } else {
        socket.emit(
            "error_table",
            `The table with tableCode ${tableCode} does not exist.`
        );
    }
}

function voteEvent({ id, tables, tableCode, vote }) {
    console.log(id, " has voted.");
    tables[tableCode].vote(id, vote);
    console.log(tables[tableCode].data());
}

module.exports = { createTableEvent, connectTableEvent, voteEvent };
