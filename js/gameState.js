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
       for (let index = 0; index < 10; index++) 
       {
        this.createLemming(50+index*50, 200);   
       }
       
       for(let index = 0; index <10; index++)
       {
        this.createTerrain(45+index*90, 400);
       }
       
       this.physics.add.collider(this.enemies, this.bullets);
    }

    createLemming(posx, posy)
    {
        var lemming = this.enemies.getFirst(false);
        if(!lemming)
        {
            lemming = new lemmingPrefab(this,posx,posy,'lemming');
            lemming.setScale(2);
            this.enemies.add(lemming);
        }
        else
        {
            lemming.active = true;
            lemming.body.reset(posx,posy);
        }
    }

    createTerrain(posx, posy)
    {
        var terrain = this.bullets.getFirst(false);
        if(!terrain)
        {
            terrain = new terrainPrefab(this,posx,posy,'tempTerrain');
            terrain.setScale(2);
            this.bullets.add(terrain);
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