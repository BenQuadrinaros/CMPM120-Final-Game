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
        this.ballSpeed = 0;

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
        this.player.setCollideWorldBounds(true, .9, .9);
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', this.worldBounce, this);
        this.player.setBounce(.75);
        this.player.body.setGravity(false);
        this.player.setMaxVelocity(200);

        //set up map obstacles and physics
        this.walls = this.add.group();
        {
            //create each wall in the level
            var floor = this.physics.add.sprite(20, 250, 'wall').setOrigin(0, 0);
            floor.body.setImmovable(true);
            floor.body.setGravity(false);
            this.walls.add(floor);
        }
        this.physics.add.collider(this.player, this.walls, this.objectBounce, null, this);

        //set up hill physics
        this.hills = this.add.group();
        this.push = this.physics.add.overlap(this.player, this.hills, this.pushOverlap, null, this);
        
        //set up ravine phsyics
        this.ravines = this.add.group();
        {
            //create a ravine in the hole
            var hole = this.physics.add.sprite(250, 500, 'ball').setOrigin(0, 0).setOrigin(.5).setCircle(135).setScale(.4, .4);
            hole.setTint("#FFF");
            hole.alpha = .25;
            hole.body.setImmovable(true);
            hole.body.setGravity(false);
            this.ravines.add(hole);
        }
        this.pull = this.physics.add.overlap(this.player, this.ravines, this.pullOverlap, null, this);

        //set up level goal
        this.goal = this.physics.add.sprite(75, 550, 'ball').setOrigin(.5).setCircle(40, 90, 90).setScale(.4, .4);
        this.goal.body.updateCenter();
        this.goal.body.setImmovable(true);
        this.goal.body.setGravity(false);
        this.win = this.physics.add.overlap(this.player, this.goal, this.toNextLevel, null, this);
    }


    update() {
        // roll over for angles
        if(this.player.rotation % (2*Math.PI) > 0) {
            this.player.rotation -= (2*Math.PI);
        } else if(this.player.rotation < 0) {
            this.player.rotation += (2*Math.PI);
        }

        //charge and hit ball by holding and realeasing up key
        if (Phaser.Input.Keyboard.JustUp(keyUP)){
            this.player.body.stop();
            console.log(100*this.ballSpeed);
            this.physics.velocityFromRotation(this.player.rotation, this.ballSpeed*100, this.player.body.acceleration);
            this.ballSpeed = 0;

        } else {
            this.player.setAcceleration(0);
        }
        console.log(Phaser.Input.Keyboard.JustUp(keyUP));
        //charge hit
        if (keyUP.isDown){
            this.ballSpeed++;
        }

        //rotate the direction the ball is facing
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

    worldBounce() {
        if(this.player.y - this.player.height/2 <= 0 || this.player.y + 2*this.player.height >= game.config.height) {
            if(0 < this.player.rotation <= Math.PI/2) {
                let temp = this.player.rotation;
                this.player.rotation = -temp;
            } else if(Math.PI/2 < this.player.rotation <= Math.PI) {
                let temp = Math.PI - this.player.rotation;
                this.player.rotation = Math.PI + temp;
            } else if(Math.PI < this.player.rotation <= 3*Math.PI/2) {
                let temp = this.player.rotation - Math.PI;
                this.player.rotation = Math.PI/2 + temp;
            } else if(3*Math.PI/2 < this.player.rotation <= 2*Math.PI) {
                let temp = 2*Math.PI - this.player.rotation;
                this.player.rotation = temp;
            }
        } else {
            if(0 < this.player.rotation <= Math.PI/2) {
                let temp = this.player.rotation;
                this.player.rotation = Math.PI - temp;
            } else if(Math.PI/2 < this.player.rotation <= Math.PI) {
                let temp = Math.PI - this.player.rotation;
                this.player.rotation = 2*Math.PI + temp;
            } else if(Math.PI < this.player.rotation <= 3*Math.PI/2) {
                let temp = this.player.rotation - Math.PI;
                this.player.rotation = 2*Math.PI - temp;
            } else if(3*Math.PI/2 < this.player.rotation <= 2*Math.PI) {
                let temp = 2*Math.PI - this.player.rotation;
                this.player.rotation = Math.PI + temp;
            }
        }
    }

    objectBounce(player, object) {
        if(this.player.y <= object.y + object.height || this.player.y + this.player.height >= object.y) {
            if(0 < this.player.rotation <= Math.PI/2) {
                let temp = this.player.rotation;
                this.player.rotation = -temp;
            } else if(Math.PI/2 < this.player.rotation <= Math.PI) {
                let temp = Math.PI - this.player.rotation;
                this.player.rotation = Math.PI + temp;
            } else if(Math.PI < this.player.rotation <= 3*Math.PI/2) {
                let temp = this.player.rotation - Math.PI;
                this.player.rotation = Math.PI/2 + temp;
            } else if(3*Math.PI/2 < this.player.rotation <= 2*Math.PI) {
                let temp = 2*Math.PI - this.player.rotation;
                this.player.rotation = temp;
            }
        } else {
            if(0 < this.player.rotation <= Math.PI/2) {
                let temp = this.player.rotation;
                this.player.rotation = Math.PI - temp;
            } else if(Math.PI/2 < this.player.rotation <= Math.PI) {
                let temp = Math.PI - this.player.rotation;
                this.player.rotation = temp;
            } else if(Math.PI < this.player.rotation <= 3*Math.PI/2) {
                let temp = this.player.rotation - Math.PI;
                this.player.rotation = 2*Math.PI - temp;
            } else if(3*Math.PI/2 < this.player.rotation <= 2*Math.PI) {
                let temp = 2*Math.PI - this.player.rotation;
                this.player.rotation = Math.PI + temp;
            }
        }
    }

    clearMovement() {
        this.player.setAcceleration(0);
        this.player.setAngularVelocity(0);
    }

    pullOverlap(player, ravine) {
        console.log("overlaps with ravine");
        //get the angle towards the center of the ravine
        let angle = Phaser.Math.Angle.Between(this.player.x + player.width/2, this.player.y + player.height/2, 
            ravine.x + ravine.width/2, ravine.y + ravine.height/2);
        //adjust player angle towards ravine center
        console.log("angle to ravine center: " + (angle-this.player.rotation));
        if(angle < this.player.rotation) {
            this.player.setAngularVelocity(-45);
            console.log("angle counterclockwise");
        } else if(angle > this.player.rotation) {
            this.player.setAngularVelocity(45);
            console.log("angle clockwise");
        } else {
            this.player.setAngularVelocity(0);
        }
        //slightly alter momentum
        this.physics.velocityFromRotation(player.rotation, 500, this.player.body.acceleration);
        console.log("faster");
    }

    pushOverlap(player, hill) {

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