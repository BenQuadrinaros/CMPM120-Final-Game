class Sandbox extends Phaser.Scene {
    constructor() {
        super("sandboxScene");
    }

    preload() {
        //console.log("in sandbox");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
        this.load.image('hill', './assets/mountain.png');
        this.load.image('ravine', './assets/ravine.png');

        //load player assosciated audio
        this.load.audio("rotate", "./assets/angleTick.wav");
        this.load.audio("chargeHit", "./assets/shotIndicator.wav");
        this.load.audio("ballHit", "./assets/ballHit.wav");
        this.load.audio("music", "./assets/music.wav");
        this.load.audio("bounce", "./assets/bounce.wav");
        this.load.audio("quit", "./assets/quit.wav");
        this.load.audio("wipe", "./assets/wipe.wav");
    }

    create() {
        //misc set up
        this.cameras.main.setBackgroundColor("#5A5");
        this.singleClick = 0;
        this.ballSpeed = 0;
        this.mouse = this.input.activePointer;
        this.mouseType = "None";
        this.startPosX = 100;
        this.startPosY = 200;

        //audio volume adjustments
        this.chargeSound = this.sound.add("chargeHit");
        this.chargeSound.volume = .5;
        this.chargeSound.loop = true;
        this.chargeSound.play();
        this.music = this.sound.add("music");
        this.music.loop = true;
        this.music.play();
        this.turningSound = this.sound.add("rotate");
        this.turningSound.volume = 0;
        this.turningSound.loop = true;
        this.turningSound.play();
        this.bounceSound = this.sound.add("bounce");
        this.bounceSound.volume = 0;
        this.bounceSound.loop = true;
        this.bounceSound.play();

        //key bindings
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //key bindings for mouse controls
        keyZERO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        keyTHREE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        keyFOUR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

        //set up player physics
        this.player = new Player(this, this.startPosX, this.startPosY, 'ball', keyUP,
            keyRIGHT, keyLEFT, true).setOrigin(.5).setCircle(135).setScale(.25, .25);

        this.physics.world.on('worldbounds', () => { this.bounceSound.volume = .75 }, this);
        this.physics.world.on('worldbounds', worldBounce, this);

        //set up obstacles physics
        this.walls = this.add.group();
        {
            //create each walls for the level
            this.walls.add(new Obstacle(this, 0, 0, 'wall').setOrigin(0, 0).setScale(4.6, .75));
        }
        this.physics.add.collider(this.player, this.walls, () => { this.bounceSound.volume = .75 }, null, this);
        this.physics.add.collider(this.player, this.walls, objectBounce, null, this);

        //set up hill physics
        this.hills = this.add.group();
        {
            this.hills.add(new Hill(this, Phaser.Math.Between(100, game.config.width - 100),
                Phaser.Math.Between(200, game.config.height - 100), 'hill',
                Phaser.Math.Between(.1, .5)));
        }
        this.push = this.physics.add.overlap(this.player, this.hills, pushOverlap, null, this);

        //set up ravine phsyics
        this.ravines = this.add.group();
        {
            //create a ravine in the hole
            this.ravines.add(new Ravine(this, Phaser.Math.Between(100, game.config.width - 100),
                Phaser.Math.Between(200, game.config.height - 100), 'ravine',
                Phaser.Math.Between(.1, .5)));
        }
        this.pull = this.physics.add.overlap(this.player, this.ravines, pullOverlap, null, this);

        //sandbox text
        let textConfig = {
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
        this.text1 = this.add.text(centerX, centerY - 2.5 * textSpacer, "Feel free to experiment and play around.",
            textConfig).setOrigin(.5);
        this.text2 = this.add.text(centerX, centerY - 1.75 * textSpacer, "Press (Q) to quit to the menu.",
            textConfig).setOrigin(.5);
        this.text3 = this.add.text(centerX, centerY + 4 * textSpacer, "Press (P) to place the ball.",
            textConfig).setOrigin(.5);
        this.text4 = this.add.text(centerX, centerY + 4.5 * textSpacer, "Press (R) to reset the sandbox.",
            textConfig).setOrigin(.5);

        textConfig.fontSize = "18px";
        this.add.text(centerX - game.config.width / 3, game.config.height / 15,
            "(←) / (→)  to angle.\nHold (↑) to charge.\nRelease (↑) to swing.",
            textConfig).setOrigin(.5);
        this.mouseText = this.add.text(centerX, game.config.height / 15,
            "Left Click to use object type.\n(0) -> (2) to change.\nCurrent object type: " + this.mouseType,
            textConfig).setOrigin(.5);
        this.add.text(centerX + game.config.width / 3, game.config.height / 15,
            "(0) Remove\n(1) Hill\n(2) Ravine",
            textConfig).setOrigin(.5);
    }


    update() {
        this.player.update();

        //keyboard controls for pause and restart
        if (Phaser.Input.Keyboard.JustDown(keyP)) {
            this.sound.play("wipe");
            this.player.body.reset(this.startPosX, this.startPosY);
            this.player.body.setEnable(false);
            this.player.rotation = 0;
        }
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play("wipe");
            this.music.pause();
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            this.sound.play("quit");
            this.music.pause();
            this.scene.start("menuScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyZERO)) {
            this.rotateSound.play();
            this.mouseType = "Remove";
            this.mouseText.text = "Left Click to use object type.\n(0) -> (2) to change.\nCurrent object type: " + this.mouseType;
        }
        if (Phaser.Input.Keyboard.JustDown(keyONE)) {
            this.rotateSound.play();
            this.mouseType = "Hill";
            this.mouseText.text = "Left Click to use object type.\n(0) -> (2) to change.\nCurrent object type: " + this.mouseType;
        }
        if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
            this.rotateSound.play();
            this.mouseType = "Ravine";
            this.mouseText.text = "Left Click to use object type.\n(0) -> (2) to change.\nCurrent object type: " + this.mouseType;
        }

        //mouse controls for terrain manipulation
        if (game.input.mousePointer.isDown) {
            this.singleClick++;
        } else {
            this.singleClick = 0;
        }
        //create new object when clicking
        if (this.singleClick == 1 && !this.player.body.enable) {
            this.input.on('pointerdown', () => {
                if (this.mouseType == "Ravine") {
                    //if left click, add ravine to group
                    var temp = new Ravine(this, game.input.mousePointer.x, game.input.mousePointer.y, 'ravine', .01);
                    console.log("temp: " + temp);
                    this.ravines.add(temp)
                    console.log(this.ravines);
                    this.sizeIncrease(temp, true);
                } else if (this.mouseType == "Hill") {
                    //if right click, add hill to group
                    var temp = new Hill(this, game.input.mousePointer.x, game.input.mousePointer.y, 'hill', .01);
                    console.log("temp: " + temp);
                    temp.setOrigin(.5).setCircle(130, 20, 20).setScale(.01, .01).setInteractive();
                    temp.body.setImmovable(true);
                    temp.body.setGravity(false);
                    this.hills.add(temp)
                    console.log(this.hills);
                    this.sizeIncrease(temp, true);
                }
            });
        }
    }

    sizeIncrease(object, looping) {
        //increase size as long as the correct mouse button is held down
        object.scale += .01;
        console.log("make it bigger");
        if (!this.mouse.leftButtonDown()) {
            looping = false;
            console.log("wrong key (left)");
        }
        this.time.addEvent({
            delay: 100,
            callback: () => { if (looping) { this.sizeIncrease(object, looping); } },
            loop: false,
            callbackScope: this
        });
    }
}