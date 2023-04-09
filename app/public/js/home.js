const socket = io();
const stateText = document.querySelector("#state");
const createTableButton = document.querySelector("#create-table");
const joinTableButton = document.querySelector("#join-table");
const startTableButton = document.querySelector("#start-table");
const tableInput = document.querySelector("#table-input");
const voteButton = document.querySelector("#vote");
const voteInput = document.querySelector("#vote-input");
const playersArea = document.querySelector(".players-area");

const playerData = {
    id: Math.floor(Math.random() * Date.now()).toString(16),
};

//Functions
const disableVote = () => {
    voteButton.disabled = true;
    voteInput.disabled = true;
};
const enableVote = () => {
    voteButton.disabled = false;
    voteInput.disabled = false;
};
const disableTable = () => {
    tableInput.disabled = true;
    joinTableButton.disabled = true;
    createTableButton.disabled = true;
    startTableButton.disabled = true;
};
const enableTable = () => {
    tableInput.disabled = false;
    joinTableButton.disabled = false;
    createTableButton.disabled = false;
};

//Client events
createTableButton.addEventListener("click", () => {
    socket.emit("create_table", playerData.id);
});

joinTableButton.addEventListener("click", () => {
    socket.emit("connect_table", {
        id: playerData.id,
        tableCode: tableInput.value,
    });
});

voteButton.addEventListener("click", () => {
    const vote = parseInt(voteInput.value);
    socket.emit("vote", {
        ...playerData,
        vote,
    });

    voteInput.value = "";
    disableVote();
});

startTableButton.addEventListener("click", () => {
    console.log("A");
    socket.emit("start_table", playerData.tableCode);
});

//Server events
function connectedTableEvent({ tableCode, playersData }) {
    stateText.textContent = `connected to ${tableCode}`;
    playerData.tableCode = tableCode;

    tableInput.value = "";
    disableTable();
    startTableButton.disabled = false;

    for (const { name } of playersData) {
        newPlayer(name);
    }
}

function newPlayer(name, text = "-", classes = []) {
    const player = document.createRange().createContextualFragment(`
    <div class="player ${classes.join(" ")}"}">
        <div class="player-img-container">
            <img src="https://robohash.org/${name}.png" alt="" class="player-img">
        </div>
        <div class="player-data-container">
            <p class="player-data">${text}</p>
        </div>
    </div>

    `);
    playersArea.append(player);
}

socket.on("connected_table", (data) => {
    connectedTableEvent(data);
});

socket.on("new_player", ({ name }) => {
    newPlayer(name);
});
socket.on("error_table", (msg) => {
    alert(msg);
});

socket.on("start_table", () => {
    enableVote();
    disableTable();
});

socket.on("results", (winners) => {
    playersArea.innerHTML = "";
    winners.forEach(({ name, vote }) => {
        newPlayer(name, vote, ["winner"]);
    });
    // losers.forEach(({ name, vote }) => {
    //     newPlayer(name, vote);
    // });
});

socket.on("lives", (playersData) => {
    playersArea.innerHTML = "";
    for (const { name, lives } of playersData) {
        newPlayer(name, lives, ["lives"]);
    }
});
