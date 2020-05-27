class Pre2 extends Phaser.Scene {
    constructor() {
        super("pre2");
    }

    preload() {
        //load images
        this.load.image('ball', './assets/ball_temp.png');

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

        this.add.text(centerX, centerY - 2 * textSpacer, "Press (↓) to proceed to Level 2.", menuConfig)
            .setOrigin(.5).setInteractive();
        this.changingText = this.add.text(centerX, centerY + textSpacer, "Press (P) to Place the ball back at the start.", menuConfig)
            .setOrigin(.5).setInteractive();

        //tutorial broken up into parts
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.changingText.text = "Press (R) to Reset the whole hole.";
                this.time.addEvent({
                    delay: 5000,
                    callback: () => {
                        this.changingText.text = "Press (Q) to Quit to the Main Menu.";
                        this.time.addEvent({
                            delay: 5000,
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
        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.hasChosen) {
            this.hasChosen = true;
            this.bounceSound.volume = 0
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { this.scene.start("level_2Scene") },
                loop: false,
                callbackScope: this
            });
        }
    }
}
