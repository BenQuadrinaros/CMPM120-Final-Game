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
            debug: false,
            gravity:{
                x:0,
                y:0
            }
        }
    },

    scene: [Menu, Level_Select, Sandbox, Level_1, Level_2, Level_3, Level_4]

};

let game = new Phaser.Game(config);

game.settings = {
    
};
let levelsAvailable = [1, 4];

//reserve some keyboard variables
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keyR, keyP, keyQ;
let keyZERO, keyONE, keyTWO, keyTHREE, keyFOUR;
let mouseDown = false;