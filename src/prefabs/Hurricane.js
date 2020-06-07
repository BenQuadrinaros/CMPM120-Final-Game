class Hurricane extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, direction, scale = .1, frame) {
        super(scene, x, y, texture, frame,direction);
        this.scene = scene;
        this.counter = 0;
        this.direction = direction;
        this.active = true;


        //set physics properties
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(.5, .5).setCircle(50).setScale(scale, scale);
    }

    update() {
        if (this.active) {
            if (this.counter > 130) {
                this.direction *= -1;
            }
            if (this.counter < 0) {
                this.direction *= -1;
            }
            this.x += this.direction;
            this.counter += this.direction;
        }
    }


}