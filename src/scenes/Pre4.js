class Pre4 extends Phaser.Scene {
    constructor() {
        super("pre4");
    }

    preload() {
        //load images
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('ravine', './assets/ravine.png');

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
        this.increasingHit = false;
        this.increasingRavine = true;

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

        this.add.text(centerX, centerY - 2 * textSpacer, "Press (↓) to proceed to Level 4.", menuConfig).setOrigin(.5);
        this.add.text(centerX, centerY + textSpacer, "To terraform in levels,\nhold Left Mouse Button.", menuConfig).setOrigin(.5);
        this.changingText = this.add.text(centerX, centerY + 2 * textSpacer, "To use the Ravine tool, press (2).",
            menuConfig).setOrigin(.5);

        //tutorial broken up into parts
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.increasingHit = true;
                this.time.addEvent({
                    delay: 5000,
                    callback: () => {
                        this.changingText.text = "Ravines will pull the ball in.";
                        this.increasingHit = false;
                        this.physics.velocityFromRotation(this.player.rotation, this.player.ballSpeed * 200,
                            this.player.body.acceleration);
                        this.player.ballSpeed = 0;
                        this.time.addEvent({
                            delay: 12000,
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

        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.hasChosen) {
            this.hasChosen = true;
            this.bounceSound.volume = 0
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { this.scene.start("level_4Scene") },
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

}
