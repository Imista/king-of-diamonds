const socket = io();
const stateText = document.querySelector("#state");
const createTableButton = document.querySelector("#create-table");
const joinTableButton = document.querySelector("#join-table");
const startTableButton = document.querySelector("#start-table");
const tableInput = document.querySelector("#table-input");
const voteButton = document.querySelector("#vote");
const voteInput = document.querySelector("#vote-input");
const playersArea = document.querySelector(".players-area");
const multiplicationArea = document.querySelector(".multiplication-area");
const averageSpan = document.querySelector("#average");
const resultSpan = document.querySelector("#result");

const playerData = {
    id: Math.floor(Math.random() * Date.now()).toString(16),
    isAlive: true,
};

//Functions
const disableVote = () => {
    voteButton.disabled = true;
    voteInput.disabled = true;
};
const enableVote = () => {
    if (playerData.isAlive) {
        voteButton.disabled = false;
        voteInput.disabled = false;
    }
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

const enableMultiplication = (average) => {
    multiplicationArea.classList.remove("off");
    averageSpan.innerHTML = average.toFixed(1);
    resultSpan.innerHTML = (average * 0.8).toFixed(1);
};

const disableMultiplication = () => {
    multiplicationArea.classList.add("off");
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
    socket.emit("start_table", playerData.tableCode);
});

//Server events
function connectedTableEvent({ tableCode, playersData }) {
    stateText.innerHTML = `connected to <span id="code">${tableCode}</span>`;

    const code = document.getElementById("code");

    code.addEventListener("click", () => {
        navigator.clipboard
            .writeText(code.innerText)
            .then(() => alert("Text copied to clipboard!"));
    });

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
    <div class="player ${classes.join(" ")} ${
        name == playerData.id && "main"
    }"}">
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

socket.on("results", ({ average, results }) => {
    playersArea.innerHTML = "";
    results.forEach(({ name, vote }) => {
        newPlayer(name, vote, ["winner"]);
    });
    enableMultiplication(average);
});

socket.on("lives", (playersData) => {
    playersArea.innerHTML = "";
    for (const { name, lives } of playersData) {
        newPlayer(name, lives, ["lives"]);
    }
    disableMultiplication();
});

socket.on("next_round", (playersData) => {
    playersArea.innerHTML = "";
    enableVote();
    for (const { name } of playersData) {
        newPlayer(name);
    }
});

socket.on("excute", (player_id) => {
    if (player_id == playerData.id) {
        playerData.isAlive = false;
        alert("You died.");
        disableVote();
    }
});

socket.on("end_game", (playersData) => {
    const { name, lives } = playersData[0];
    playersArea.innerHTML = "";
    newPlayer(name, lives, ["winner"]);
});
