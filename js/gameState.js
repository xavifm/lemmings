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
        this.load.spritesheet('walkLemming','assets/Walk_Lemmings(6x10).png',
        {frameWidth:6,frameHeight:10});
        this.load.spritesheet('digLemming','assets/Dig_Lemmings(11x12).png',
        {frameWidth:11,frameHeight:12});
        this.load.spritesheet('trapDoor','assets/trapDoor.png',
        {frameWidth:41,frameHeight:25});
        this.load.spritesheet('door','assets/door.png',
        {frameWidth:33,frameHeight:25});
        this.load.image('tempTerrain','assets/tempTerrain.png');
        this.load.image('mask','assets/mask.png');
    }
    create()
    { 
       this.timerSpawn = Math.random() * (4 - 1) + 1;

       this.loadAnimations();
       this.bullets = this.physics.add.group();
       this.wallsGroup = this.physics.add.group();
       this.maskGroup = this.physics.add.group();
       this.enemies = this.physics.add.group();
       this.doors = this.physics.add.group();
              
       for(let index = 0; index < 10; index++)
       {
        this.createTerrain(45+index*90, 300+70, false);
        this.createTerrain(45+index*90, 500+50, false);
       }
       for(let index = 0; index < 2; index++)
       {
        this.createTerrain(index*800, 210+70, true);
        this.createTerrain(index*800, 410+50, true);
       }

       this.createDoor(500, 502);

       this.createTrapDoor(100, 100);
       
       collider1 = this.physics.add.overlap(this.enemies, this.bullets);
       collider2 = this.physics.add.overlap(this.enemies, this.wallsGroup);
       maskCollider = this.physics.add.overlap(this.enemies, this.maskGroup);
       this.physics.add.overlap(this.enemies, this.doors);
    }

    createLemming(posx, posy, index)
    {
        var lemming = this.enemies.getFirst(false);
        if(!lemming)
        {
            lemming = new lemmingPrefab(this,posx,posy,'walkLemming', index).setInteractive();
            lemming.setScale(2);

            lemming.on('pointerdown', function (pointer) {

                this.setTint(0xff0000);
                //this.anims.play('dig',true);
                gamePrefs.walking[index] = false;
                gamePrefs.digging[index] = true;
                //lemming.physics.checkCollision.none = false;
                //collider1.active = false;
        
            });
        
            lemming.on('pointerout', function (pointer) {
        
                this.clearTint();
        
            });
        
            lemming.on('pointerup', function (pointer) {
        
                this.clearTint();
        
            });

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
            terrain = new terrainPrefab(this,posx,posy,'tempTerrain', false);
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

    createTrapDoor(posx, posy) 
    {
        var door = new doorPrefab(this,posx,posy,'trapDoor', true);
        door.setScale(2);
    }

    createDoor(posx, posy)
    {
        var door
        door = this.doors.getFirst(false);

        if(!door)
        {
            door = new doorPrefab(this,posx,posy,'door');
            door.setScale(2);
            this.doors.add(door);
        }
        else
        {
            door.active = true;
            door.body.reset(posx,posy);
        }
    }

    createMask(posx, posy)
    {
        var mask = this.maskGroup.getFirst(false);

        if(!mask)
        {
            mask = new maskPrefab(this,posx,posy,'mask');
            mask.setScale(1.8);
            this.maskGroup.add(mask);
        }
        else
        {
            mask.active = true;
            mask.body.reset(posx,posy);
        }
    }

    loadAnimations()
    {
		this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('walkLemming', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'dig',
            frames: this.anims.generateFrameNumbers('digLemming', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'openTrapDoor',
            frames: this.anims.generateFrameNumbers('trapDoor', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'DoorAnim',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update()
    {
        timeSinceLastIncrement += 0.01;
        
        if (timeSinceLastIncrement >= 1 && index < 10)
        {
          this.createLemming(100, 110, index); 
          index++;  
          timeSinceLastIncrement = 0;
        }
    }
}