//physics operations for levels

//overlapping with ravines should pull the player towards the center while changing momentum
function pullOverlap(player, ravine) {
    //get the angle towards the center of the ravine
    let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, ravine.x, ravine.y);
    //adjust player angle towards ravine center
    if (angle < this.player.rotation) {
        this.player.rotation -= Math.PI / 200;
    } else if (angle > this.player.rotation) {
        this.player.rotation += Math.PI / 200;
    }
    //slightly alter momentum based on rotation
    this.physics.velocityFromRotation(angle, 100*ravine.scale, this.player.body.acceleration);
}

//overlapping with hills should push the player away from the center while changing momentum
function pushOverlap(player, hill) {
    //get the angle away from the center of the hill
    let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, hill.x, hill.y);
    angle += Math.PI;
    //adjust player angle away from hill center
    if (angle < this.player.rotation) {
        this.player.rotation -= Math.PI / 200;
    } else if (angle > this.player.rotation) {
        this.player.rotation += Math.PI / 200;
    }
    //slightly alter momentum based on rotation
    this.physics.velocityFromRotation(angle, 100*hill.scale, this.player.body.acceleration);
}

//collision with hole
function toNextLevel(player, hole) {
    console.log(hole.level);
    let nextLevel = hole.level+1;
    this.player.play("score");
    this.player.body.stop();
    this.player.body.setEnable(false);
    this.player.alpha = 0;
    //play animation for ball -> hole
    this.music.stop();
    levelsAvailable.push(nextLevel);
    this.sound.play("ballInHole");
    this.time.addEvent({
        delay: 2000,
        callback: () => {
            this.scene.start("level_"+nextLevel+"Scene");
        },
        loop: false,
        callbackScope: this
    });
}


function sizeIncrease(object, looping,mouseB,time) {
    //increase size as long as the correct mouse button is held down
    object.scale += .01;
    console.log("make it bigger");
    if (!mouseB.leftButtonDown()) {
        looping = false;
        console.log("wrong key (left)");
    }
    time.addEvent({
        delay:100,
        callback: () => {if(looping){sizeIncrease(object, looping,mouseB,time);}},
        loop:false,
        callbackScope:this
    });
}

//angle adjustment for bouncing off world bounds
function worldBounce() {
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

//angle adjustment for bouncing off objects
function objectBounce(player, object) {
    if (this.player.y - this.player.body.height / 2 - 5 <= object.y + object.body.height ||
        this.player.y + this.player.body.height / 2 + 5 >= object.y) {
        //if player bounces off top or bottom side of object, adjust angle accordingly
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
        //if player bounces off left or right side of object, adjust angle accordingly
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