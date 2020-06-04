/*
Mark Medved, Ben Rowland, and Thane Wisherop
Mega Golf
DATE COMPLETED

A mini-golf inspired game, where you terraform the course itself
to achieve impossible shots on nature-inspired courses. Play
through 9 increasingly difficult holes, or just experiment in the
sandbox.
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

    scene: [Menu, Level_Select, Sandbox, Pre1, Level_1, Pre2, Level_2, Pre3, Level_3, Pre4, Level_4, 
        Pre5, Level_5, Pre6, Level_6, Pre7, Level_7, Pre8, Level_8, Pre9, Level_9]

};

let game = new Phaser.Game(config);

game.settings = {
    
};
let levelsAvailable = [1, 3, 6, 8, 9];

//reserve some keyboard variables
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keyR, keyP, keyQ;
let keyZERO, keyONE, keyTWO, keyTHREE, keyFOUR, keyFIVE, keySIX, keySEVEN, keyEIGHT, keyNINE;
let mouseDown = false;