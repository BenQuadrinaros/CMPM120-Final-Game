class Pre5 extends Phaser.Scene {
    constructor() {
        super("pre5");
    }

    preload() {
        //load images
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('ravine', './assets/ravine.png');
        this.load.image('hill', './assets/mountain.png');

        //load audio files
        this.load.audio("menuSelect", "./assets/menuSelect.wav");
        this.load.audio("chargeHit", "./assets/shotIndicator.wav");
        this.load.audio("rotate", "./assets/angleTick.wav");
        this.load.audio("bounce", "./assets/bounce.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#5A5");
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.hasChosen = false;
        this.increasingHit = true;
        this.increasingHill = false;
        this.increasingRavine = false;

        //ball sfx
        this.chargeSound = this.sound.add("chargeHit");
        this.chargeSound.volume = .5;
        this.chargeSound.loop = true;
        this.chargeSound.play();
        this.turningSound = this.sound.add("rotate");
        this.turningSound.volume = 0;
        this.turningSound.loop = true;
        this.turningSound.play();
        this.bounceSound = this.sound.add("bounce");
        this.bounceSound.volume = 0;
        this.bounceSound.loop = true;
        this.bounceSound.play();

        //set up hill
        this.hill = new Hill(this, 3 * game.config.width / 5, game.config.height / 2 + 50, 'hill', .01);

        //create a ravine
        this.ravine = new Ravine(this, 2 * game.config.width / 3, game.config.height / 2 - 50, 'ravine', .01);

        //create a ball to show hitting
        this.player = new Player(this, game.config.width / 3, game.config.height / 2, 'ball', keyUP,
            keyRIGHT, keyLEFT, false, 1);
        this.player.body.setEnable(true);
        this.physics.world.on('worldbounds', () => {
            this.bounceSound.volume = .75;
            this.time.addEvent({
                delay: 750,
                callback: () => { this.bounceSound.volume = 0 },
                loop: false,
                callbackScope: this
            });
        }, this);

        //set up neccessary physics
        this.physics.world.on('worldbounds', this.worldBounce, this);
        this.push = this.physics.add.overlap(this.player, this.hill, this.pushOverlap, null, this);
        this.pull = this.physics.add.overlap(this.player, this.ravine, this.pullOverlap, null, this);

        let menuConfig = {
            fontFamily: "Courier",
            fontSize: "32px",
            color: "#000",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        };

        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        let textSpacer = 80;

        this.add.text(centerX, centerY - 2 * textSpacer, "Press (↓) to proceed to Level 5.", menuConfig).setOrigin(.5);
        this.add.text(centerX, centerY + textSpacer, "You can terraform after you have hit the ball.", 
            menuConfig).setOrigin(.5);
        this.changingText = this.add.text(centerX, centerY + 2 * textSpacer, "You can push the ball from behind.",
            menuConfig).setOrigin(.5);
        //tutorial broken up into parts
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.increasingHit = false;
                this.physics.velocityFromRotation(this.player.rotation, this.player.ballSpeed * 200,
                    this.player.body.acceleration);
                this.player.ballSpeed = 0;
                this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        this.increasingHill = true;
                        this.time.addEvent({
                            delay: 3000,
                            callback: () => {
                                this.increasingHill = false;
                                this.increasingRavine = true;
                                this.changingText.text = "Or, you can pull the ball from the front."
                                this.time.addEvent({
                                    delay: 3500,
                                    callback: () => { 
                                        this.increasingRavine = false;
                                        this.time.addEvent({
                                            delay: 2500,
                                            callback: () => {
                                                this.time.addEvent({
                                                    delay: 7500,
                                                    callback: () => { this.scene.restart() },
                                                    loop: false,
                                                    callbackScope: this
                                                });
                                            },
                                            loop: false,
                                            callbackScope: this
                                        });
                                     },
                                    loop: false,
                                    callbackScope: this
                                });
                            },
                            loop: false,
                            callbackScope: this
                        });
                    },
                    loop: false,
                    callbackScope: this
                });
            },
            loop: false,
            callbackScope: this
        });
    }

    update() {
        this.player.update();

        if (this.increasingHit) {
            this.player.ballSpeed++;
            if (this.player.ballSpeed >= 150) {
                this.increasing = false;
            }
        }
        if (this.increasingRavine) {
            this.ravine.scale += .005;
            if (this.ravine.scale >= 1.15) {
                this.increasingRavine = false;
            }
        }
        if (this.increasingHill) {
            this.hill.scale += .005;
            if (this.hill.scale >= 1.15) {
                this.increasingHill = false;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.hasChosen) {
            this.hasChosen = true;
            this.bounceSound.volume = 0
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { this.scene.start("level_5Scene") },
                loop: false,
                callbackScope: this
            });
        }
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
        if (ravine.scale < 1) {
            this.physics.velocityFromRotation(angle, 100, this.player.body.acceleration);
        } else {
            this.physics.velocityFromRotation(angle, 100 * ravine.scale, this.player.body.acceleration);
        }
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
        if (hill.scale < 1) {
            this.physics.velocityFromRotation(angle, 100, this.player.body.acceleration);
        } else {
            this.physics.velocityFromRotation(angle, 100 * hill.scale, this.player.body.acceleration);
        }
    }

}
