class Level_1 extends Phaser.Scene {
    constructor() {
        super("level_1Scene");
    }

    preload() {
        //console.log("in level 1");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
        this.load.image('background', './assets/Level1background.jpg');
        
        //load player assosciated audio
        this.load.audio("rotate", "./assets/angleTick.wav");
        this.load.audio("chargeHit", "./assets/shotIndicator.wav");
        this.load.audio("ballHit", "./assets/ballHit.wav");
        this.load.audio("ballInHole", "./assets/ballInHole.wav");
        this.load.audio("music", "./assets/music.wav");
    }

    create() {
        //misc set up
        this.cameras.main.setBackgroundColor("#5A5");
        this.singleClick = 0;
        this.ballSpeed = 0;
        this.mouse = this.input.activePointer;
        this.startPosX = 100;
        this.startPosY = 375;

        //audio volume adjustments
        this.chargeSound = this.sound.add("chargeHit");
        this.chargeSound.volume = .5;
        this.rotateSound = this.sound.add("rotate");
        this.rotateSound.volume = .5;
        this.music = this.sound.add("music");
        this.music.loop = true;
        this.music.play();

        //key bindings
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //set up map background
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);

        //set up player physics
        this.player = new Player(this, this.startPosX, this.startPosY, 'ball', keyUP, 
                keyRIGHT, keyLEFT).setOrigin(.5).setCircle(135).setScale(.25, .25);
        this.physics.world.on('worldbounds', this.worldBounce, this);

        //set up obstacles physics
        this.walls = this.add.group();
        {
            //create each walls for the level
            var floor1 = this.physics.add.sprite(0, 150, 'wall').setOrigin(0, 0).setScale(2.3, 1);
            floor1.alpha = .5;
            floor1.body.setImmovable(true);
            floor1.body.setGravity(false);
            this.walls.add(floor1);

            var floor2 = this.physics.add.sprite(440, 150, 'wall').setOrigin(0, 0).setScale(2.3, 1);
            floor2.alpha = .5;
            floor2.body.setImmovable(true);
            floor2.body.setGravity(false);
            this.walls.add(floor2);

            var floor3 = this.physics.add.sprite(0, 475, 'wall').setOrigin(0, 0).setScale(2.3, 1);
            floor3.alpha = .5;
            floor3.body.setImmovable(true);
            floor3.body.setGravity(false);
            this.walls.add(floor3);

            var floor4 = this.physics.add.sprite(440, 475, 'wall').setOrigin(0, 0).setScale(2.3, 1);
            floor4.alpha = .5;
            floor4.body.setImmovable(true);
            floor4.body.setGravity(false);
            this.walls.add(floor4);
        }
        this.physics.add.collider(this.player, this.walls, this.objectBounce, null, this);

        //set up hill physics
        this.hills = this.add.group();
        {
            /*var mound = this.physics.add.sprite(750, 205, 'ball');
            mound.setOrigin(.5).setCircle(130).setScale(.75, .75).setInteractive();
            //mound.tint = '#000';
            mound.alpha = .25;
            mound.body.setImmovable(true);
            mound.body.setGravity(false);
            this.hills.add(mound)*/
        }
        this.push = this.physics.add.overlap(this.player, this.hills, this.pushOverlap, null, this);

        //set up ravine phsyics
        this.ravines = this.add.group();
        {
            //create a ravine in the hole
            var hole = this.physics.add.sprite(800, 375, 'ball');
            hole.setOrigin(.5).setCircle(130).setScale(.4, .4).setInteractive();
            //hole.tint = "#FFF";
            hole.alpha = .5;
            hole.body.setImmovable(true);
            hole.body.setGravity(false);
            this.ravines.add(hole);
        }
        this.pull = this.physics.add.overlap(this.player, this.ravines, this.pullOverlap, null, this);

        //set up level goal
        this.goal = this.physics.add.sprite(800, 375, 'ball');
        this.goal.setOrigin(.5).setCircle(40, 90, 90).setScale(.4, .4);
        this.goal.body.updateCenter();
        this.goal.body.setImmovable(true);
        this.goal.body.setGravity(false);
        this.win = this.physics.add.overlap(this.player, this.goal, this.toNextLevel, null, this);

        //tutorial text for Level_1
        let textConfig = {
            fontFamily: "Courier", 
            fontSize: "32px",
            backgroundColor: "#FFF",
            color: "#000",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        };
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;
        this.text1 = this.add.text(centerX, centerY - 4.5*textSpacer, "Use (←) and (→) to turn the ball.", 
                textConfig).setOrigin(.5);
        this.text2 = this.add.text(centerX, centerY - 3.75*textSpacer, "Hold (↑) to charge the shot power.",
                textConfig).setOrigin(.5);
        this.text3 = this.add.text(centerX, centerY - 3*textSpacer, "Release (↑) to fire the ball.",
                textConfig).setOrigin(.5);
        textConfig.fontSize = "28px";
        this.text4 = this.add.text(centerX, centerY + 4*textSpacer, "Press (R) to reset the ball.", 
                textConfig).setOrigin(.5);
        this.text5 = this.add.text(centerX, centerY + 4.5*textSpacer, "Press (Q) to restart the level.",
                textConfig).setOrigin(.5);
        //fading tutorial text
        textConfig.backgroundColor = null;
        textConfig.fontSize = "18px";
        this.fadeText1 = this.add.text(this.player.x + 30, this.player.y - textSpacer, "(←) and (→) to turn", 
                textConfig).setOrigin(.5);
        this.fadeText2 = this.add.text(this.player.x + 3*textSpacer, this.player.y + 5, "Hold (↑) to charge",
                textConfig).setOrigin(.5);
        this.fadeText3 = this.add.text(this.player.x + 30, this.player.y + textSpacer, "Release (↑) to fire",
                textConfig).setOrigin(.5);
        this.fadeDelay = false;
        this.time.addEvent({
            delay:10000,
            callback: () => {this.fadeDelay = true;},
            loop:false,
            callbackScope:this
        });
    }


    update() {
        this.player.update();

        //fade out text slowly
        if(this.fadeText1.alpha > 0 && this.fadeDelay) {
            this.fadeText1.alpha -= .005;
            this.fadeText2.alpha -= .005;
            this.fadeText3.alpha -= .005;
        }

        //keyboard controls for pause and restart
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            //this.sound.play("wipe");
            this.player.body.reset(this.startPosX, this.startPosY);
        }
        if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            //this.sound.play("pause");
            this.scene.restart();
        }

        //mouse controls for terrain manipulation
        if (game.input.mousePointer.isDown) {
            this.singleClick++;
        } else {
            this.singleClick = 0;
        }
        //create new object when clicking
        if (this.singleClick == 1) {
            this.input.on('pointerdown', () => {
                let temp = this.physics.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'ball');
                console.log("temp: " + temp);
                temp.setOrigin(.5).setCircle(130).setScale(.01, .01).setInteractive();
                temp.body.setImmovable(true);
                temp.body.setGravity(false);
                temp.alpha = .5;
                if(this.mouse.rightButtonDown()) {
                    //if right click, add hill to group
                    this.hills.add(temp)
                    console.log(this.hills);
                    this.sizeIncrease(temp, "right", true);
                }
                if(this.mouse.leftButtonDown()) {
                    //if left click, add ravine to group
                    this.ravines.add(temp)
                    console.log(this.ravines);
                    this.sizeIncrease(temp, "left", true);
                }
            });
        }
    }

    sizeIncrease(object, mouseButton, looping) {
        //increase size as long as the correct mouse button is held down
        object.scale += .005;
        console.log("make it bigger");
        if (mouseButton == "right" && !this.mouse.rightButtonDown()) {
            looping = false;
            console.log("wrong key (right)");
        }
        if (mouseButton == "left" && !this.mouse.leftButtonDown()) {
            looping = false;
            console.log("wrong key (left)");
        } 
        this.time.addEvent({
            delay:100,
            callback: () => {if(looping){this.sizeIncrease(object, mouseButton, looping);}},
            loop:false,
            callbackScope:this
        });
    }

    //angle adjustment for bouncing off world bounds
    worldBounce() {
        if (this.player.y - this.player.body.height / 2 - 5 <= 0 ||
            this.player.y + this.player.body.height / 2 + 5 >= game.config.height) {
            //if player bounces off top or bottom walls, adjust angle accordingly
            if (0 < this.player.rotation <= Math.PI / 2) {
                let temp = this.player.rotation;
                this.player.rotation = -temp;
            } else if (Math.PI / 2 < this.player.rotation <= Math.PI) {
                let temp = Math.PI - this.player.rotation;
                this.player.rotation = Math.PI + temp;
            } else if (Math.PI < this.player.rotation <= 3 * Math.PI / 2) {
                let temp = this.player.rotation - Math.PI;
                this.player.rotation = Math.PI / 2 + temp;
            } else if (3 * Math.PI / 2 < this.player.rotation <= 2 * Math.PI) {
                let temp = 2 * Math.PI - this.player.rotation;
                this.player.rotation = temp;
            }
        } else {
            //if player bounces off left or right walls, adjust angle accordingly
            if (0 < this.player.rotation <= Math.PI / 2) {
                let temp = this.player.rotation;
                this.player.rotation = Math.PI - temp;
            } else if (Math.PI / 2 < this.player.rotation <= Math.PI) {
                let temp = Math.PI - this.player.rotation;
                this.player.rotation = 2 * Math.PI + temp;
            } else if (Math.PI < this.player.rotation <= 3 * Math.PI / 2) {
                let temp = this.player.rotation - Math.PI;
                this.player.rotation = 2 * Math.PI - temp;
            } else if (3 * Math.PI / 2 < this.player.rotation <= 2 * Math.PI) {
                let temp = 2 * Math.PI - this.player.rotation;
                this.player.rotation = Math.PI + temp;
            }
        }
    }

    //angle adjustment for bouncing off objects
    objectBounce(player, object) {
        if (this.player.y - this.player.body.height / 2 - 5 <= object.y + object.body.height ||
            this.player.y + this.player.body.height / 2 + 5 >= object.y) {
            //if player bounces off top or bottom of object, adjust angle accordingly
            if (0 < this.player.rotation <= Math.PI / 2) {
                let temp = this.player.rotation;
                this.player.rotation = -temp;
            } else if (Math.PI / 2 < this.player.rotation <= Math.PI) {
                let temp = Math.PI - this.player.rotation;
                this.player.rotation = Math.PI + temp;
            } else if (Math.PI < this.player.rotation <= 3 * Math.PI / 2) {
                let temp = this.player.rotation - Math.PI;
                this.player.rotation = Math.PI / 2 + temp;
            } else if (3 * Math.PI / 2 < this.player.rotation <= 2 * Math.PI) {
                let temp = 2 * Math.PI - this.player.rotation;
                this.player.rotation = temp;
            }
        } else {
            //if player bounces off left or right of object, adjust angle accordingly
            if (0 < this.player.rotation <= Math.PI / 2) {
                let temp = this.player.rotation;
                this.player.rotation = Math.PI - temp;
            } else if (Math.PI / 2 < this.player.rotation <= Math.PI) {
                let temp = Math.PI - this.player.rotation;
                this.player.rotation = temp;
            } else if (Math.PI < this.player.rotation <= 3 * Math.PI / 2) {
                let temp = this.player.rotation - Math.PI;
                this.player.rotation = 2 * Math.PI - temp;
            } else if (3 * Math.PI / 2 < this.player.rotation <= 2 * Math.PI) {
                let temp = 2 * Math.PI - this.player.rotation;
                this.player.rotation = Math.PI + temp;
            }
        }
    }

    //overlapping with ravines should pull the player towards the center while changing momentum
    pullOverlap(player, ravine) {
        //get the angle towards the center of the ravine
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, ravine.x, ravine.y);
        //adjust player angle towards ravine center
        if (angle < this.player.rotation) {
            this.player.rotation -= Math.PI / 200;
        } else if (angle > this.player.rotation) {
            this.player.rotation += Math.PI / 200;
        }
        //slightly alter momentum based on rotation
        this.physics.velocityFromRotation(angle, 20, this.player.body.acceleration);
    }

    //overlapping with hills should push the player away from the center while changing momentum
    pushOverlap(player, hill) {
        //get the angle away from the center of the hill
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, hill.x, hill.y);
        angle += Math.PI;
        //adjust player angle away from hill center
        if (angle < this.player.rotation) {
            this.player.rotation -= Math.PI / 200;
        } else if (angle > this.player.rotation) {
            this.player.rotation += Math.PI / 200;
        }
        //slightly alter momentum based on rotation
        this.physics.velocityFromRotation(angle, 20, this.player.body.acceleration);
    }

    //collision with hole
    toNextLevel() {
        this.player.body.stop();
        this.player.body.setEnable(false);
        this.player.alpha = 0;
        //play animation for ball -> hole
        this.music.stop();
        this.sound.play("ballInHole");
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.scene.start("menuScene");
            },
            loop: false,
            callbackScope: this
        });
    }

}