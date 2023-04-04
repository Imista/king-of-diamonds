const { Player } = require("../models/playerModel");

function playerController() {
    const players = {};

    function addPlayer(id) {
        players[id] = new Player();
    }

    function playerVote(id, vote) {
        players[id].vote = vote;
    }

    function playerDamage(id, damage) {
        players[id].damage = damage;
    }

    function alivePlayer() {
        return Object.values(players).filter(({ lives }) => lives).length;
    }

    return { addPlayer, alivePlayer, playerVote, playerDamage };
}

module.exports = { playerController };
