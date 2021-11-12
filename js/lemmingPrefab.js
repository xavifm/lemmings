class lemmingPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene,_positionX,_positionY,_spriteTag)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5, 0);
        this.anims.play('walk',true);
    }

    preUpdate(time, delta)
    {
        this.body.setVelocityY(0); 
        var touchingGround = false;

        if(this.body.y >= config.height-50)
        touchingGround = true;

        if(this.body.x <= 2 || this.body.x >= 720) 
        {
            if(!this.flipX)
            this.flipX = true;
            else
            this.flipX = false;
        }
        if(!this.flipX && touchingGround) 
        {
            this.body.setVelocityX(50);
        }
        else if(touchingGround)
        {
            this.body.setVelocityX(-50); 
        }
        else 
        {
            this.body.setVelocityY(50); 
        }
        super.preUpdate(time, delta)
    }
}