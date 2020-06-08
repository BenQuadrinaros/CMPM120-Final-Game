class Sandbox extends Phaser.Scene {
    constructor() {
        super("sandboxScene");
    }

    preload() {
        //console.log("in sandbox");
        this.load.image('wall', './assets/rect.png');
        this.load.image('hill', './assets/mountain.png');
        this.load.image('ravine', './assets/ravine.png');

        this.load.atlas('distortionAtlas', './assets/spritesheet.png', './assets/sprites.json');
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
        this.ballSpeed = 0;
        this.mouse = this.input.activePointer;
        this.mouseType = "None";
        this.startPosX = 100;
        this.startPosY = 200;

        createAnims(this);

        //create mouse listener for terrain manipulation
        this.input.on('pointerdown', () => {
            console.log("on click " + this.singleClick);
            if (this.mouseType == "Ravine") {
                //if left click, add ravine to group
                var temp = new Ravine(this, game.input.mousePointer.x, game.input.mousePointer.y, 'ravine', .01);
                console.log("temp: " + temp);
                this.ravines.add(temp);
                temp.play("ravine");
                console.log(this.ravines);
                sizeIncrease(temp, true, this.mouse, this.time);
            } else if (this.mouseType == "Hill") {
                //if right click, add hill to group
                var temp = new Hill(this, game.input.mousePointer.x, game.input.mousePointer.y, 'hill', .01);
                console.log("temp: " + temp);
                this.hills.add(temp);
                temp.play("mountain");
                console.log(this.hills);
                sizeIncrease(temp, true, this.mouse, this.time);
            }
        });

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
        this.player = new Player(this, Phaser.Math.Between(100, game.config.width - 100),
            Phaser.Math.Between(100, game.config.width - 100), 'distortionAtlas', keyUP,
            keyRIGHT, keyLEFT, false, 'roll1');
        this.putter = this.add.sprite(this.player.x,this.player.y,'distortionAtlas','swing1').setOrigin(1.25,.2);


        this.physics.world.on('worldbounds', () => { this.sound.play("bounce") }, this);
        this.physics.world.on('worldbounds', worldBounce, this);

        //set up obstacles physics
        this.walls = this.add.group();
        {
            //create each walls for the level
            this.walls.add(new Obstacle(this, 0, 0, 'wall').setOrigin(0, 0).setScale(4.6, .75));
        }
        this.physics.add.collider(this.player, this.walls, () => { this.sound.play("bounce") }, null, this);
        this.physics.add.collider(this.player, this.walls, objectBounce, null, this);

        //set up hill physics
        this.hills = this.add.group();
        {
            this.hills.add(new Hill(this, Phaser.Math.Between(100, game.config.width - 100),
                Phaser.Math.Between(300, game.config.height - 100), 'hill',
                Phaser.Math.Between(.05, .35)));
        }
        this.push = this.physics.add.overlap(this.player, this.hills, pushOverlap, null, this);

        //set up ravine phsyics
        this.ravines = this.add.group();
        {
            //create a ravine in the hole
            this.ravines.add(new Ravine(this, Phaser.Math.Between(100, game.config.width - 100),
                Phaser.Math.Between(300, game.config.height - 100), 'ravine',
                Phaser.Math.Between(.05, .35)));
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
            "Left Click to use object type.\n(1) or (2) to change.\nCurrent object type: " + this.mouseType,
            textConfig).setOrigin(.5);
        this.add.text(centerX + game.config.width / 3, game.config.height / 15,
            "\n(1) Hill\n(2) Ravine",
            textConfig).setOrigin(.5);
    }


    update() {
        this.player.update();

        //keyboard controls for pause and restart
        if (Phaser.Input.Keyboard.JustDown(keyP)) {
            this.sound.play("wipe");
            if(game.input.mousePointer.x <= game.config.width && game.input.mousePointer.y <= game.config.height) {
                this.player.body.reset(game.input.mousePointer.x, game.input.mousePointer.y);
            } else {
                this.player.body.reset(this.startPosX, this.startPosY);
            }
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
        if (Phaser.Input.Keyboard.JustDown(keyONE)) {
            this.sound.play("rotate");
            this.mouseType = "Hill";
            this.mouseText.text = "Left Click to use object type.\n(1) or (2) to change.\nCurrent object type: " + this.mouseType;
        }
        if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
            this.sound.play("rotate");
            this.mouseType = "Ravine";
            this.mouseText.text = "Left Click to use object type.\n(1) or (2) to change.\nCurrent object type: " + this.mouseType;
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