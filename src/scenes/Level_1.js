class Level_1 extends Phaser.Scene {
    constructor() {
        super("level_1Scene");
    }

    preload() {
        //console.log("in level 1");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
    }

    create() {
        //misc set up
        this.cameras.main.setBackgroundColor("#5A5");
        this.singleClick = 0;

        //key bindings
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESCAPE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //set up player physics
        this.player = this.physics.add.sprite(100, 100, 'ball').setOrigin(.5).setCircle(135).setScale(.25, .25);
        this.player.setDamping(true);
        this.player.setDrag(.999);
        this.player.setCollideWorldBounds(true, .75, .75);
        this.player.setBounce(.75);
        this.player.body.setGravity(false);
        this.player.setMaxVelocity(200);

        //set up map obstacles and physics
        this.wall = this.add.group();
        {
            var floor = this.physics.add.sprite(20, 250, 'wall').setOrigin(0, 0);
            floor.body.setImmovable(true);
            floor.body.setGravity(false);
            this.wall.add(floor);
        }
        this.physics.add.collider(this.player, this.wall);

        //set up level goal
        this.goal = this.physics.add.sprite(75, 550, 'ball').setOrigin(.5).setCircle(40, 90, 90).setScale(.4, .4);
        this.goal.body.updateCenter();
        this.goal.body.setImmovable(true);
        this.goal.body.setGravity(false);
        this.win = this.physics.add.overlap(this.player, this.goal);
        this.win.collideCallback = () => {this.toNextLevel()};

        this.ballSpeed = 0;
    }


    update() {
        if (Phaser.Input.Keyboard.JustUp(keyUP)){
            this.player.body.stop();
            console.log(100*this.ballSpeed);
            this.physics.velocityFromRotation(this.player.rotation, this.ballSpeed*100, this.player.body.acceleration);
            this.ballSpeed = 0;

        } else {
            this.player.setAcceleration(0);
        }
            console.log(Phaser.Input.Keyboard.JustUp(keyUP));

        //keyboard controls for moving the player
        if (keyUP.isDown){
            this.ballSpeed++;

        }

        if(keyLEFT.isDown) {
            //this.sound.play("rotate");
            this.player.setAngularVelocity(-90);
        } else if(keyRIGHT.isDown) {
            //this.sound.play("rotate");
            this.player.setAngularVelocity(90);
        } else {
            this.player.setAngularVelocity(0);
        }

        //keyboard controls for pause and restart
        if(Phaser.Input.Keyboard.JustDown(keyR)) {
            //this.sound.play("wipe");
            this.scene.restart();
        }

        //mouse controls for terrain manipulation
        if(game.input.mousePointer.isDown){
            this.singleClick++;
        } else if(!(game.input.mousePointer.isDown)){
            this.singleClick = 0;
        }
    }

    //collision with hole
    toNextLevel() {
        this.player.body.stop();
        this.player.alpha = 0;
        //play animation for ball -> hole
        //this.sound.play("ballInHole");
        this.time.addEvent({
            delay:1300,
            callback: () => {this.scene.start("menuScene")},
            loop:false,
            callbackScope:this
        });
    }

}