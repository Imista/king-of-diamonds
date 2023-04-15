const { Player } = require("../models/playerModel");

function playerController() {
    const players = {};
    const LIVES_LIMIT = -2;

    function add(id) {
        players[id] = new Player(id);
    }

    function vote(id, vote) {
        players[id].vote = vote;
    }

    function votes() {
        return Object.values(players).map(({ vote }) => vote);
    }

    function results(winVote) {
        const winners = Object.values(players)
            .filter(({ vote }) => vote == winVote)
            .map(({ data }) => data);
        Object.values(players)
            .filter(({ vote }) => vote != winVote)
            .map((player) => player.getDamage(1));
        return winners;
    }

    function damage(id, damage) {
        players[id].getDamage(damage);
    }

    function restart() {
        for (const [id, player] of Object.entries(players)) {
            if (player.lives <= LIVES_LIMIT) delete players[id];
            else player.vote = -1;
        }
    }
    function restart() {
        for (const player of Object.values(players)) player.vote = -1;
    }

    function execute() {
        const players_executed = [];
        for (const [id, player] of Object.entries(players)) {
            if (player.lives <= LIVES_LIMIT) {
                players_executed.push(id);
                delete players[id];
            }
        }
        return players_executed;
    }

    function alives() {
        return Object.values(players).filter(({ lives }) => lives > LIVES_LIMIT)
            .length;
    }

    function everyVoted() {
        return Object.values(players).every(({ vote }) => vote != -1);
    }

    function data(id) {
        if (!id) return Object.values(players).map(({ data }) => data);
        else return players[id].data;
    }

    return {
        add,
        alives,
        data,
        vote,
        votes,
        results,
        damage,
        everyVoted,
        restart,
        execute,
    };
}

module.exports = { playerController };
