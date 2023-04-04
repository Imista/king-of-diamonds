const { Player } = require("./playerModel");

class Table {
    constructor() {
        this._players = {};
        /*
        0: off
        1: voting
        2: punishing
        3: end
        */
        // this._state = 0;
    }

    addPlayer(id) {
        this._players[id] = new Player();
    }

    // start() {
    //     if (this._state) this._state = 1;
    // }

    playerVote(id, vote) {
        this._players[id].vote = vote;
    }

    playerDamage(id, damage) {
        this._players[id].damage = damage;
    }
}

module.exports = { Table };
