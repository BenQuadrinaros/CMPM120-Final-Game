class Hill extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, scale, radius) {
        super(scene, x, y, texture);
        this.scene = scene;

        //set physics properties
        scene.add.existing(this);
        scene.physics.add.existing(this)
        this.setOrigin(.5).setCircle(radius).setScale(scale, scale);
        this.body.setImmovable(true);
        this.body.setGravity(false);
    }

    update() {

    }

}