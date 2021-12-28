const path = require('path');
var Game = require('./src/game');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/game.js'),
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: "SnakeGame",
            type: "umd"
        }
    },
    mode: "development",
};