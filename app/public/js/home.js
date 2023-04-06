const socket = io();
const stateText = document.querySelector("#state");
const createTableButton = document.querySelector("#create-table");
const joinTableButton = document.querySelector("#join-table");
const tableInput = document.querySelector("#table-input");
const voteButton = document.querySelector("#vote");
const voteInput = document.querySelector("#vote-input");

const playerData = {
    id: Math.floor(Math.random() * Date.now()).toString(16),
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
});

//Server events
function connectedTableEvent(tableCode) {
    stateText.textContent = `connected to ${tableCode}`;
    playerData.tableCode = tableCode;
    //Disable
    tableInput.value = "";
    tableInput.disabled = true;
    joinTableButton.disabled = true;
    createTableButton.disabled = true;

    voteButton.disabled = false;
    voteInput.disabled = false;
}

socket.on("connected_table", (tableCode) => {
    connectedTableEvent(tableCode);
});

socket.on("new_player", (playerData) => {
    console.log(playerData);
});
socket.on("error_table", (msg) => {
    alert(msg);
});
