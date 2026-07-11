const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let gravity = 0.8;

let score = 0;

let distance = 0;

let gameOver = false;

const player = {

    x:80,

    y:250,

    width:50,

    height:50,

    vy:0,

    jumping:false

};

const obstacles = [];

function spawnObstacle(){

    obstacles.push({

        x:1000,

        y:260,

        width:30,

        height:40

    });

}

setInterval(spawnObstacle,1800);

document.addEventListener("keydown",(e)=>{

    if((e.code==="Space" || e.code==="ArrowUp") && !player.jumping){

        player.vy=-15;

        player.jumping=true;

    }

});

function update(){

    if(gameOver) return;

    player.vy+=gravity;

    player.y+=player.vy;

    if(player.y>=250){

        player.y=250;

        player.vy=0;

        player.jumping=false;

    }

    for(let i=0;i<obstacles.length;i++){

        obstacles[i].x-=8;

        if(

            player.x<obstacles[i].x+obstacles[i].width&&

            player.x+player.width>obstacles[i].x&&

            player.y<obstacles[i].y+obstacles[i].height&&

            player.y+player.height>obstacles[i].y

        ){

            gameOver=true;

        }

    }

    distance++;

    score=distance;

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#888";

    ctx.fillRect(0,300,1000,5);

    ctx.fillStyle="green";

    ctx.fillRect(player.x,player.y,player.width,player.height);

    ctx.fillStyle="darkgreen";

    for(let o of obstacles){

        ctx.fillRect(o.x,o.y,o.width,o.height);

    }

    if(gameOver){

        ctx.fillStyle="red";

        ctx.font="48px Arial";

        ctx.fillText("GAME OVER",330,140);

        ctx.font="28px Arial";

        ctx.fillText("按 R 重新開始",380,190);

    }

    document.getElementById("distance").innerText=distance;

    document.getElementById("score").innerText=score;

}

function loop(){

    update();

    draw();

    requestAnimationFrame(loop);

}

loop();

document.addEventListener("keydown",(e)=>{

    if(e.key==="r"||e.key==="R"){

        location.reload();

    }

});
