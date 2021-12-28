//Webpack requires this to work with directories
const path =  require('path');

// This is main configuration object that tells Webpackw what to do. 
module.exports = {
    //path to entry paint
    entry: './src/game.js',
    //path and filename of the final output
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
		 library: {
		  name: 'SnakeGame',
		  type: 'var',
		},
    },
    
    //default mode is production
    mode: 'development'
}