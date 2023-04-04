class Player {
    constructor() {
        this._name = Math.floor(Math.random() * Date.now())
            .toString(16)
            .slice(0, 5);
        this._lives = 5;
        this._vote = -1;
    }

    /**
     * @param {number} damage
     */
    getDamage(damage = 1) {
        this._lives -= damage;
    }

    /**
     * @param {number} vote
     */
    set vote(vote) {
        this._vote = vote;
    }

    get data() {
        return {
            name: this._name,
            lives: this._lives,
            vote: this._vote,
        };
    }
}

module.exports = { Player };
