class Pre8 extends Phaser.Scene {
    constructor() {
        super("pre8");
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
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.hasChosen = false;
        this.increasing = true;

        createAnims(this);


        //ball sfx
        this.chargeSound = this.sound.add("chargeHit");
        this.chargeSound.volume = .5;
        this.chargeSound.loop = true;
        this.chargeSound.play();
        this.turningSound = this.sound.add("rotate");
        this.turningSound.volume = 0;
        this.turningSound.loop = true;
        this.turningSound.play();

        //create a ball to show hitting
        this.player = new Player(this, game.config.width/3, game.config.height/2, 'distortionAtlas', keyUP,
            keyRIGHT, keyLEFT, false, 'roll1');
        this.player.body.setEnable(true);
        this.physics.world.on('worldbounds', () => { this.sound.play("bounce") }, this);
        this.physics.world.on('worldbounds', this.worldBounce, this);

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

        this.add.text(centerX, centerY - 2 * textSpacer, "Press (↓) to proceed to Level 8.", menuConfig).setOrigin(.5);
        this.add.text(centerX, centerY + 2 * textSpacer, "From here, you are on your own.", menuConfig).setOrigin(.5);
        this.changingText = this.add.text(centerX, centerY + textSpacer, "This next one is a doozy.",
            menuConfig).setOrigin(.5);

        //tutorial broken up into parts
        this.time.addEvent({
            delay: Phaser.Math.Between(3000, 5000),
            callback: () => {
                this.changingText.text = "Take your time and do not be\nafraid to restart if necessary.";
                this.physics.velocityFromRotation(this.player.rotation, this.player.ballSpeed * 200, this.player.body.acceleration);
                this.player.play("roll");
                this.player.ballSpeed = 0;
                this.time.addEvent({
                    delay: 5000,
                    callback: () => { if (!this.hasChosen) { this.scene.restart() } },
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

        if (this.increasing) {
            this.player.ballSpeed++;
            if (this.player.ballSpeed >= 150) {
                this.increasing = false;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.hasChosen) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { this.scene.start("level_8Scene") },
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
