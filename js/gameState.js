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
        this.load.bitmapFont('8bit', 'assets/8bit.png', 'assets/8bit.xml');
        this.cameras.main.setBackgroundColor("#000031");
        this.load.spritesheet('walkLemming','assets/Walk_Lemmings(6x10).png',
        {frameWidth:6,frameHeight:10});
        this.load.spritesheet('fallLemming','assets/Fall_Lemmings9x16.png',
        {frameWidth:9,frameHeight:16});
        this.load.spritesheet('digLemming','assets/Dig_Lemmings(11x12).png',
        {frameWidth:11,frameHeight:12});
        this.load.spritesheet('exitLemming','assets/Exiting_Lemmings5x13.png',
        {frameWidth:5,frameHeight:13});
        this.load.spritesheet('explodeLemming','assets/Lemmings_exploding_spritesheet_16x16.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('trapDoor','assets/trapDoor.png',
        {frameWidth:41,frameHeight:25});
        this.load.spritesheet('door','assets/door.png',
        {frameWidth:33,frameHeight:25});
        this.load.image('tempTerrain','assets/tempTerrain.png');
        this.load.image('DIGUI','assets/UIDIG.png');
        this.load.image('UMBRELLAUI','assets/UIUMBRELLA.png');
        this.load.image('NUKEUI','assets/UINUKE.png');
        this.load.image('blackBG','assets/blackBG.PNG');
        this.load.image('mask','assets/mask.png');
        this.load.audio("music", ["assets/sounds/Lemmings_Music_Amiga.mp3"]);

        gamePrefs.numOfLemmings = 10;

        gamePrefs.maxNonClickedLemmings = gamePrefs.numOfLemmings;
    }
    create()
    {
        index = 0;
        for(let index = 0 ; index < gamePrefs.death.length ; index++)
        {
            gamePrefs.death[index] = false;
        }
        for(let index = 0 ; index < gamePrefs.finished.length ; index++)
        {
            gamePrefs.finished[index] = false;
        }
        for(let index = 0 ; index < gamePrefs.flipX.length ; index++)
        {
            gamePrefs.flipX[index] = false;
        }
        for(let index = 0 ; index < gamePrefs.flipX.length ; index++)
        {
            gamePrefs.flipX[index] = false;
        }
        for(let index = 0 ; index < gamePrefs.flipX.length ; index++)
        {
            gamePrefs.umbrella[index] = false;
        }

       this.UIMode = 0;
       keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
       this.timerSpawn = Math.random() * (4 - 1) + 1;

       this.loadAnimations();
       this.uiGroup = this.physics.add.group();
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

       this.instantiateCursor();
       
       collider1 = this.physics.add.overlap(this.enemies, this.bullets);
       collider2 = this.physics.add.overlap(this.enemies, this.wallsGroup);
       maskCollider = this.physics.add.overlap(this.enemies, this.maskGroup);
       this.physics.add.overlap(this.enemies, this.doors);

       this.instantiateUI(400, 600, true);
       this.instantiateUI(110, 630, false, 0);
       this.instantiateUI(50, 630, false, 1);
       this.instantiateUI(750, 630, false, 2);

       gamePrefs.textArray[0] = this.add.bitmapText(45, 610+30, '8bit','0',14);
       gamePrefs.textArray[1] = this.add.bitmapText(100, 610+30, '8bit','10',14);

       gamePrefs.BGMusic[0] = this.sound.add("music", { loop: true, volume: 0.3});
       if(!gamePrefs.BGMusic[0].isPlaying)
        {
            gamePrefs.BGMusic[0].play();
        }
            
       
    }

    createLemming(posx, posy, index)
    {
        var lemming = this.enemies.getFirst(false);
        if(!lemming)
        {
            lemming = new lemmingPrefab(this,posx,posy,'walkLemming', index, "gameState").setInteractive();
            lemming.setScale(2);

            lemming.on('pointerdown', function (pointer) 
            {
                const Kscene = this.scene.scene.get("gameState");
                this.setTint(0xff0000);
                //this.anims.play('dig',true);
                if(Kscene.UIMode == 1) 
                {
                    gamePrefs.walking[index] = false;
                    gamePrefs.digging[index] = true;
                    gamePrefs.maxNonClickedLemmings--;
                }
                //lemming.physics.checkCollision.none = false;
                //collider1.active = false;
            });
        
            lemming.on('pointerover', function (pointer) 
            {
                this.setTint(0xff0000);
                if (!keyA.isUp)
                {
                    gamePrefs.umbrella[index] = true;
                    //console.log('umbrella enabled for lemming ' + index);
                }
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

    instantiateCursor() 
    {
        this.input.setDefaultCursor('url(assets/Lemmings_sp_cursor.cur), pointer');
    }

    instantiateUI(posx, posy, isBG, ButtonType) 
    {
        var UI;

        if(!isBG && ButtonType == 0) 
        {
            UI = new uiPrefab(this,posx,posy,'DIGUI', 0, 1).setInteractive();
            UI.setScale(4);
            
            UI.on('pointerdown', function (pointer) 
            {
                const Kscene = this.scene.scene.get("gameState");
                if(Kscene.UIMode != 1) 
                {
                    Kscene.UIMode = 1;
                    this.setTint(0xa8a8a8);
                }
                else if(Kscene.UIMode == 1) 
                {
                    Kscene.UIMode = 0;
                    this.clearTint();
                }
                
            });   
        }
        else if(!isBG && ButtonType == 1) 
        {
            UI = new uiPrefab(this,posx,posy,'UMBRELLAUI', 0, 2).setInteractive();
            UI.setScale(4);
            
            UI.on('pointerdown', function (pointer) 
            {
                const Kscene = this.scene.scene.get("gameState");
                if(Kscene.UIMode != 2) 
                {
                    Kscene.UIMode = 2;
                    this.setTint(0xa8a8a8);
                }
                else if(Kscene.UIMode == 2) 
                {
                    Kscene.UIMode = 0;
                    this.clearTint();
                }
                
            });   
        }
        else if(!isBG && ButtonType == 2) 
        {
            UI = new uiPrefab(this,posx,posy,'NUKEUI', 0, 2).setInteractive();
            UI.setScale(4);
            
            UI.on('pointerdown', function (pointer) 
            {
                const Kscene = this.scene.scene.get("gameState");
                if(Kscene.UIMode != 3) 
                {
                    Kscene.UIMode = 3;
                    gamePrefs.nukeActivated = true;
                    this.setTint(0xa8a8a8);
                }
                else if(Kscene.UIMode == 3) 
                {
                    Kscene.UIMode = 0;
                    this.clearTint();
                }
                
            });   
        }
        else 
        {
            UI = new terrainPrefab(this,posx,posy,'blackBG').setInteractive();
            UI.setScale(2);
        }

        this.uiGroup.add(UI);
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
            mask.setScale(1.6);
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
            key: 'fallWithoutUmbrella',
            frames: this.anims.generateFrameNumbers('fallLemming', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'fallOpenUmbrella',
            frames: this.anims.generateFrameNumbers('fallLemming', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'fallUmbrellaOpened',
            frames: this.anims.generateFrameNumbers('fallLemming', { start: 8, end: 12 }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'dig',
            frames: this.anims.generateFrameNumbers('digLemming', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'exit',
            frames: this.anims.generateFrameNumbers('exitLemming', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explodeLemming', { start: 0, end: 13 }),
            frameRate: 10,
            repeat: 0
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

        this.anims.create({
            key: 'cursorIdle',
            frames: this.anims.generateFrameNumbers('cursor', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'cursorPoint',
            frames: this.anims.generateFrameNumbers('cursor', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update()
    {
        timeSinceLastIncrement += 0.01;

        gamePrefs.textArray[0].setText('0');

        var lemmingWorkQuantity = 0;

        for(let index = 0; index < gamePrefs.maxNonClickedLemmings; index++)
        {
            //if(!gamePrefs.digging[index])
            lemmingWorkQuantity++;
        }

        gamePrefs.textArray[1].setText(lemmingWorkQuantity.toString());

        if (timeSinceLastIncrement >= 1 && index < gamePrefs.numOfLemmings && !gamePrefs.nukeActivated)
        {
          this.createLemming(100, 110, index); 
          index++;  
          timeSinceLastIncrement = 0;
        }
        else if(timeSinceLastIncrement >= 3 && gamePrefs.nukeActivated)
        {
                this.scene.start('gameState');
                gamePrefs.nukeActivated = false;
                this.UIMode = 0;
        }
    }
}