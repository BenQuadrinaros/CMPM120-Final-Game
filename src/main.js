/*
Mark Medved, Ben Rowland, and Thane Wisherop
NAME OF GAME
DATE COMPLETED

DESCRIPTION TEXT
*/

let config = {
    type: Phaser.CANVAS,
    width: 880,
    height: 640,
    physics:{
        default:'arcade',
        arcade:{
            debug: true,
            gravity:{
                x:0,
                y:0
            }
        }
    },
    scene: [Menu, Sandbox, Level_1, Level_2,Level_3]
};

let game = new Phaser.Game(config);

game.settings = {
    
};

//reserve some keyboard variables
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keyR, keyP, keyQ;
let mouseDown = false;

//need left mouse click