class Play extends Phaser.Scene {
    constructor() {

        super("level_1Scene");
    }

    preload() {
        console.log("in level 1");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
    }

    create() {
        this.physics.world.gravity.y = 100;
        this.player = this.physics.add.sprite(0, 0, 'ball').setOrigin(0, 0).setCircle(100, 100).setScale(.4, .4);
        this.wall = this.add.group();
        {
            var floor = this.physics.add.sprite(20, 300, 'wall').setOrigin(0, 0);
            floor.body.immovable = true;
            floor.body.allowGravity = false;
            this.wall.add(floor);

        }


    }


    update() {
        this.physics.add.collider(this.player,this.wall);
        this.player.body.velocity.x = 0;

    }


}