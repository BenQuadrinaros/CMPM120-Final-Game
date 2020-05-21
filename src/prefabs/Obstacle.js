class Obstacle extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;

        //set physics properties
        scene.add.existing(this);
        scene.physics.add.existing(this)
        this.body.setImmovable(true);
        this.body.setGravity(false);
    }

    update() {

    }

}