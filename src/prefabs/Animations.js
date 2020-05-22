function createAnims(scene){
   scene.anims.create({
       key: 'mountain',
       frameRate:5,
       frames: scene.anims.generateFrameNames('distortionAtlas', {prefix: 'mountain', end: 4}),
       repeat: 5
   }) ;

    scene.anims.create({
        key: 'ravine',
        frameRate:5,
        frames: scene.anims.generateFrameNames('distortionAtlas', {prefix: 'rav', end: 4}),
        repeat: 5
    }) ;
}