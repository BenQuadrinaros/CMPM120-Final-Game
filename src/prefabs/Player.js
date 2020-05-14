class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, keyUP, keyLeft, keyRight) {
        super(scene, x, y, texture);
        this.keyUp = keyUP;
        this.keyLeft = keyLeft;
        this.keyRight = keyRight;
        this.ballSpeed = 0;
        this.scene = scene;
        this.shotIndicate = this.scene.add.rectangle(x, y, 0, 5, 0xFACADE).setOrigin(0, 0);


        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDamping(true);
        this.setDrag(.999);
        this.setCollideWorldBounds(true, .9, .9);
        this.body.onWorldBounds = true;
        this.setBounce(.75);
        this.body.setGravity(false);
        this.setMaxVelocity(200);
    }

    update() {
        this.shotIndicate.x = this.x;
        this.shotIndicate.y = this.y;

        // roll over for angles to keep between 0 and 2*Math.PI
        if (this.rotation % (2 * Math.PI) > 0) {
            this.rotation -= (2 * Math.PI);
        } else if (this.rotation < 0) {
            this.rotation += (2 * Math.PI);
        }

        //charge and hit ball by holding and realeasing up key
        if (Phaser.Input.Keyboard.JustUp(this.keyUp)) {
            this.shotIndicate.width = 0;
            //hot the ball with velocity proportional to charge time
            //this.sound.play("ballHit");
            this.body.stop();
            this.scene.physics.velocityFromRotation(this.rotation, this.ballSpeed * 100, this.body.acceleration);
            this.ballSpeed = 0;
        } else if (this.body.touching.none) {
            //if no forces acting on player, reset acceleration
            this.body.setAcceleration(0);
        }
        //charge hit while key is down
        if (this.keyUp.isDown) {
            //this.sound.play("chargeHit");
            //see if ball speed is less than max velocity - 200
            if (this.ballSpeed < 200) {
                this.shotIndicate.width = this.ballSpeed;
                this.ballSpeed++;
            }
        }

        //rotate the direction the ball is facing
        if (this.keyRight.isDown) {
            //this.sound.play("rotate");
            this.shotIndicate.rotation -= Math.PI / 100;
            this.rotation -= Math.PI / 100;
        }
        if (this.keyLeft.isDown) {
            //this.sound.play("rotate");
            this.shotIndicate.rotation += Math.PI / 100;
            this.rotation += Math.PI / 100;
        }

    }

}