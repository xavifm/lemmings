class lemmingPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene,_positionX,_positionY,_spriteTag)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5, 0);
        this.anims.play('walk',true);
        const Kscene = this.scene.scene.get("gameState");
        Kscene.physics.add.overlap(this, Kscene.bullets, function(){
            gamePrefs.touchingGround = true;
        });
    }

    preUpdate(time, delta)
    {
        if(this.body.x <= 2 || this.body.x >= 720) 
        {
            if(!this.flipX)
            this.flipX = true;
            else
            this.flipX = false;
        }
        if(!this.flipX && gamePrefs.touchingGround) 
        {
            this.body.setVelocityX(50);
        }
        else if(gamePrefs.touchingGround)
        {
            this.body.setVelocityX(-50); 
        }
        super.preUpdate(time, delta)
    }
}