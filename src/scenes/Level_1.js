class Level_1 extends Phaser.Scene {
    constructor() {
        super("level_1Scene");
    }

    preload() {
        console.log("in level 1");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
    }

    create() {
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESCAPE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.player = this.physics.add.sprite(0, 0, 'ball').setOrigin(0, 0).setCircle(135).setScale(.25, .25);
        this.wall = this.add.group();
        {
            var floor = this.physics.add.sprite(20, 300, 'wall').setOrigin(0, 0);
            console.log(floor);
            floor.body.immovable = true;
            floor.body.allowGravity = false;
            this.wall.add(floor);
        }
        this.player.body.angle = 0;
        this.player.body.allowDrag = true;
        this.player.body.drag = .75;
        this.player.body.collideWorldBounds = true;
    }


    update() {
        this.physics.add.collider(this.player,this.wall);

        if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.player.setVelocity(40*Math.cos(this.player.body.angle), 40*(-Math.sin(this.player.body.angle)));
        }
        if(keyLEFT.isDown) {
            this.player.body.angle += .1;
        }
        if(keyRIGHT.isDown) {
            this.player.body.angle -= .1;
        }

        if(Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
    }


}