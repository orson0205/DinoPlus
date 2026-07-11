<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2685.6">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">const canvas = document.getElementById("game");</p>
<p class="p1">const ctx = canvas.getContext("2d");</p>
<p class="p2"><br></p>
<p class="p1">let gravity = 0.8;</p>
<p class="p2"><br></p>
<p class="p1">let score = 0;</p>
<p class="p2"><br></p>
<p class="p1">let distance = 0;</p>
<p class="p2"><br></p>
<p class="p1">let gameOver = false;</p>
<p class="p2"><br></p>
<p class="p1">const player = {</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>x:80,</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>y:250,</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>width:50,</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>height:50,</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>vy:0,</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>jumping:false</p>
<p class="p2"><br></p>
<p class="p1">};</p>
<p class="p2"><br></p>
<p class="p1">const obstacles = [];</p>
<p class="p2"><br></p>
<p class="p1">function spawnObstacle(){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>obstacles.push({</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>x:1000,</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>y:260,</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>width:30,</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>height:40</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>});</p>
<p class="p2"><br></p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">setInterval(spawnObstacle,1800);</p>
<p class="p2"><br></p>
<p class="p1">document.addEventListener("keydown",(e)=&gt;{</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>if((e.code==="Space" || e.code==="ArrowUp") &amp;&amp; !player.jumping){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>player.vy=-15;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>player.jumping=true;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1">});</p>
<p class="p2"><br></p>
<p class="p1">function update(){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>if(gameOver) return;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>player.vy+=gravity;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>player.y+=player.vy;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>if(player.y&gt;=250){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>player.y=250;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>player.vy=0;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>player.jumping=false;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>for(let i=0;i&lt;obstacles.length;i++){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>obstacles[i].x-=8;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>if(</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">            </span>player.x&lt;obstacles[i].x+obstacles[i].width&amp;&amp;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">            </span>player.x+player.width&gt;obstacles[i].x&amp;&amp;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">            </span>player.y&lt;obstacles[i].y+obstacles[i].height&amp;&amp;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">            </span>player.y+player.height&gt;obstacles[i].y</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">            </span>gameOver=true;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>distance++;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>score=distance;</p>
<p class="p2"><br></p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">function draw(){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.clearRect(0,0,canvas.width,canvas.height);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.fillStyle="#888";</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.fillRect(0,300,1000,5);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.fillStyle="green";</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.fillRect(player.x,player.y,player.width,player.height);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.fillStyle="darkgreen";</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>for(let o of obstacles){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>ctx.fillRect(o.x,o.y,o.width,o.height);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>if(gameOver){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>ctx.fillStyle="red";</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>ctx.font="48px Arial";</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>ctx.fillText("GAME OVER",330,140);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>ctx.font="28px Arial";</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>ctx.fillText("按 R 重新開始",380,190);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>document.getElementById("distance").innerText=distance;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>document.getElementById("score").innerText=score;</p>
<p class="p2"><br></p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">function loop(){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>update();</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>draw();</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>requestAnimationFrame(loop);</p>
<p class="p2"><br></p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">loop();</p>
<p class="p2"><br></p>
<p class="p1">document.addEventListener("keydown",(e)=&gt;{</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>if(e.key==="r"||e.key==="R"){</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">        </span>location.reload();</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p2"><br></p>
<p class="p1">});</p>
</body>
</html>
