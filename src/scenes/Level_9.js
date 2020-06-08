class Level_9 extends Phaser.Scene {
    constructor() {
        super("level_9Scene");
    }

    preload() {
        //console.log("in level 9");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
        this.load.image('background9', './assets/volcano_lvl9.jpg');
        this.load.image('hill', './assets/mountain.png');
        this.load.image('ravine', './assets/ravine.png');
        this.load.image('crab', './assets/crab.png');
        this.load.image('hole', './assets/hole.png');

        //load texture atlasii
        this.load.atlas('distortionAtlas', './assets/spritesheet.png', './assets/sprites.json');

        //load player assosciated audio
        this.load.audio("rotate", "./assets/angleTick.wav");
        this.load.audio("chargeHit", "./assets/shotIndicator.wav");
        this.load.audio("ballHit", "./assets/ballHit.wav");
        this.load.audio("ballInHole", "./assets/ballInHole.wav");
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
        this.startPosX = game.config.width / 2;
        this.startPosY = 9 * game.config.height / 10;
        this.endPosX = game.config.width / 2;
        this.endPosY = game.config.height / 5;

        //create mouse listener for terrain manipulation
        this.input.on('pointerdown', () => {
            if (this.mouseType == "Ravine") {
                //if left click, add ravine to group
                var temp = new Ravine(this, game.input.mousePointer.x, game.input.mousePointer.y, 'ravine', .01, 50);
                this.player.depth = temp.depth+1;
                this.putter.depth = this.player.depth+1;
                this.ravines.add(temp);
                temp.play("ravine");
                sizeIncrease(temp, true, this.mouse, this.time);
            } else if (this.mouseType == "Hill") {
                //if right click, add hill to group
                var temp = new Hill(this, game.input.mousePointer.x, game.input.mousePointer.y, 'hill', .01, 50);
                this.player.depth = temp.depth+1;
                this.putter.depth = this.player.depth+1;
                this.hills.add(temp);
                temp.play("mountain");
                sizeIncrease(temp, true, this.mouse, this.time);
            }
        });

        //create animations
        createAnims(this);

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
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);

        //set up map background
        this.add.sprite(0, 0, 'background9').setOrigin(0, 0).setScale(1.05, 1.05);

        //set up player physics
        this.player = new Player(this, this.startPosX, this.startPosY, 'distortionAtlas', keyUP,
            keyRIGHT, keyLEFT, false, 'roll1');
        this.putter = this.add.sprite(this.player.x,this.player.y,'distortionAtlas','swing1').setOrigin(1.25,.2);

        this.physics.world.on('worldbounds', () => { this.sound.play("bounce") }, this);
        this.physics.world.on('worldbounds', worldBounce, this);

        //set up obstacles physics
        this.walls = this.add.group();
        {
            //create each walls for the level
            this.ui = new Obstacle(this, 0, 0, 'wall').setOrigin(0, 0).setScale(4.6, .75);
            this.ui.alpha = 1;
            this.walls.add(this.ui);

            //create each walls for the level
            this.walls.add(new Obstacle(this, game.config.width / 2 + 25, 3 * game.config.height / 5 - 25,
                'wall').setOrigin(.5, .5).setScale(2, 1.85));

        }
        this.physics.add.collider(this.player, this.walls, () => { this.sound.play("bounce") }, null, this);
        this.physics.add.collider(this.player, this.walls, objectBounce, null, this);

        //set up hill physics
        this.hills = this.add.group();
        {
            //this.hills.add(new Hill(this, 750, 205, 'hill', .75))
        }
        this.push = this.physics.add.overlap(this.player, this.hills, pushOverlap, null, this);

        //set up ravine phsyics
        this.ravines = this.add.group();
        {
            //create a ravine in the hole
            this.ravines.add(new Ravine(this, this.endPosX, this.endPosY, 'ravine', .4, 140));
        }
        this.pull = this.physics.add.overlap(this.player, this.ravines, pullOverlap, null, this);

        //set up level goal
        this.goal = new Hole(this, this.endPosX, this.endPosY, 'hole', 9);
        this.win = this.physics.add.overlap(this.player, this.goal, toNextLevel, null, this);

        //set up crab
        this.storms = this.add.group();

        this.storm1 = new Hurricane(this, game.config.width / 10, game.config.height / 3 + 25,
            'distortionAtlas', .5, 1.5,'twister1').play('tornado');
        this.storms.add(this.storm1);
        this.storm2 = new Hurricane(this, game.config.width / 10, 2 * game.config.height / 3 + 75,
            'distortionAtlas', .5, 1.5,'twister1').play('tornado');
        this.storms.add(this.storm2);
        this.storm3 = new Hurricane(this, 8 * game.config.width / 10 - 30, game.config.height / 3 + 25,
            'distortionAtlas', .5, 1.5,'twister1').play('tornado');
        this.storms.add(this.storm3);
        this.storm4 = new Hurricane(this, 8 * game.config.width / 10 - 30, 2 * game.config.height / 3 + 75,
            'distortionAtlas', .5, 1.5,'twister1').play('tornado');
        this.storms.add(this.storm4);
        this.physics.add.collider(this.player, this.storms, null, null, this);
        
        //move ball to top of render
        this.player.depth = this.storm4.depth+1;
        this.putter.depth = this.player.depth+1;

        //tutorial text for Level_9
        let textConfig = {
            fontFamily: "Courier",
            fontSize: "18px",
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

        //permanent control display
        textConfig.color = "#000";
        this.add.text(centerX - game.config.width / 3, game.config.height / 15,
            "(←) / (→)  to angle.\nHold (↑) to charge.\nRelease (↑) to swing.",
            textConfig).setOrigin(.5);
        this.mouseText = this.add.text(centerX, game.config.height / 15,
            "Hold Left Click to use tools.\n(1) or (2) to select tool.\nCurrent tool type: " + this.mouseType,
            textConfig).setOrigin(.5);
        this.add.text(centerX + game.config.width / 3, game.config.height / 15,
            "\n(1) Hill\n(2) Ravine",
            textConfig).setOrigin(.5);
    }


    update() {
        this.player.update();
        this.storm1.update();
        this.storm2.update();
        this.storm3.update();
        this.storm4.update();

        //keyboard controls for pause and restart
        if (Phaser.Input.Keyboard.JustDown(keyP)) {
            this.sound.play("wipe");
            this.player.body.reset(this.startPosX, this.startPosY);
            this.crab1.body.reset(game.config.width / 10, game.config.height / 3 + 25);
            this.crab2.body.reset(game.config.width / 10, 2 * game.config.height / 3 + 75);
            this.crab3.body.reset(8 * game.config.width / 10 - 30, game.config.height / 3 + 25);
            this.crab4.body.reset(8 * game.config.width / 10 - 30, 2 * game.config.height / 3 + 75);
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
            this.mouseText.text = "Hold Left Click to use tools.\n(1) or (2) to select tool.\nCurrent tool type: " + this.mouseType;
        }
        if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
            this.sound.play("rotate");
            this.mouseType = "Ravine";
            this.mouseText.text = "Hold Left Click to use tools.\n(1) or (2) to select tool.\nCurrent tool type: " + this.mouseType;
        }
    }
}