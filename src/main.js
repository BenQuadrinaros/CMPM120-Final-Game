/*
Mark Medved, Ben Rowland, and Thane Wisherop
Terra-Golfing
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

    scene: [Menu, Level_Select, Sandbox, Pre1, Level_1, Pre2, Level_2, Pre3, Level_3, Pre4, Level_4]

};

let game = new Phaser.Game(config);

game.settings = {
    
};
let levelsAvailable = [1];

//reserve some keyboard variables
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keyR, keyP, keyQ;
let keyZERO, keyONE, keyTWO, keyTHREE, keyFOUR;
let mouseDown = false;