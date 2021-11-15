class lemmingPrefab extends Phaser.GameObjects.Sprite
{
    index;
    constructor(_scene,_positionX,_positionY,_spriteTag, posNum)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5, 0);
        this.anims.play('walk',true);
        const Kscene = this.scene.scene.get("gameState");
        this.index = posNum;
        Kscene.physics.add.overlap(this, Kscene.bullets, function(){
            gamePrefs.touchingGround[posNum] = true;
        });
        Kscene.physics.add.overlap(this, Kscene.wallsGroup, function(){
            if(!gamePrefs.flipX[posNum])
            gamePrefs.flipX[posNum] = true;
            else
            gamePrefs.flipX[posNum] = false;
        });
    }

    preUpdate(time, delta)
    {
        this.flipX = gamePrefs.flipX[this.index];

        if(!this.flipX && gamePrefs.touchingGround[this.index]) 
        {
            this.body.setVelocityX(50);
        }
        else if(gamePrefs.touchingGround[this.index])
        {
            this.body.setVelocityX(-50); 
        }
        super.preUpdate(time, delta)
    }
}