class uiPrefab extends Phaser.GameObjects.Sprite
{
    _sceneIndex = 0;
    _uiPos;

    constructor(_scene,_positionX,_positionY,_spriteTag, sceneIndex, uiPos)
    {
        super(_scene,_positionX,_positionY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5, 0);
        this._sceneIndex = sceneIndex;
        this._uiPos = uiPos;
    }

    preUpdate(time, delta)
    {
        this.body.allowGravity = false;
        this.body.immovable = true;

        if(this._sceneIndex == 0) 
        {
            const Kscene = this.scene.scene.get("gameState");  
            
            if(Kscene.UIMode != this._uiPos) 
            {
                this.clearTint();
            } 
        }

        super.preUpdate(time, delta)
    }
}