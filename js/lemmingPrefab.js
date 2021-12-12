class lemmingPrefab extends Phaser.GameObjects.Sprite
{
    index;
    errorTimer;
    _sceneName;
    gracePeriod;
    constructor(_scene,_positionX,_positionY,_spriteTag, posNum, sceneName)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        this._sceneName = sceneName;
        this.gracePeriod = 0;
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5, .5);
        this.anims.play('fallWithoutUmbrella',true);
        gamePrefs.finished[posNum] = false
        gamePrefs.falling[posNum] = true;
        gamePrefs.walking[posNum] = false;
        gamePrefs.touchingGround[posNum] = false;
        gamePrefs.fallingInsideATunnel[posNum] = false;
        this.errorTimer = 6;
        this.depth = 1;
        const Kscene = this.scene.scene.get(sceneName);
        this.index = posNum;
        Kscene.physics.add.overlap(this, Kscene.bullets, function(){
            gamePrefs.touchingGround[posNum] = true; 
            if(gamePrefs.digging[posNum]) 
                Kscene.createMask(gamePrefs.xpos[posNum] + 10, gamePrefs.ypos[posNum]);  
        });
        Kscene.physics.add.overlap(this, Kscene.wallsGroup, function(){
            if(!gamePrefs.flipX[posNum])
            gamePrefs.flipX[posNum] = true;
            else
            gamePrefs.flipX[posNum] = false;
            
        });
        Kscene.physics.add.overlap(this, Kscene.maskGroup, function(){
            gamePrefs.falling[posNum] = true;
            gamePrefs.fallingInsideATunnel[posNum] = true;
            gamePrefs.touchingGround[posNum] = false;
        });

        Kscene.physics.add.overlap(this, Kscene.doors, function() {
            gamePrefs.finished[posNum] = true;
            for(let index = 0 ; index < gamePrefs.finished.length ; index++) 
            {
                if(!gamePrefs.finished[index])
                    break;
                if(index == gamePrefs.finished.length-1)
                Kscene.scene.start('scene2');
            }
        });
    }

    preUpdate(time, delta)
    {
        gamePrefs.xpos[this.index] = this.body.x;
        gamePrefs.ypos[this.index] = this.body.y;
        this.flipX = gamePrefs.flipX[this.index];
        this.walking = gamePrefs.walking[this.index];
        this.digging = gamePrefs.digging[this.index];
        this.falling = gamePrefs.falling[this.index];
        this.umbrella = gamePrefs.umbrella[this.index];
        

        if(!gamePrefs.finished[this.index] && !gamePrefs.death[this.index]) 
        {
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

            if(!this.digging && !this.falling)
            {  
                this.body.setSize(6, 10);
                this.anims.play('walk',true);
            }

            if(!gamePrefs.touchingGround[this.index])
                this.errorTimer += 0.1;
            else
                this.errorTimer = 0;

            if(!gamePrefs.touchingGround[this.index] && this.errorTimer > 10)
            {
                gamePrefs.falling[this.index] = true;
                gamePrefs.walking[this.index] = false;
                if(gamePrefs.startFallPosition[this.index] === undefined)
                {
                    gamePrefs.startFallPosition[this.index] = gamePrefs.ypos[this.index];
                }
                else
                {
                    gamePrefs.currentFallPosition[this.index] = gamePrefs.ypos[this.index];
                }
                if(Phaser.Math.Distance.Between(0, gamePrefs.startFallPosition[this.index], 0, gamePrefs.currentFallPosition[this.index]) < 50)
                {
                    this.body.setSize(6, 10);
                    this.anims.play('fallWithoutUmbrella', true);
                }
                else if(Phaser.Math.Distance.Between(0, gamePrefs.startFallPosition[this.index], 0, gamePrefs.currentFallPosition[this.index]) >= 50 && this.umbrella) 
                {
                    if (this.anims.currentAnim.key !== 'fallOpenUmbrella' && this.anims.currentAnim.key !== 'fallUmbrellaOpened')
                    {
                        this.body.setSize(9, 16);
                        this.anims.play('fallOpenUmbrella', true);       
                    }
                                    
                    if(this.anims.currentAnim.key === 'fallOpenUmbrella' && this.anims.currentFrame.index === 3  && this.anims.currentAnim.key !== 'fallUmbrellaOpened')
                    {
                        this.body.setSize(9, 16);
                        this.anims.play('fallUmbrellaOpened', true);
                    }
                }
            }
            else 
            {
                if(this.anims.currentAnim.key === 'fallWithoutUmbrella' && gamePrefs.touchingGround[this.index] && this._sceneName == "scene2" && this.gracePeriod > 50) 
                gamePrefs.death[this.index] = true;
                else if(this._sceneName == "scene2") 
                this.gracePeriod += 0.5;

                gamePrefs.startFallPosition[this.index] = gamePrefs.ypos[this.index];
                gamePrefs.falling[this.index] = false;
                gamePrefs.walking[this.index] = true;
            }
            
            //Override quan estigui tocant el terra i fent l'animació 'dig'
            if(gamePrefs.touchingGround[this.index] && this.digging)
            {
                this.body.setSize(11, 12);
                this.anims.play('dig',true);
                this.body.setVelocityX(0);
                this.body.setVelocityY(25);
            }
            if(!gamePrefs.touchingGround[this.index] && this.errorTimer > 5 && this.digging) 
            {
                this.anims.play('fallWithoutUmbrella',true);
                
                gamePrefs.digging[this.index] = false;
                gamePrefs.falling[this.index] = true;
            }

            gamePrefs.touchingGround[this.index] = false; 
            //if(this.errorTimer > 5)
            gamePrefs.fallingInsideATunnel[this.index] = false;
        }  
        else if(gamePrefs.finished[this.index]) 
        {
            this.body.allowGravity = false;
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            if(this.anims.currentAnim.key !== 'exit' && !gamePrefs.death[this.index])
            {
                this.body.setSize(5, 13);
                this.anims.play('exit', true);
            }
                

            if(this.anims.currentFrame.index === 7)
            {
                this.body.maxVelocity.y = 99999999;
                this.body.setVelocityY(99999999);
            }
        }

        if(gamePrefs.death[this.index])
        {
            this.body.allowGravity = false;
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            if(this.anims.currentAnim.key !== 'die')
            {
                this.body.setSize(16, 10);
                this.anims.play('die', true);
            }

            if(this.anims.currentFrame.index === 14)
            {
                gamePrefs.finished[this.index] = true;
                this.body.maxVelocity.y = 99999999;
                this.body.setVelocityY(99999999);
            }
        }

        super.preUpdate(time, delta)
    }
}