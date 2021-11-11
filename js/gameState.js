class gameState extends Phaser.Scene
{
    constructor()
    { //crea la escena
        super(
        {
            key:"gameState"
        });
    }
    preload()
    { //carga los assets en memoria
        this.cameras.main.setBackgroundColor("#000000");

        this.load.spritesheet('lemming','lemmings_spritesheet.png',
        {frameWidth:50,frameHeight:45});
      
    }
    create()
    { 
       this.timerSpawn = Math.random() * (4 - 1) + 1;
       //carga los assets en pantalla desde memoria
       this.bg1 = this.add.tileSprite(0,0,config.width,config.height,'background1').setOrigin(0);
       this.bg2 = this.add.tileSprite(0,0,config.width,config.height,'background2').setOrigin(0); 

       this.nave = this.physics.add.sprite(config.width/2,config.height*.95,'lemming').setOrigin(.5).setScale(1);
       
       this.nave.body.collideWorldBounds = true;

       this.loadAnimations();
    }

    flipDir() 
    {
        if(!this.nave.flipX)
        this.nave.flipX = true;
        else
        this.nave.flipX = false;
    }

    loadAnimations()
    {
		this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('lemming', { start: 18, end: 22 }),
            frameRate: 10,
            repeat: -1
        });
        this.nave.anims.play('walk');  
        this.nave.flipX = true;
    }

    update()
    {
        if(this.nave.body.x <= 2 || this.nave.body.x >= 720) 
        this.flipDir();
        if(!this.nave.flipX) 
        {
            this.nave.body.x += 1;
        }
        else 
        {
            this.nave.body.x -= 1; 
        }
    }
}