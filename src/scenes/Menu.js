class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        //load images
        this.load.image('ball', './assets/ball_temp.png');
        this.load.atlas('distortionAtlas', './assets/spritesheet.png', './assets/sprites.json');
        this.load.image('logo', './assets/megagolftitle.png');

        //load audio files
        this.load.audio("menuSelect", "./assets/menuSelect.wav");
        this.load.audio("chargeHit", "./assets/shotIndicator.wav");
        this.load.audio("rotate", "./assets/angleTick.wav");
        this.load.audio("bounce", "./assets/bounce.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#5A5");
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.singleClick = 0;
        this.hasChosen = false;
        this.creditsRoll = false;

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
        this.bounceSound = this.sound.add("bounce");
        this.bounceSound.volume = 0;
        this.bounceSound.loop = true;
        this.bounceSound.play();

        //create a ball to bounce in the background
        this.player = new Player(this, Phaser.Math.Between(100, game.config.width - 100),
            Phaser.Math.Between(100, game.config.width - 100), 'distortionAtlas', keyUP,
            keyRIGHT, keyLEFT, false, 'roll1');
        this.player.rotation = Phaser.Math.Between(0, 2*Math.PI);
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
                callback: () => { 
                    this.bounceSound.volume = 0;
                    this.scene.start("Level_Select");
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
