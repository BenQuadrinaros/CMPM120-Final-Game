class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        //load images
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('logo', './assets/megagolftitle.png');

        //load audio files
        this.load.audio("menuSelect", "./assets/menuSelect.wav");
        this.load.audio("bounce", "./assets/bounce.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#5A5");
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.singleClick = 0;
        this.hasChosen = false;
        this.creditsRoll = false;

        //create a ball to bounce in the background
        this.player = this.physics.add.sprite(Phaser.Math.Between(100, game.config.width - 100),
            Phaser.Math.Between(100, game.config.height - 100), "ball");
        this.player.setOrigin(.5).setCircle(130).setScale(.25, .25);
        this.player.rotation = Phaser.Math.Between(0, 2 * Math.PI);
        this.player.setCollideWorldBounds(true, .9, .9);
        this.player.body.onWorldBounds = true;
        this.player.body.setGravity(false);
        this.player.setMaxVelocity(200);
        this.physics.world.on('worldbounds', () => { this.sound.play("bounce") }, this);
        this.physics.world.on('worldbounds', worldBounce, this);
        this.physics.velocityFromRotation(this.player.rotation, Phaser.Math.Between(1000, 10000) * 100,
            this.player.body.acceleration);
        this.time.addEvent({
            delay: 100,
            callback: () => { this.player.body.acceleration = 0; },
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
        let textSpacer = 64;

        // (↑) & (↓)
        this.upper = this.add.text(centerX, centerY - 2.75 * textSpacer, "Press (↑) to start golfing.", menuConfig)
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
                callback: () => { this.scene.start("Level_Select") },
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
