class Hole extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture,level) {
        super(scene, x, y, texture,level);
        this.scene = scene;
        this.level = level;
        //set physics properties
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(.5).setCircle(30, 120, 120).setScale(.4, .4);
        this.body.updateCenter();
        this.body.setImmovable(true);
        this.body.setGravity(false);
    }

    update() {
        
    }

}