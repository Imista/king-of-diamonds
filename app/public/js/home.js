const socket = io();
// let id = "";
const voteButton = document.querySelector("#vote");

socket.on("connect", () => {
    // id = socket.id;
    //Vote
    voteButton.addEventListener("click", () => {
        const voteInput = document.querySelector("#vote-input");

        socket.emit("vote", {
            id: socket.id,
            vote: parseInt(voteInput.value),
        });

        voteInput.value = "";
    });
});
