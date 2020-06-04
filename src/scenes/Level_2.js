class Level_2 extends Phaser.Scene {
    constructor() {
        super("level_2Scene");
    }

    preload() {
        //console.log("in level 2");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
        this.load.image('background2', './assets/Level2background.png');
        this.load.image('hill', './assets/mountain.png');
        this.load.image('ravine', './assets/ravine.png');
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
        this.mouseType = "None";
        this.startPosX = 100;
        this.startPosY = 250;
        this.endPosX = 750;
        this.endPosY = 550;

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
        this.bounceSound = this.sound.add("bounce");
        this.bounceSound.volume = 0;
        this.bounceSound.loop = true;
        this.bounceSound.play();

        //key bindings for interface
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //set up map background
        this.add.sprite(0, 0, 'background2').setOrigin(0, 0).setScale(1.1, 1);

        //set up player physics
        this.player = new Player(this, this.startPosX, this.startPosY, 'distortionAtlas', keyUP,
            keyRIGHT, keyLEFT, false, 'roll1');
        this.putter = this.add.sprite(this.player.x,this.player.y,'distortionAtlas','swing1');

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

        //set up obstacles physics
        this.walls = this.add.group();
        {
            //create each walls for the level
            var floorFrame = new Obstacle(this, 0, 0, 'wall').setOrigin(0, 0).setScale(4.6, .75);
            floorFrame.alpha = 1;
            this.walls.add(floorFrame);

            var floor3 = new Obstacle(this, 0, 400, 'wall').setOrigin(0, 0).setScale(2.3, 1);
            this.walls.add(floor3);

            var floor4 = new Obstacle(this, 360, 450, 'wall').setOrigin(0, 0).setScale(.75, 1.75);
            this.walls.add(floor4);
        }
        this.physics.add.collider(this.player, this.walls, () => {
            this.bounceSound.volume = .75;
            this.time.addEvent({
                delay: 750,
                callback: () => { this.bounceSound.volume = 0 },
                loop: false,
                callbackScope: this
            });
        }, null, this);
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
            //create a ravine in the hole to pull the ball in
            this.ravines.add(new Ravine(this, this.endPosX, this.endPosY, 'ravine', .4, 140));
        }
        this.pull = this.physics.add.overlap(this.player, this.ravines, pullOverlap, null, this);

        //set up level goal
        this.goal = new Hole(this, this.endPosX, this.endPosY, 'hole', 2);
        this.win = this.physics.add.overlap(this.player, this.goal, toNextLevel, null, this);
        
        //move ball to top of render
        this.player.depth = this.goal.depth+1;
        this.putter.depth = this.player.depth+1;

        //tutorial text for Level_2
        let textConfig = {
            fontFamily: "Courier",
            fontSize: "32px",
            color: "#000",
            backgroundColor: "#AAA",
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
        //fading tutorial text
        textConfig.backgroundColor = null;
        textConfig.fontSize = "18px";
        this.fadeText1 = this.add.text(this.player.x + 30, this.player.y - textSpacer, "(←) and (→) to turn",
            textConfig).setOrigin(.5);
        this.fadeText2 = this.add.text(this.player.x + 3 * textSpacer, this.player.y + 5, "Hold (↑) to charge",
            textConfig).setOrigin(.5);
        this.fadeText3 = this.add.text(this.player.x + 30, this.player.y + textSpacer, "Release (↑) to fire",
            textConfig).setOrigin(.5);
        this.fadeDelay = false;
        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.fadeDelay = true;
            },
            loop: false,
            callbackScope: this
        });

        //permanent control display
        this.add.text(centerX - game.config.width / 3, game.config.height / 15,
            "(←) / (→)  to angle.\nHold (↑) to charge.\nRelease (↑) to swing.",
            textConfig).setOrigin(.5);
    }


    update() {
        this.player.update();

        //fade out text slowly
        if (this.fadeText1.alpha > 0 && this.fadeDelay) {
            this.fadeText1.alpha -= .005;
            this.fadeText2.alpha -= .005;
            this.fadeText3.alpha -= .005;
        }

        //keyboard controls for pause and restart
        if (Phaser.Input.Keyboard.JustDown(keyP)) {
            this.sound.play("wipe");
            this.player.body.reset(this.startPosX, this.startPosY);
            this.player.body.setEnable(false);
            this.player.rotation = 0;
            this.player.body.setEnable(false);
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
    }
}