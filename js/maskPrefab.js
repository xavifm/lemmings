class maskPrefab extends Phaser.GameObjects.Sprite
{

    constructor(_scene,_positionX,_positionY,_spriteTag)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5, .5);
    }

    preUpdate(time, delta)
    {
        this.body.setSize(1, 1);
        this.body.allowGravity = false;
        this.body.immovable = true;
        super.preUpdate(time, delta)
    }
}