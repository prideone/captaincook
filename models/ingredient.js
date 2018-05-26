var schemas = require("./schemas.js");
var _ = require("lodash");

var Ingredient = function (data) {
    this.data = this.sanitize(data);
}



class Ingredient {
    constructor(name) {
        this.name = name;
    }
    sayName() {
        console.log(this.name);
    }
}

module.exports = User;