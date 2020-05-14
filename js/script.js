var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
///////////////////////// MAX SCORE PLAYER
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

const maxsize = document.getElementById('maxsize')
const maxsizevalue = document.getElementById('maxsizevalue')
const minsize = document.getElementById('minsize')
const minsizevalue = document.getElementById('minsizevalue')
const speed = document.getElementById('speed')
const speedvalue = document.getElementById('speedvalue')
const maxnumber = document.getElementById('maxnumber')
const maxnumbervalue = document.getElementById('maxnumbervalue')
const minnumber = document.getElementById('minnumber')
const minnumbervalue = document.getElementById('minnumbervalue')

const scorelist = document.getElementById('scorelist')
const nameplayer = document.getElementById('nameplayer')

var maxSizeBall;
var minSizeBall;
var speedBall;
var maxHowManyBalls;
var howManyBalls;

if(localStorage.getItem('maxsize')) {
  maxSizeBall = Number(localStorage.getItem('maxsize'));
} else {
  maxSizeBall = 14;
}
if(localStorage.getItem('minsize')) {
  minSizeBall = Number(localStorage.getItem('minsize'));
} else {
  minSizeBall = 8;
}
if(localStorage.getItem('speed')) {
  speedBall = Number(localStorage.getItem('speed'));
} else {
  speedBall = 5;
}
if(localStorage.getItem('maxnumber')) {
  maxHowManyBalls = Number(localStorage.getItem('maxnumber'));
} else {
  maxHowManyBalls = 50;
}
if(localStorage.getItem('minnumber')) {
  howManyBalls = Number(localStorage.getItem('minnumber'));
} else {
  howManyBalls = 8;
}

maxsizevalue.textContent = ` : ${maxSizeBall}`;
maxsize.setAttribute('value', maxSizeBall);
minsizevalue.textContent = ` : ${minSizeBall}`;
minsize.setAttribute('value', minSizeBall);
speedvalue.textContent = ` : ${speedBall}`;
speed.setAttribute('value', speedBall);
maxnumbervalue.textContent = ` : ${maxHowManyBalls}`;
maxnumber.setAttribute('value', maxHowManyBalls);
minnumbervalue.textContent = ` : ${howManyBalls}`;
minnumber.setAttribute('value', howManyBalls);

maxsize.addEventListener('change', function(e) {
  maxsizevalue.textContent = ` : ${e.target.value}`;
  localStorage.setItem('maxsize', e.target.value);
})
minsize.addEventListener('change', function(e) {
  minsizevalue.textContent = ` : ${e.target.value}`;
  localStorage.setItem('minsize', e.target.value);
})
speed.addEventListener('change', function(e) {
  speedvalue.textContent = ` : ${e.target.value}`;
  localStorage.setItem('speed', e.target.value);
})
maxnumber.addEventListener('change', function(e) {
  maxnumbervalue.textContent = ` : ${e.target.value}`;
  localStorage.setItem('maxnumber', e.target.value);
})
minnumber.addEventListener('change', function(e) {
  minnumbervalue.textContent = ` : ${e.target.value}`;
  localStorage.setItem('minnumber', e.target.value);
})



var pixels = (width / 500) * (height / 300);
var quantityBalls = Math.floor(pixels * howManyBalls);
if (quantityBalls > maxHowManyBalls) {
  maxSizeBall = ((quantityBalls - maxHowManyBalls) / 100 + 1) * maxSizeBall;
  minSizeBall = ((quantityBalls - maxHowManyBalls) / 100 + 1) * minSizeBall;
  quantityBalls = maxHowManyBalls;
}


var distance;
var distanceClick;
var mouseX;
var mouseY;
var clickX;
var clickY;
var border = 65;
var gameScore = 0;
var gameMaxScore = 0;
var gameStop = 0;
// var inputscorelist;

$("#cog").click(function(event){
  $(".settings,.fa-cog").toggleClass("active");
  gameStop = 1;
});
$("#top").click(function(event){
  $(".fa-top").toggleClass("active");
  gameStop = 1;
});
let gameDataArray = [];
localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
const dataGame = JSON.parse(localStorage.getItem('gameBalls'));
$("#play").click(function(event){
  $(".fa-play").toggleClass("active");
  var inputscorelist = nameplayer.value;
  gameDataArray.push(inputscorelist)
  localStorage.setItem('gameBalls', JSON.stringify(gameDataArray))
  gameDataArray.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    scorelist.appendChild(li);
  })
  
  // gameStart = 1;
});
function getMouse() {
  $("#canvas").mousemove(function(event){
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  });
};
function getMouseClick() {
  $("#canvas").click(function(event){
    clickX = event.offsetX;
    clickY = event.offsetY;
  });
};

function random(min, max) {
  var num = 0;
  while (num === 0) {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return num;
};
function circle(x,y,size,fillCircle,color) {
  ctx.beginPath();
  ctx.arc(x,y,size,0,Math.PI * 2, false);
  if(fillCircle) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}
function drawBorder() {
  ctx.fillStyle = "White";
  ctx.strokeStyle = "Gray";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, border);
  ctx.lineTo(0, border - 3);
  ctx.lineTo(width, border - 3);
  ctx.lineTo(width, border);
  ctx.stroke();
  ctx.fill();
}
function drawScore() {
  ctx.font = "Bold 35px serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "Gray";
  ctx.strokeText(" :", width/2+28, 15);
  ctx.fillStyle = "White";
  ctx.fillText(" :", width/2+28, 15);
  ctx.font = "Bold 42px serif";
  ctx.strokeText(gameScore, width/2+52, 15);
  ctx.fillText(gameScore, width/2+52, 15);

};
function drawMaxScore() {
  if(localStorage.getItem('maxscore')) {
    gameMaxScore = Number(localStorage.getItem('maxscore'));
  }
  ctx.font = "24px serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "Gray";
  ctx.strokeText("Max score: " + gameMaxScore, width - 90, 22);
  ctx.fillStyle = "White";
  ctx.fillText("Max score: " + gameMaxScore, width - 90, 22);

};
function checkMouseOnGamePlace() {
  if ((mouseX < minSizeBall || mouseX > width - minSizeBall) || (mouseY < minSizeBall + border || mouseY > height - minSizeBall)) {
    gameScore = 0;
  }
};
function gameOver() {
  if (gameStop >= 1) {
    if (gameScore > gameMaxScore) {
      localStorage.setItem('maxscore', gameScore);
    }
    ctx.font = "Bold 60px serif";
    ctx.lineWidth = 2;
    ctx.fillStyle = "White";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
    ctx.strokeStyle = "Gray";
    ctx.strokeText("Game Over", width / 2, height / 2);
    gameStop++;
    setTimeout(function(){ 
      clearInterval(drawGameBalls);
    }, 2500);
  }
};

function Ball(color) {
  this.x =  random(0 + maxSizeBall*2,width - maxSizeBall*2);//width/2;
  this.y =  random(0 + maxSizeBall*2 + border,height - maxSizeBall*2);//(height-border)/2;
  this.xSpeed = random(-speedBall, speedBall);
  this.ySpeed = random(-speedBall, speedBall);
  this.color = color;
  this.size = random(minSizeBall,maxSizeBall);
};
Ball.prototype.draw = function () {
  circle(this.x, this.y, this.size, true, this.color);
};
Ball.prototype.move = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
};
Ball.prototype.moveStop = function() {
  if (gameStop === 1 || gameStop === 20 || gameStop === 40 || gameStop === 60 || gameStop === 80 || gameStop === 100) {
    if(this.xSpeed === 0){this.xSpeed = 0;}
    if(this.xSpeed > 0){this.xSpeed--;}
    if(this.xSpeed < 0){this.xSpeed++;}
    if(this.ySpeed === 0){this.ySpeed = 0;}
    if(this.ySpeed > 0){this.ySpeed--;}
    if(this.ySpeed < 0){this.ySpeed++;}
  }
};
Ball.prototype.checkCollision = function() {
  if (this.x < this.size || this.x > width - this.size) {
    this.xSpeed = -this.xSpeed;
  }
  if (this.y < this.size + border || this.y > height - this.size) {
    this.ySpeed = -this.ySpeed;
  }
};
Ball.prototype.checkDistance = function() {
  if(gameStop === 0) {
    distance = Math.sqrt(((mouseX - this.x) * (mouseX - this.x)) + ((mouseY - this.y) * (mouseY - this.y)));
    if (distance < (this.size - 1)) {
      this.color = "Red";
      gameStop = 1;
      this.xSpeed = 0;
      this.ySpeed = 0;
    }
  }  
};

function BallScore(color, size) {
  this.x = random(0 + maxSizeBall * 2, width - maxSizeBall * 2);
  this.y = random(0 + maxSizeBall * 2 + border, height - maxSizeBall * 2);
  this.color = color;
  this.size = size;
};
BallScore.prototype.draw = function () {
  circle(this.x, this.y, this.size, true, this.color);
};
BallScore.prototype.checkClick = function() {
  distanceClick = Math.sqrt(((clickX - this.x) * (clickX - this.x)) + ((clickY - this.y) * (clickY - this.y)));
  if (distanceClick < this.size) {
    if(this.color === "Green") {
      this.x = random(0 + maxSizeBall * 2, width - maxSizeBall * 2);
      this.y = random(0 + maxSizeBall * 2 + border, height - maxSizeBall * 2);
      gameScore++;
    } else if(this.color === "Yellow") {
      this.size = 0;
      gameScore += 2;
    } else if(this.color === "Blue") {
      this.size = 0;
      gameScore += 5;
    }
  }
};

var balls = [];
for (var i=0;i<quantityBalls;i++) {
  balls[i] = new Ball("White");
}

var ballGreen = new BallScore("Green", maxSizeBall);
var ballYellow = new BallScore("Yellow", 0);
var ballBlue  = new BallScore("Blue", 0);

setInterval(function() {
  ballYellow = new BallScore("Yellow", ((maxSizeBall - minSizeBall) / 2 + minSizeBall));
}, random(6000,16000));
setInterval(function() {
  ballBlue = new BallScore("Blue", minSizeBall);
}, random(16000,35000));
setInterval(checkMouseOnGamePlace, 100);



var drawGameBalls = setInterval(function() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0,0,width,height);
  drawBorder();
  getMouse();
  getMouseClick();
  ballGreen.draw();
  ballGreen.checkClick();
  ballYellow.draw();
  ballYellow.checkClick();
  ballBlue.draw();
  ballBlue.checkClick();
  for (var i=0;i<balls.length;i++) {
    balls[i].draw();
    balls[i].move();
    balls[i].checkCollision();
    balls[i].checkDistance();
    balls[i].moveStop();
  }
  drawMaxScore();
  drawScore();
  gameOver();
}, 20);

