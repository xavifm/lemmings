class terrainPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene,_positionX,_positionY,_spriteTag)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5, 0);
    }

    preUpdate(time, delta)
    {
        this.body.allowGravity = false;
        this.body.immovable = true;
        super.preUpdate(time, delta)
    }
}