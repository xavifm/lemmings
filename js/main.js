var gamePrefs=
{
    speedNave:2,
    speedBullet:-100,
    speedEnemy:1
}

var timerSpawn = 0;
var lifes = 2;

var config=
{
    type: Phaser.AUTO,
    width:800,
    height:600,
    scene:[gameState], //array con los niveles
    render:{
        pixelArt:true
    },
    physics:{
        default:'arcade',
        arcade:{
            debug:true
        }
    }
}
var juego = new Phaser.Game(config);

