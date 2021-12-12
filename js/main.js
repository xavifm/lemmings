var gamePrefs=
{
    speedNave:2,
    speedBullet:-100,
    speedEnemy:1,
    touchingGround: [],
    flipX: [],
    walking: [],
    digging: [],
    xpos: [],
    ypos: [],
    fallingInsideATunnel: [],
    finished: [],
    umbrella: []
}

var timerSpawn = 0;
var lifes = 2;
var wallsGroup;
var maskGroup;
var collider1;
var collider2;
var maskCollider;
var doors;
var timeSinceLastIncrement = 0;
var index = 0;
let keyA;

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
            debug:false,
            gravity:{y:50}
        }
    }
}
var juego = new Phaser.Game(config);

