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
        this.cameras.main.setBackgroundColor("#000000");

        this.load.spritesheet('lemming','lemmings_spritesheet.png',
        {frameWidth:50,frameHeight:45});
      
    }
    create()
    { 
       this.timerSpawn = Math.random() * (4 - 1) + 1;
       this.bg1 = this.add.tileSprite(0,0,config.width,config.height,'background1').setOrigin(0);
       this.bg2 = this.add.tileSprite(0,0,config.width,config.height,'background2').setOrigin(0); 

       this.loadAnimations();
       this.enemies = this.physics.add.group();
       for (let index = 0; index < 10; index++) 
       {
        this.createLemming(50+index*50, 500);   
       }
    }

    createLemming(posx, posy)
    {
        var lemming = this.enemies.getFirst(false);
        if(!lemming)
        {
            lemming = new lemmingPrefab(this,posx,posy,'lemming');
            this.enemies.add(lemming);
        }
        else
        {
            lemming.active = true;
            lemming.body.reset(posx,posy);
        }
    }

    loadAnimations()
    {
		this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('lemming', { start: 18, end: 22 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update()
    {
    }
}