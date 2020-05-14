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
            //create each walls for the level
            var floor = this.physics.add.sprite(20, 250, 'wall').setOrigin(0, 0);
            floor.body.setImmovable(true);
            floor.body.setGravity(false);
            this.walls.add(floor);
        }
        this.physics.add.collider(this.player, this.walls, this.objectBounce, null, this);

        //set up hill physics
        this.hills = this.add.group();
        {
            var mound = this.physics.add.sprite(750, 205, 'ball').setOrigin(.5).setCircle(130).setScale(.75, .75);
            mound.setTint('#000');
            mound.alpha = .75;
            mound.body.setImmovable(true);
            mound.body.setGravity(false);
            this.hills.add(mound)
        }
        this.push = this.physics.add.overlap(this.player, this.hills, this.pushOverlap, null, this);
        
        //set up ravine phsyics
        this.ravines = this.add.group();
        {
            //create a ravine in the hole
            var hole = this.physics.add.sprite(400, 400, 'ball').setOrigin(.5).setCircle(130).setScale(.75, .75);
            hole.setTint("#FFF");
            hole.alpha = .75;
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
        // roll over for angles to keep between 0 and 2*Math.PI
        if(this.player.rotation % (2*Math.PI) > 0) {
            this.player.rotation -= (2*Math.PI);
        } else if(this.player.rotation < 0) {
            this.player.rotation += (2*Math.PI);
        }

        //charge and hit ball by holding and realeasing up key
        if (Phaser.Input.Keyboard.JustUp(keyUP)){
            //hot the ball with velocity proportional to charge time
            //this.sound.play("ballHit");
            this.player.body.stop();
            this.physics.velocityFromRotation(this.player.rotation, this.ballSpeed*100, this.player.body.acceleration);
            this.ballSpeed = 0;
        } else if(this.player.body.touching.none) {
            //if no forces acting on player, reset acceleration
            this.player.body.setAcceleration(0);
        }
        //charge hit while key is down
        if (keyUP.isDown){
            //this.sound.play("chargeHit");
            this.ballSpeed++;
        }

        //rotate the direction the ball is facing
        if(keyLEFT.isDown) {
            //this.sound.play("rotate");
            this.player.rotation -= Math.PI/100;
        } 
        if(keyRIGHT.isDown) {
            //this.sound.play("rotate");
            this.player.rotation += Math.PI/100;
        }

        //keyboard controls for pause and restart
        if(Phaser.Input.Keyboard.JustDown(keyR)) {
            //this.sound.play("wipe");
            this.player.body.reset(100, 100);
        }

        //mouse controls for terrain manipulation
        if(game.input.mousePointer.isDown){
            this.singleClick++;
        } else if(!(game.input.mousePointer.isDown)){
            this.singleClick = 0;
        }
    }

    //angle adjustment for bouncing off world bounds
    worldBounce() {
        if(this.player.y - this.player.body.height/2 - 5 <= 0 || this.player.y + this.player.body.height/2 + 5 >= game.config.height) {
            //if player ouces off top or bottom walls, adjust angle accordingly
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
            //if player ouces off left or right walls, adjust angle accordingly
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

    //angle adjustment for bouncing off objects
    objectBounce(player, object) {
        if(this.player.y - this.player.body.height/2 - 5 <= object.y + object.body.height || 
                this.player.y + this.player.body.height/2 + 5 >= object.y) {
            //if player ouces off top or bottom of object, adjust angle accordingly
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
            //if player ouces off left or right of object, adjust angle accordingly
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

    //overlapping with ravines should pull the player towards the center while changing momentum
    pullOverlap(player, ravine) {
        //get the angle towards the center of the ravine
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, ravine.x, ravine.y);
        //adjust player angle towards ravine center
        if(angle < this.player.rotation) {
            this.player.rotation -= Math.PI/200;
        } else if(angle > this.player.rotation) {
            this.player.rotation += Math.PI/200;
        }
        //slightly alter momentum based on rotation
        this.physics.velocityFromRotation(this.player.rotation, 20, this.player.body.acceleration);
    }

    //overlapping with hills should push the player away from the center while changing momentum
    pushOverlap(player, hill) {
        //get the angle away from the center of the hill
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, hill.x, hill.y);
        angle+= Math.PI;
        //adjust player angle away from hill center
        if(angle < this.player.rotation) {
            this.player.rotation -= Math.PI/200;
        } else if(angle > this.player.rotation) {
            this.player.rotation += Math.PI/200;
        }
        //slightly alter momentum based on rotation
        this.physics.velocityFromRotation(this.player.rotation, 20, this.player.body.acceleration); 
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