class lemmingPrefab extends Phaser.GameObjects.Sprite
{
    index;
    constructor(_scene,_positionX,_positionY,_spriteTag, posNum)
    {
        gamePrefs.umbrella[posNum] = false;
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5, .5);
        this.anims.play('walk',true);
        gamePrefs.walking[posNum] = true;
        this.depth = 1;
        const Kscene = this.scene.scene.get("gameState");
        this.index = posNum;
        Kscene.physics.add.overlap(this, Kscene.bullets, function(){
            gamePrefs.touchingGround[posNum] = true; 
            if(gamePrefs.digging[posNum]) 
                Kscene.createMask(gamePrefs.xpos[posNum], gamePrefs.ypos[posNum]);  
        });
        Kscene.physics.add.overlap(this, Kscene.wallsGroup, function(){
            if(!gamePrefs.flipX[posNum])
            gamePrefs.flipX[posNum] = true;
            else
            gamePrefs.flipX[posNum] = false;
            
        });
        Kscene.physics.add.overlap(this, Kscene.maskGroup, function(){
            gamePrefs.fallingInsideATunnel[posNum] = true;
            gamePrefs.touchingGround[posNum] = false;
        });

        Kscene.physics.add.overlap(this, Kscene.doors, function() {
            gamePrefs.finished[posNum] = true;
        });
    }

    preUpdate(time, delta)
    {
        gamePrefs.xpos[this.index] = this.body.x;
        gamePrefs.ypos[this.index] = this.body.y;
        this.flipX = gamePrefs.flipX[this.index];
        this.walking = gamePrefs.walking[this.index];
        this.digging = gamePrefs.digging[this.index];
        this.umbrella = gamePrefs.umbrella[this.index];
        
        this.body.setVelocityX(0);
        this.body.maxVelocity.y = 50;

        //Moure en el sentit de l'sprite quan estigui tocant el terra
        if(!this.flipX && gamePrefs.touchingGround[this.index] && this.walking) 
        {
            this.body.setVelocityY(-1);
            this.body.setVelocityX(50);
        }
        else if(gamePrefs.touchingGround[this.index] && this.walking)
        {
            //this.Sprite.stop();
            this.body.setVelocityY(-1);
            this.body.setVelocityX(-50); 
        }

        if(this.body.velocity.y > 30 && !this.digging && this.umbrella) 
        {
            if(this.body.velocity.y < 35)
            this.anims.play('fallOpenUmbrella', true);
            else
            this.anims.play('fallUmbrellaOpened', true);
        }
        else if(!this.digging)
        {
            this.anims.play('walk',true);
        }
        
        //Override quan estigui tocant el terra i fent l'animació 'dig'
        if(gamePrefs.touchingGround[this.index] && this.digging)
        {
            this.anims.play('dig',true);
            this.body.setVelocityX(0);
            this.body.setVelocityY(25);
        }
        else if(!gamePrefs.touchingGround[this.index] && this.body.velocity.y > 30 && this.digging) 
        {
            this.anims.play('walk',true);
            gamePrefs.digging[this.index] = false;
            gamePrefs.walking[this.index] = true;
        }

        gamePrefs.touchingGround[this.index] = false; 
        gamePrefs.fallingInsideATunnel[this.index] = false;
        
        if(gamePrefs.finished[this.index]) 
        {
            this.body.maxVelocity.y = 99999999;
            this.body.setVelocityY(99999999);
        }

        super.preUpdate(time, delta)
    }
}