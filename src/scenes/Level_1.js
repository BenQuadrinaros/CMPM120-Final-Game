class Level_1 extends Phaser.Scene {
    constructor() {
        super("level_1Scene");
    }

    preload() {
        //console.log("in level 1");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
    }

    create() {
        //misc set up
        this.cameras.main.setBackgroundColor("#5A5");
        this.singleClick = 0;
        this.ballSpeed = 0;
        this.mouse = this.input.activePointer;
        this.newObjs = [];

        //key bindings
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //set up player physics
        this.player = new Player(this, 100, 100, 'ball', keyUP, keyRIGHT, keyLEFT).setOrigin(.5).setCircle(135).setScale(.25, .25);
        this.physics.world.on('worldbounds', this.worldBounce, this);

        //set up map obstacles and physics
        this.walls = this.add.group();
        {
            //create each walls for the level
            var floor = this.physics.add.sprite(20, 250, 'wall').setOrigin(0, 0);
            floor.body.setImmovable(true);
            floor.body.setGravity(false);
            this.walls.add(floor);
        }
        this.physics.add.collider(this.player, this.walls, this.objectBounce, null, this);

        //set up hill physics
        this.hills = this.add.group();
        {
            var mound = this.physics.add.sprite(750, 205, 'ball');
            mound.setOrigin(.5).setCircle(130).setScale(.75, .75).setInteractive();
            //mound.tint = '#000';
            mound.alpha = .25;
            mound.body.setImmovable(true);
            mound.body.setGravity(false);
            this.hills.add(mound)
        }
        this.push = this.physics.add.overlap(this.player, this.hills, this.pushOverlap, null, this);

        //set up ravine phsyics
        this.ravines = this.add.group();
        {
            //create a ravine in the hole
            var hole = this.physics.add.sprite(400, 400, 'ball');
            hole.setOrigin(.5).setCircle(130).setScale(.75, .75).setInteractive();
            //hole.tint = "#FFF";
            hole.alpha = .5;
            hole.body.setImmovable(true);
            hole.body.setGravity(false);
            this.ravines.add(hole);
        }
        this.pull = this.physics.add.overlap(this.player, this.ravines, this.pullOverlap, null, this);

        //set up level goal
        this.goal = this.physics.add.sprite(75, 550, 'ball');
        this.goal.setOrigin(.5).setCircle(40, 90, 90).setScale(.4, .4);
        this.goal.body.updateCenter();
        this.goal.body.setImmovable(true);
        this.goal.body.setGravity(false);
        this.win = this.physics.add.overlap(this.player, this.goal, this.toNextLevel, null, this);
    }


    update() {
        this.player.update();

        //keyboard controls for pause and restart
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            //this.sound.play("wipe");
            this.player.body.reset(100, 100);
        }
        if (Phaser.Input.Keyboard.JustDown(keyP)) {
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
                    this.sizeIncrease(temp, "right", true);
                }
                if(this.mouse.leftButtonDown()) {
                    //if left click, add ravine to group
                    this.ravines.add(temp)
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
        this.player.alpha = 0;
        //play animation for ball -> hole
        //this.sound.play("ballInHole");
        this.time.addEvent({
            delay: 1300,
            callback: () => { this.scene.start("menuScene") },
            loop: false,
            callbackScope: this
        });
    }

}