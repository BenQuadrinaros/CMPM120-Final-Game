class End_Screen extends Phaser.Scene {
    constructor() {
        super("endScreen");
    }

    preload() {
        //load images
        this.load.image('logo', './assets/megagolftitle.png');

        //load audio files
        this.load.audio("menuSelect", "./assets/menuSelect.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#5A5");
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.hasChosen = false;
        this.creditsRoll = false;

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
        let textSpacer = 64;

        // (↑) & (↓)
        this.upper = this.add.text(centerX, centerY - 2.75 * textSpacer, "Press (↑) to return to the main menu.", menuConfig)
            .setOrigin(.5);
        this.credits = this.add.text(centerX, centerY + 2.75 * textSpacer, "Press (↓) to view the credits.", menuConfig)
            .setOrigin(.5);
        this.creditsMark = this.add.text(centerX, game.config.height + 1.25 * textSpacer,
            "Mark Medved - Level Designer/Programmer", menuConfig).setOrigin(.5);
        this.creditsBen = this.add.text(centerX, game.config.height + 2 * textSpacer,
            "Ben Rowland - UI Designer/Programmer", menuConfig).setOrigin(.5);
        this.creditsThane = this.add.text(centerX, game.config.height + 2.75 * textSpacer,
            "Thane Wisherop - Artist/Animator", menuConfig).setOrigin(.5);
        this.creditsSound = this.add.text(centerX, game.config.height + 3.5 * textSpacer,
            "Sound Design by Mark Medved and Ben Rowland", menuConfig).setOrigin(.5);
        this.logo = this.add.image(centerX, centerY, 'logo').setScale(2.5, 2.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyUP) && !this.hasChosen) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.bounceSound.volume = 0;
                    this.scene.start("menuScene");
                },
                loop: false,
                callbackScope: this
            });
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && this.credits.alpha == 1) {
            this.creditsRoll = true;
        }

        if (this.creditsRoll && this.credits.alpha > 0) {
            this.credits.alpha -= .01;
        } else if (this.creditsRoll && this.credits.alpha == 0) {
            this.upper.y -= .15;
            this.logo.y -= .3;
            this.creditsMark.y--;
            this.creditsBen.y--;
            this.creditsThane.y--;
            this.creditsSound.y--;
            if(this.creditsMark.y <= 2*game.config.height/3) {
                this.creditsRoll = false;
            }
        }
    }
}
