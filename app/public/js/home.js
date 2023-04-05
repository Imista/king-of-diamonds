const socket = io();
const data = {
    id: Math.floor(Math.random() * Date.now()).toString(16),
};

const stateText = document.querySelector("#state");
const createTableButton = document.querySelector("#create-table");
const joinTableButton = document.querySelector("#join-table");
const tableInput = document.querySelector("#table-input");

const voteButton = document.querySelector("#vote");
const voteInput = document.querySelector("#vote-input");

//Connection
createTableButton.addEventListener("click", () => {
    socket.emit("create_table", data.id);
});

joinTableButton.addEventListener("click", () => {
    socket.emit("connect_table", { id: data.id, code: tableInput.value });
});

socket.on("connected_table", (table) => {
    stateText.textContent = `connected to ${table}`;
    data.table = table;
    //Disable
    tableInput.value = "";
    tableInput.disabled = true;
    joinTableButton.disabled = true;
    createTableButton.disabled = true;

    voteButton.disabled = false;
    voteInput.disabled = false;
});

//New player
socket.on("new_player", (data) => {
    console.log(data);
});
socket.on("error_table", (msg) => {
    alert(msg);
});

//Vote
voteButton.addEventListener("click", () => {
    socket.emit("vote", {
        ...data,
        vote: parseInt(voteInput.value),
    });

    voteInput.value = "";
});
