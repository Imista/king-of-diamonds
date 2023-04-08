const { playerController } = require("./playerController");

const MINIMUM_PLAYERS = 2;

function createTableEvent({ tables, socket, id }) {
    const tableCode = Math.floor(Math.random() * Date.now())
        .toString(16)
        .slice(0, 5);
    const table = playerController();
    table.add(id);
    tables[tableCode] = table;
    socket.join(tableCode);
    socket.emit("connected_table", {
        tableCode,
        playersData: table.data(),
    });
}

function connectTableEvent({ tables, socket, id, tableCode }) {
    if (tables.hasOwnProperty(tableCode)) {
        const table = tables[tableCode];
        table.add(id);
        socket.to(tableCode).emit("new_player", table.data(id));
        socket.join(tableCode);
        socket.emit("connected_table", {
            tableCode,
            playersData: table.data(),
        });
    } else {
        sendErrorMessage(
            socket,
            `The table with code ${tableCode} does not exist.`
        );
    }
}

function startTableEvent({ io, tables, socket, tableCode }) {
    if (tables[tableCode].alives() >= MINIMUM_PLAYERS) {
        io.to(tableCode).emit("start_table");
    } else
        sendErrorMessage(socket, `The table needs minimun 5 players to start.`);
}

function voteEvent({ io, id, tables, tableCode, vote }) {
    const table = tables[tableCode];
    table.vote(id, vote);
    if (table.everyVoted()) {
        const winVote = getWinVote(table.votes());
        const results = table.results(winVote);
        io.to(tableCode).emit("results", results);
    }
}

function sendErrorMessage(socket, message) {
    socket.emit("error_table", message);
}

function getWinVote(votes) {
    const winNumber = Math.round(
        (votes.reduce((sum, vote) => (sum += vote)) / votes.length) * 0.8
    );
    const closestVote = votes.reduce((closest, vote) =>
        Math.abs(vote - winNumber) < Math.abs(closest - winNumber)
            ? vote
            : closest
    );
    return closestVote;
}

module.exports = {
    createTableEvent,
    connectTableEvent,
    startTableEvent,
    voteEvent,
};
