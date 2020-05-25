class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        //load images
        this.load.image('ball', './assets/ball_temp.png');

        //load audio files
        this.load.audio("menuSelect", "./assets/menuSelect.wav");
        this.load.audio("bounce", "./assets/bounce.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#5A5");
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.singleClick = 0;

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
            color: "#FFF",
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
        this.add.text(centerX, centerY - 2 * textSpacer, "Press (↑) to start golfing.", menuConfig)
            .setOrigin(.5).setInteractive();
        this.add.text(centerX, centerY + 2 * textSpacer, "Press (↓) to go to the sandbox.", menuConfig)
            .setOrigin(.5).setInteractive();
        menuConfig.fontSize = "48px";
        menuConfig.strokeThickness = 3;
        menuConfig.stroke = "#FD0";
        this.add.text(centerX, centerY, "GOD GOLF", menuConfig).setOrigin(.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { this.scene.start("Level_Select") },
                loop: false,
                callbackScope: this
            });
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { this.scene.start("sandboxScene") },
                loop: false,
                callbackScope: this
            });
        }
    }

    /*update() {
        if(game.input.mousePointer.isDown){
            this.singleClick++;
        } else if(!(game.input.mousePointer.isDown)){
            this.singleClick = 0;
        }
        if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay:1300,
                callback: () => {this.scene.start("playScene")},
                loop:false,
                callbackScope:this
            });
        }
        if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay:1300,
                callback: () => {this.scene.start("instructionScene")},
                loop:false,
                callbackScope:this
            });
        }
        if(this.singleClick == 1) {
            this.playText.on('pointerdown',() => {
                this.sound.play("menuSelect");
                this.time.addEvent({
                    delay:1300,
                    callback: () => {this.scene.start("playScene")},
                    loop:false,
                    callbackScope:this
                });
            });
            this.instructionsText.on('pointerdown',() => {
                this.sound.play("menuSelect");
                this.time.addEvent({
                    delay:1300,
                    callback: () => {this.scene.start("instructionScene")},
                    loop:false,
                    callbackScope:this
                });
            });
        }
    }*/
}
