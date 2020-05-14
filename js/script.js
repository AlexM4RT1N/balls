var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

const speed = document.getElementById('speed')
const speedvalue = document.getElementById('speedvalue')

var speedBall;
if(localStorage.getItem('speed')) {
  speedBall = Number(localStorage.getItem('speed'));
} else {
  speedBall = 5;
}

speedvalue.textContent = ` : ${speedBall}`;
speed.setAttribute('value', speedBall);

speed.addEventListener('change', function(e) {
  speedvalue.textContent = ` : ${e.target.value}`;
  localStorage.setItem('speed', e.target.value);
})

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

var minSizeBall = 8;
var maxSizeBall = 14;

var pixels = (width / 500) * (height / 300);
var quantityBalls = Math.floor(pixels * 8);
if (quantityBalls > 50) {
  maxSizeBall = ((quantityBalls - 40) / 100 + 1) * maxSizeBall;
  minSizeBall = ((quantityBalls - 40) / 100 + 1) * minSizeBall;
  quantityBalls = 50;
}


var distance;
var distanceClick;
var mouseX;
var mouseY;
var clickX;
var clickY;
var gameScore = 0;
var gameStop = 0;

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
$("#cog").click(function(event){
  $(".settings").toggleClass("active");
  gameStop = 1;
});

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
};
function drawScore() {
  ctx.font = "Bold 25px Courier";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "Gray";
  ctx.strokeText("Score: " + gameScore, width/2, 5);
  ctx.fillStyle = "White";
  ctx.fillText("Score: " + gameScore, width/2, 5);

};
function checkMouseOnGamePlace() {
  if ((mouseX < minSizeBall || mouseX > width - minSizeBall) || (mouseY < minSizeBall || mouseY > height - minSizeBall)) {
    gameScore = 0;
  }
};
function gameOver() {
  if (gameStop >= 1) {
    ctx.font = "Bold 60px Courier";
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
  this.x = random(0 + maxSizeBall,width - maxSizeBall);
  this.y = random(0 + maxSizeBall,height - maxSizeBall);
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
  if (this.y < this.size || this.y > height - this.size) {
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
  this.x = random(0 + maxSizeBall,width - maxSizeBall);
  this.y = random(0 + maxSizeBall,height - maxSizeBall);
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
      this.x = random(0 + maxSizeBall,width - maxSizeBall);
      this.y = random(0 + maxSizeBall,height - maxSizeBall);
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
setInterval(checkMouseOnGamePlace(), 100);



var drawGameBalls = setInterval(function() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0,0,width,height);
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
  drawScore();
  gameOver();
}, 20);

