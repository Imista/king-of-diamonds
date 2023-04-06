const { Player } = require("../models/playerModel");

function playerController() {
    const players = {};

    function add(id) {
        players[id] = new Player();
    }

    function vote(id, vote) {
        players[id].vote = vote;
    }

    function votes() {
        return Object.values(players).map(({ vote }) => vote);
    }

    function results(winVote) {
        const winners = Object.values(players).filter(
            ({ vote }) => vote == winVote
        );
        const loosers = Object.values(players).filter(
            ({ vote }) => vote != winVote
        );
        return { winners, loosers };
    }

    function damage(id, damage) {
        players[id].getDamage(damage);
    }

    function alives() {
        return Object.values(players).filter(({ lives }) => lives).length;
    }

    function everyVoted() {
        return Object.values(players).every(({ vote }) => vote != -1);
    }

    function data() {
        return Object.values(players).map(({ data }) => data);
    }

    return { add, alives, data, vote, votes, results, damage, everyVoted };
}

module.exports = { playerController };
