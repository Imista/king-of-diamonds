const { Player } = require("../models/playerModel");

function playerController() {
    const players = {};

    function add(id) {
        players[id] = new Player();
    }

    function vote(id, vote) {
        players[id].vote = vote;
    }

    function damage(id, damage) {
        players[id].getDamage(damage);
    }

    function alives() {
        return Object.values(players).filter(({ lives }) => lives).length;
    }

    function data() {
        return Object.values(players).map((x) => x.data);
    }

    return { add, alives, data, vote, damage };
}

module.exports = { playerController };
