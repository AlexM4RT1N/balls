var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
///////////////////////// MAX SCORE PLAYER
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

const body = document.querySelector('body')
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

const scorelistname = document.getElementById('scorelistname')
const scorelistscore = document.getElementById('scorelistscore')
const nameplayer = document.getElementById('nameplayer')

const defaultbtn = document.getElementById('default')
const changeplayer = document.getElementById('changeplayer')
const newplayer = document.getElementById('newplayer')


var maxSizeBall;
var minSizeBall;
var speedBall;
var maxHowManyBalls;
var howManyBalls;

let gameDataArray = {
  maxSizeBall: 14,
  minSizeBall: 8,
  speedBall: 5,
  maxHowManyBalls: 50,
  howManyBalls: 8,
  gameMaxScore: 0,
  nameplayers: {
    lastplayer: undefined,
  }
};

if (localStorage.getItem('gameBalls')) {
  const dataGame = JSON.parse(localStorage.getItem('gameBalls'));
  for(let key in dataGame.nameplayers) {
    // if (key != undefined && dataGame.nameplayers[key] != 0) {
      if (key != "lastplayer") {
        const liname = document.createElement('li');
        liname.textContent = key;
        scorelistname.appendChild(liname);
        const liscore = document.createElement('li');
        liscore.textContent = dataGame.nameplayers[key];
        scorelistscore.appendChild(liscore);
      }
      gameDataArray.nameplayers[key] = dataGame.nameplayers[key];
    // }
  }
  for(let key in dataGame) {
    if(key != "nameplayers") {
      if(dataGame[key] != gameDataArray[key]) {
        gameDataArray[key] = dataGame[key];
      } 
    }
  }
  localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
}

maxsizevalue.textContent = ` : ${gameDataArray.maxSizeBall}`;
maxsize.setAttribute('value', gameDataArray.maxSizeBall);
minsizevalue.textContent = ` : ${gameDataArray.minSizeBall}`;
minsize.setAttribute('value', gameDataArray.minSizeBall);
speedvalue.textContent = ` : ${gameDataArray.speedBall}`;
speed.setAttribute('value', gameDataArray.speedBall);
maxnumbervalue.textContent = ` : ${gameDataArray.maxHowManyBalls}`;
maxnumber.setAttribute('value', gameDataArray.maxHowManyBalls);
minnumbervalue.textContent = ` : ${gameDataArray.howManyBalls}`;
minnumber.setAttribute('value', gameDataArray.howManyBalls);

maxsize.addEventListener('change', function(e) {
  maxsizevalue.textContent = ` : ${e.target.value}`;
  gameDataArray.maxSizeBall = e.target.value;
  localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
})
minsize.addEventListener('change', function(e) {
  minsizevalue.textContent = ` : ${e.target.value}`;
  gameDataArray.minSizeBall = e.target.value;
  localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
})
speed.addEventListener('change', function(e) {
  speedvalue.textContent = ` : ${e.target.value}`;
  gameDataArray.speedBall = e.target.value;
  localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
})
maxnumber.addEventListener('change', function(e) {
  maxnumbervalue.textContent = ` : ${e.target.value}`;
  gameDataArray.maxHowManyBalls = e.target.value;
  localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
})
minnumber.addEventListener('change', function(e) {
  minnumbervalue.textContent = ` : ${e.target.value}`;
  gameDataArray.howManyBalls = e.target.value;
  localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
})



var pixels = (width / 500) * (height / 300);
var quantityBalls = Math.floor(pixels * gameDataArray.howManyBalls);
if (quantityBalls > gameDataArray.maxHowManyBalls) {
  gameDataArray.maxSizeBall = ((quantityBalls - gameDataArray.maxHowManyBalls) / 100 + 1) * gameDataArray.maxSizeBall;
  gameDataArray.minSizeBall = ((quantityBalls - gameDataArray.maxHowManyBalls) / 100 + 1) * gameDataArray.minSizeBall;
  quantityBalls = gameDataArray.maxHowManyBalls;
}


var distance;
var distanceClick;
var mouseX;
var mouseY;
var clickX;
var clickY;
var border = 65;
var gameScore = 0;
// var gameMaxScore = 0;
var gameStop = 0;
var gameStart;
var inputscorelist;

$("#cog").click(function(event){
  $(".settings,.fa-cog").toggleClass("active");
  // gameStop = 1;
});
$("#top").click(function(event){
  $(".score-list,.fa-top").toggleClass("active");
  // gameStop = 1;
});
defaultbtn.addEventListener('click', function(e){
  localStorage.removeItem('gameBalls');
  // maxSizeBall: 14,
  // minSizeBall: 8,
  // speedBall: 5,
  // maxHowManyBalls: 50,
  // howManyBalls: 8,
  // gameMaxScore: 0,
})
changeplayer.addEventListener('click', function(e){
  $(".fa-play,.nameplayer,.name-label").toggleClass("hidden");
})
newplayer.addEventListener('click', function(e){
  $(".fa-play,.nameplayer,.name-label").toggleClass("hidden");
  gameDataArray.nameplayers.lastplayer = undefined;
  localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
})

if(gameDataArray.nameplayers.lastplayer != undefined) {
  $(".fa-play,.nameplayer").toggleClass("hidden");
  inputscorelist = gameDataArray.nameplayers.lastplayer;
  const namelabel = document.createElement('p');
  namelabel.className = ('name-label');
  namelabel.textContent = inputscorelist;
  body.appendChild(namelabel);
  setTimeout(function(){ 
    gameStart = 1;
  }, 2500);
}
function checkValidname(name) {
  var characterValid = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  var arrValidInput = characterValid.split('');
  var arrValidname = name.split('');
  var checkValidchar = 0;
  arrValidname.forEach(item =>{
    for(let i = 0; i < arrValidInput.length; i++) {
      if(item != arrValidInput[i]) {
        checkValidchar++;
      }
    }
  })
  if(characterValid.length*name.length-name.length === checkValidchar) {
    return 1;
  }else{
    return 0;
  }
}
$("#play").click(function(event){
  inputscorelist = nameplayer.value;
  var checkValidatename = checkValidname(inputscorelist);
  if (inputscorelist.length > 2 && inputscorelist.length < 13 && checkValidatename === 1) {
    gameDataArray.nameplayers.lastplayer = inputscorelist;
    $(".fa-play").toggleClass("active");
    $(".fa-play,.nameplayer").toggleClass("hidden");
    if(gameDataArray.nameplayers[inputscorelist] === undefined){
      gameDataArray.nameplayers[inputscorelist]  = gameScore;
    } else {
      gameDataArray.nameplayers[inputscorelist] = gameDataArray.nameplayers[inputscorelist];
    }
    localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
    const namelabel = document.createElement('p');
    namelabel.className = ('name-label');
    namelabel.textContent = inputscorelist;
    body.appendChild(namelabel);
    gameStart = 1;
  }
});

function getMouse() {
  if (gameStart === 1) {
    $("#canvas").mousemove(function(event){
      mouseX = event.offsetX;
      mouseY = event.offsetY;
    });
  }
};
function getMouseClick() {
  if (gameStart === 1) {
    $("#canvas").click(function(event){
      clickX = event.offsetX;
      clickY = event.offsetY;
    });
  }
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
  if(localStorage.getItem('gameBalls')) {
    const dataGame = JSON.parse(localStorage.getItem('gameBalls'));
    gameDataArray.gameMaxScore = dataGame.gameMaxScore;
  }
  ctx.font = "24px serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "Gray";
  ctx.strokeText("Max score: " + gameDataArray.gameMaxScore, width - 90, 22);
  ctx.fillStyle = "White";
  ctx.fillText("Max score: " + gameDataArray.gameMaxScore, width - 90, 22);

};
function checkMouseOnGamePlace() {
  if ((mouseX < gameDataArray.minSizeBall || mouseX > width - gameDataArray.minSizeBall) || (mouseY < gameDataArray.minSizeBall + border || mouseY > height - gameDataArray.minSizeBall)) {
    gameScore = 0;
  }
};
function gameOver() {
  if (gameStop >= 1) {
    if (gameScore > gameDataArray.gameMaxScore) {
       gameDataArray.gameMaxScore = gameScore;
      localStorage.setItem('gameBalls', JSON.stringify(gameDataArray));
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
    var maxPlayerScore = gameDataArray.nameplayers[inputscorelist];
    if (maxPlayerScore < gameScore) {
      gameDataArray.nameplayers[inputscorelist] = gameScore;
    } else {
      gameDataArray.nameplayers[inputscorelist] = maxPlayerScore;
    }
    localStorage.setItem('gameBalls', JSON.stringify(gameDataArray))
    setTimeout(function(){ 
      clearInterval(drawGameBalls);
    }, 2500);
  }
};

function Ball(color) {
  this.x =  random(0 + gameDataArray.maxSizeBall*2,width - gameDataArray.maxSizeBall*2);//width/2;
  this.y =  random(0 + gameDataArray.maxSizeBall*2 + border,height - gameDataArray.maxSizeBall*2);//(height-border)/2;
  this.xSpeed = random(-gameDataArray.speedBall, gameDataArray.speedBall);
  this.ySpeed = random(-gameDataArray.speedBall, gameDataArray.speedBall);
  this.color = color;
  this.size = random(gameDataArray.minSizeBall,gameDataArray.maxSizeBall);
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
  this.x = random(0 + gameDataArray.maxSizeBall * 2, width - gameDataArray.maxSizeBall * 2);
  this.y = random(0 + gameDataArray.maxSizeBall * 2 + border, height - gameDataArray.maxSizeBall * 2);
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
      this.x = random(0 + gameDataArray.maxSizeBall * 2, width - gameDataArray.maxSizeBall * 2);
      this.y = random(0 + gameDataArray.maxSizeBall * 2 + border, height - gameDataArray.maxSizeBall * 2);
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


var ballGreen = new BallScore("Green", gameDataArray.maxSizeBall);
var ballYellow = new BallScore("Yellow", 0);
var ballBlue  = new BallScore("Blue", 0);

setInterval(function() {
  ballYellow = new BallScore("Yellow", ((gameDataArray.maxSizeBall - gameDataArray.minSizeBall) / 2 + gameDataArray.minSizeBall));
}, random(6000,16000));
setInterval(function() {
  ballBlue = new BallScore("Blue", gameDataArray.minSizeBall);
}, random(16000,35000));
setInterval(checkMouseOnGamePlace, 100);



var balls = [];
var drawGameBalls = setInterval(function() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0,0,width,height);
  while (balls.length < quantityBalls) {
    var ball = new Ball("White");
    balls.push(ball);
  }
  drawBorder();
  getMouse();
  getMouseClick();
  ballGreen.draw();
  ballGreen.checkClick();
  ballYellow.draw();
  ballYellow.checkClick();
  ballBlue.draw();
  ballBlue.checkClick();

  balls.forEach(item =>{
    item.draw();
    item.move();
    item.checkCollision();
    item.checkDistance();
    item.moveStop();
  })
  drawMaxScore();
  drawScore();
  gameOver();
}, 20);

