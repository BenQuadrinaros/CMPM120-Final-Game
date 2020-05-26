class Level_Select extends Phaser.Scene {
    constructor() {
        super("Level_Select");
    }

    preload() {
        //load images
        this.load.image('ball', './assets/ball_temp.png');

        //load audio files
        this.load.audio("menuSelect", "./assets/menuSelect.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#5A5");
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.singleClick = 0;
        this.hasChosen = false;

        //create a ball to bounce in the background
        this.player = this.physics.add.sprite(Phaser.Math.Between(100, game.config.width - 100), 
            Phaser.Math.Between(100, game.config.height - 100), "ball");
        this.player.setOrigin(.5).setCircle(130).setScale(.25, .25);
        this.player.rotation = Phaser.Math.Between(0, 2 * Math.PI);
        this.player.setCollideWorldBounds(true, .9, .9);
        this.player.body.onWorldBounds = true;
        this.player.body.setGravity(false);
        this.player.setMaxVelocity(200);
        this.physics.world.on('worldbounds', this.worldBounce, this);
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
        let textSpacer = 80;

         this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

        let i = 1;
        levelsAvailable.forEach(level => {
            this.add.rectangle(textSpacer*level,70,50,50,'0xffffff');
            this.add.text(textSpacer*level,70,level.toString(),menuConfig).setOrigin(.5,.5);

        });

        this.add.text(centerX, centerY - 2*textSpacer, "Press (↑) to Return.", menuConfig)
            .setOrigin(.5).setInteractive();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyUP) && !this.hasChosen) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { this.scene.start("menuScene") },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(this.key1) && !this.hasChosen) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { this.scene.start("level_1Scene") },
                loop: false,
                callbackScope: this
            });
        }

        if (Phaser.Input.Keyboard.JustDown(this.key2) && !this.hasChosen) {
            this.hasChosen = true;
            if (levelsAvailable.includes(2)) {
                this.sound.play("menuSelect");
                this.time.addEvent({
                    delay: 1300,
                    callback: () => {
                        this.scene.start("level_2Scene")
                    },
                    loop: false,
                    callbackScope: this
                });
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.key3) && !this.hasChosen) {
            this.hasChosen = true;
            if (levelsAvailable.includes(3)) {
                this.sound.play("menuSelect");
                this.time.addEvent({
                    delay: 1300,
                    callback: () => {
                        this.scene.start("level_3Scene")
                    },
                    loop: false,
                    callbackScope: this
                });
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.key4) && !this.hasChosen) {
            this.hasChosen = true;
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

}
