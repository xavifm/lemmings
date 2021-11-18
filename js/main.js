var gamePrefs=
{
    speedNave:2,
    speedBullet:-100,
    speedEnemy:1,
    touchingGround: [],
    flipX: [],
    walking: [],
    digging: []
}

var timerSpawn = 0;
var lifes = 2;
var wallsGroup;

var config=
{
    type: Phaser.AUTO,
    width:800,
    height:600,
    scene:[gameState],
    render:{
        pixelArt:true
    },
    physics:{
        default:'arcade',
        arcade:{
            debug:true,
            gravity:{y:50}
        }
    }
}
var juego = new Phaser.Game(config);

