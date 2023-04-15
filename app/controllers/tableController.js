const { playerController } = require("./playerController");

const MINIMUM_PLAYERS = 2;
const PLAYING_TABLES = [];

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
    if (
        tables.hasOwnProperty(tableCode) &&
        PLAYING_TABLES.indexOf(tableCode) == -1
    ) {
        const table = tables[tableCode];
        table.add(id);
        socket.to(tableCode).emit("new_player", table.data(id));
        socket.join(tableCode);
        socket.emit("connected_table", {
            tableCode,
            playersData: table.data(),
        });
    } else {
        sendErrorMessage(socket, `We can't connect to ${tableCode} table.`);
    }
}

function startTableEvent({ io, tables, socket, tableCode }) {
    if (tables[tableCode].alives() >= MINIMUM_PLAYERS) {
        io.to(tableCode).emit("start_table");
        PLAYING_TABLES.push(tableCode);
    } else
        sendErrorMessage(
            socket,
            `The table needs minimun ${MINIMUM_PLAYERS} players to start.`
        );
}

function voteEvent({ io, id, tables, tableCode, vote }) {
    const table = tables[tableCode];
    table.vote(id, vote);
    if (table.everyVoted()) {
        const votes = table.votes();
        const average =
            votes.reduce((sum, vote) => (sum += vote)) / votes.length;
        const winVote = getWinVote(votes, average);
        const results = table.results(winVote);
        io.to(tableCode).emit("results", { average, results });
        setTimeout(() => {
            io.to(tableCode).emit("lives", table.data());
            setTimeout(() => {
                const players_executed = table.execute();
                for (const player_id of players_executed) {
                    io.to(tableCode).emit("excute", player_id);
                }
                table.restart();
                io.to(tableCode).emit("next_round", table.data());
            }, 5000);
        }, 7000);
    }
}

function sendErrorMessage(socket, message) {
    socket.emit("error_table", message);
}

function getWinVote(votes, average) {
    const winNumber = Math.round(average * 0.8);
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
