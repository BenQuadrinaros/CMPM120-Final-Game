class Level_Select extends Phaser.Scene {
    constructor() {
        super("Level_Select");
    }

    preload() {
        //load images
        this.load.image('ball', './assets/ball_temp.png');
        this.load.atlas('distortionAtlas', './assets/spritesheet.png', './assets/sprites.json');

        //load audio files
        this.load.audio("menuSelect", "./assets/menuSelect.wav");
        this.load.audio("chargeHit", "./assets/shotIndicator.wav");
        this.load.audio("rotate", "./assets/angleTick.wav");
        this.load.audio("bounce", "./assets/bounce.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#5A5");
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.singleClick = 0;
        this.hasChosen = false;
        createAnims(this);

        //ball sfx
        this.chargeSound = this.sound.add("chargeHit");
        this.chargeSound.volume = 0;
        this.chargeSound.loop = true;
        this.chargeSound.play();
        this.turningSound = this.sound.add("rotate");
        this.turningSound.volume = 0;
        this.turningSound.loop = true;
        this.turningSound.play();

        //create a ball to bounce in the background
        this.player = new Player(this, Phaser.Math.Between(100, game.config.width - 100),
            Phaser.Math.Between(100, game.config.width - 100), 'distortionAtlas', keyUP,
            keyRIGHT, keyLEFT, false, 'roll1');
        this.player.rotation = Phaser.Math.Between(0, 2 * Math.PI);
        this.player.body.setEnable(true);
        this.physics.world.on('worldbounds', () => { this.sound.play("bounce") }, this);
        this.physics.world.on('worldbounds', worldBounce, this);
        this.physics.velocityFromRotation(this.player.rotation, Phaser.Math.Between(1000, 10000), this.player.body.acceleration);
        this.player.ballSpeed = 0;
        this.player.shotIndicate.width = 0;
        this.player.play("roll");
        this.time.addEvent({
            delay: 150,
            callback: () => { this.player.body.acceleration = 0 },
            loop: false,
            callbackScope: this
        });

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

        keyZERO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        keyTHREE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        keyFOUR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        keyFIVE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        keySIX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        keySEVEN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        keyEIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
        keyNINE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);

        let i = 1;
        levelsAvailable.forEach(level => {
            this.add.rectangle(textSpacer * level, 70, 50, 50, '0xffffff');
            this.add.text(textSpacer * level, 70, level.toString(), menuConfig).setOrigin(.5, .5);
        });

        this.add.text(centerX, centerY - textSpacer, "Press the key of the level you would\nlike to start. Levels will be unlocked\nwhen the previous is completed.", menuConfig)
            .setOrigin(.5);
        this.add.text(centerX, centerY + .75 * textSpacer, "Press (0) to go to the sandbox.\nYou can practice your skills here.", menuConfig)
            .setOrigin(.5);
        this.add.text(centerX, centerY + 2 * textSpacer, "Press (↓) to return to the main menu.", menuConfig)
            .setOrigin(.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyZERO) && !this.hasChosen) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("sandboxScene");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.hasChosen) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("menuScene");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(keyONE) && !this.hasChosen) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("pre1");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(keyTWO) && !this.hasChosen && levelsAvailable.includes(2)) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => {
                    this.scene.start("pre2");
                },
                loop: false,
                callbackScope: this
            });

        }

        if (Phaser.Input.Keyboard.JustDown(keyTHREE) && !this.hasChosen && levelsAvailable.includes(3)) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => {
                    this.scene.start("pre3");
                },
                loop: false,
                callbackScope: this
            });

        }

        if (Phaser.Input.Keyboard.JustDown(keyFOUR) && !this.hasChosen && levelsAvailable.includes(4)) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("pre4");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(keyFIVE) && !this.hasChosen && levelsAvailable.includes(5)) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("pre5");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(keySIX) && !this.hasChosen && levelsAvailable.includes(6)) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("pre6");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(keySEVEN) && !this.hasChosen && levelsAvailable.includes(7)) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("pre7");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(keyEIGHT) && !this.hasChosen && levelsAvailable.includes(8)) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("pre8");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(keyNINE) && !this.hasChosen && levelsAvailable.includes(9)) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("pre9");
                },
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

}
