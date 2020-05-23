class Ravine extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, scale) {
        super(scene, x, y, texture);
        this.scene = scene;

        //set physics properties
        scene.add.existing(this);
        scene.physics.add.existing(this)
        this.setOrigin(.5).setCircle(130, 20, 20).setScale(scale, scale).setInteractive();
        this.body.setImmovable(true);
        this.body.setGravity(false);
    }

    update() {

    }

}