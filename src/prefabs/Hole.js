class Hole extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;

        //set physics properties
        scene.add.existing(this);
        scene.physics.add.existing(this)
        this.setOrigin(.5).setCircle(40, 90, 90).setScale(.4, .4);
        this.body.updateCenter();
        this.body.setImmovable(true);
        this.body.setGravity(false);
    }

    update() {
        
    }

}