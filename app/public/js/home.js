const socket = io();
const id = Math.floor(Math.random() * Date.now()).toString(16);

const stateText = document.querySelector("#state");
const createTableButton = document.querySelector("#create-table");
const joinTableButton = document.querySelector("#join-table");
const tableInput = document.querySelector("#table-input");

//Create
createTableButton.addEventListener("click", () => {
    socket.emit("create_table", id);
});

socket.on("connected_table", (table) => {
    stateText.textContent = `connected to ${table}`;
    console.log(table);
    //Disable
    tableInput.value = "";
    tableInput.disabled = true;
    joinTableButton.disabled = true;
    createTableButton.disabled = true;
});

joinTableButton.addEventListener("click", () => {
    const code = tableInput.value;
    socket.emit("connect_table", { id, code });
    stateText.textContent = `connected to ${code}`;

    //Disable
    tableInput.value = "";
    tableInput.disabled = true;
    joinTableButton.disabled = true;
    createTableButton.disabled = true;
});

//New player
socket.on("new_player", (data) => {
    console.log(data);
});
socket.on("error_table", (msg) => {
    alert(msg);
});

//Vote
const voteButton = document.querySelector("#vote");

voteButton.addEventListener("click", () => {
    const voteInput = document.querySelector("#vote-input");

    socket.emit("vote", {
        id,
        vote: parseInt(voteInput.value),
    });

    voteInput.value = "";
});
