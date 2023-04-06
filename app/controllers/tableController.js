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
    const table = tables[tableCode];

    console.log(id, " has voted.");
    table.vote(id, vote);
    if (table.everyVoted()) {
        const winVote = getWinVote(table.votes());
        console.log(table.results(winVote));
    }
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

module.exports = { createTableEvent, connectTableEvent, voteEvent };
