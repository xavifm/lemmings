class gameState extends Phaser.Scene
{
    constructor()
    {
        super(
        {
            key:"gameState"
        });
    }
    preload()
    {
        this.cameras.main.setBackgroundColor("#000031");
        this.load.spritesheet('lemming','assets/lemmings_sp.png',
        {frameWidth:20,frameHeight:10});
        this.load.image('tempTerrain','assets/tempTerrain.png');
      
    }
    create()
    { 
       this.timerSpawn = Math.random() * (4 - 1) + 1;

       this.loadAnimations();
       this.enemies = this.physics.add.group();
       this.bullets = this.physics.add.group();
       this.wallsGroup = this.physics.add.group();
       for (let index = 0; index < 10; index++) 
       {
        this.createLemming(80+index*50, 200, index);   
       }
       
       for(let index = 0; index < 10; index++)
       {
        this.createTerrain(45+index*90, 400, false);
       }
       for(let index = 0; index < 2; index++)
       {
        this.createTerrain(index*800, 310, true);
       }
       
       this.physics.add.collider(this.enemies, this.bullets);
       this.physics.add.collider(this.enemies, this.wallsGroup);
    }

    createLemming(posx, posy, index)
    {
        var lemming = this.enemies.getFirst(false);
        if(!lemming)
        {
            lemming = new lemmingPrefab(this,posx,posy,'lemming', index);
            lemming.setScale(2);
            this.enemies.add(lemming);
        }
        else
        {
            lemming.active = true;
            lemming.body.reset(posx,posy);
        }
    }

    createTerrain(posx, posy, isWall)
    {
        var terrain
        if(!isWall)
        terrain = this.bullets.getFirst(false);
        else
        terrain = this.wallsGroup.getFirst(false);

        if(!terrain)
        {
            terrain = new terrainPrefab(this,posx,posy,'tempTerrain');
            terrain.setScale(2);
            if(!isWall)
            this.bullets.add(terrain);
            else
            this.wallsGroup.add(terrain);
        }
        else
        {
            terrain.active = true;
            terrain.body.reset(posx,posy);
        }
    }

    loadAnimations()
    {
		this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('lemming', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update()
    {

    }
}