const cvs = document.getElementById('flappyufo');
const ctx = cvs.getContext('2d');
const thinkingThoughts = document.getElementById('newApproach');

/*let fuFont = new FontFace('VT323', 'url(https://fonts.googleapis.com/css?family=VT323)');
  fuFont.load().then((font) => {
    document.fonts.add(font);
  });*/

const desktop = new Image();
const titleScreen = new Image();
const extraSolved = new Image();
const fufoSprite = new Image();
const bgSky = new Image();
const bgCity = new Image();
const fg = new Image();
const tentacleN = new Image();
const tentacleS = new Image();
const fuGameOver = new Image();
const fuContinue = new Image();
const fuk = new Image();
const fukFound = new Image();

const exeClick = new Audio();
const titleTune = new Audio();
const bgMusic = new Audio();
const explosion = new Audio();
const flySound = new Audio();
const bleep = new Audio();
const victorySong = new Audio();
const fuSmash = new Audio();
const shatter = new Audio();
const unlockSound = new Audio();


desktop.src = 'img/fu/fudesktop.png';
titleScreen.src = 'img/fu/futitlecard.png';
extraSolved.src = 'img/fu/fusmash.png';
fufoSprite.src = 'img/fu/fufo1.png';
bgSky.src = 'img/fu/gbbgsky.png';
bgCity.src = 'img/fu/gbbgcity.png';
fg.src = 'img/fu/gbfg.png';
tentacleN.src = 'img/fu/gbt1.png';
tentacleS.src = 'img/fu/gbt2.png';
fuGameOver.src = 'img/fu/fugo.png';
fuContinue.src = 'img/fu/fucontinue.png';
fuk.src = 'img/fu/fukey.png';
fukFound.src = 'img/fu/fuendkey.png';

exeClick.src = 'sound/fu/click_003.ogg';
titleTune.src = 'sound/fu/title.mp3';
bgMusic.src = 'sound/fu/bgmusic.wav';
bgMusic.loop = true;
explosion.src = 'sound/fu/explosion.wav';
flySound.src = 'sound/fu/fly2.wav';
bleep.src = 'sound/fu/bleep.wav';
victorySong.src = 'sound/fu/victory.wav';
fuSmash.src = 'sound/fu/hit.mp3.flac';
shatter.src = 'sound/fu/shatter.wav';
unlockSound.src = 'sound/UnlockDoor.wav';


let fuExe = {width: 48,
              height: 69,
              x: 14,
              y: 14};

let startBtn = {width: 76,
                height: 40,
                x: 396,
                y: 342};
let continueBtn = {width: 76,
                  height: 40,
                  x: cvs.width/2-38,
                  y: 257};

//const ufoInfo = {w: 51, h: 41};
let fufoSpeed = 0;
let fufo = {width: 42,
              height: 31,
              x: 100,
              y: 150,
              hitboxTopRad: 11,
              hitboxTopX: 0,
              hitboxTopY: 0,
              hitboxBottomW: 38,
              hitboxBottomH: 13,
              hitboxBottomX: 0,
              hitboxBottomY: 0,
              speed: 0,
              gravity: 0.25,
              jump: -4.6,
              update: function() {
                if(gameState.current === gameState.start) {
                  this.y = 150;
                  this.speed = 0;
                }
                if(gameState.current === gameState.play) {

                  this.speed += this.gravity;
                  this.y += this.speed;
                  this.hitboxTopX = this.x+21;
                  this.hitboxTopY = this.y+11;
                  this.hitboxBottomX = this.x+2;
                  this.hitboxBottomY = this.y+15;
                  if(this.y+this.height > cvs.height-18) {
                    console.log('hep');
                    explosion.play();
                    tries++;
                    //this.y = cvs.height - this.height;
                    gameState.current = gameState.end;
                  }
                }
              },
              fly: function() {
                this.speed = this.jump;
              },
              draw: function() {
                ctx.drawImage(fufoSprite, this.x, this.y);
                /*ctx.beginPath();
                ctx.arc(this.hitboxTopX, this.hitboxTopY, this.hitboxTopRad, 0, Math.PI*2);
                ctx.fillStyle = '#f00';
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.rect(this.hitboxBottomX, this.hitboxBottomY, this.hitboxBottomW, this.hitboxBottomH);
                ctx.fillStyle = '#f00';
                ctx.fill();
                ctx.closePath();*/
              }
            };

let bgScroll = {x: 0,
                speed: 1,
                update: function() {
                  if (gameState.current === gameState.play){
                    this.x -= this.speed;
                    }
                  if(this.x === -cvs.width) {
                    this.x = 0;
                    console.log('RESET');
                  }
                },
                draw: function() {
                  ctx.drawImage(bgCity, this.x, 0);
                  ctx.drawImage(bgCity, this.x+cvs.width, 0);
                }};
let fgScroll = {x: 0,
                speed: 2,
                update: function() {
                  if (gameState.current === gameState.play){
                    this.x -= this.speed;
                    }
                  if(this.x === -cvs.width) {
                    this.x = 0;
                    console.log('RESET');
                  }
                },
                draw: function() {
                  ctx.drawImage(fg, this.x, 382);
                  ctx.drawImage(fg, this.x+cvs.width, 382);
                }};
//const tentacleInfo = {w: 30, h: 333};
let tentacleList = [];
class Tentacles {
  constructor() {
    this.x = cvs.width;
    this.maxY = -120;
    this.width = 35;
    this.spriteWidth = 55;
    this.height = 297;
    this.top = this.maxY * (Math.random() +1);
    this.bottom = this.top + this.height+87;
    this.counted = false;
  }
  draw() {
    ctx.drawImage(tentacleN, this.x, this.top);
    ctx.drawImage(tentacleS, this.x, this.bottom);
    //console.log(this.top);
    //console.log(tentacleList.length);
  }
  update() {
    this.x -= gamespeed;
    this.hitboxX = this.x+10;
    this.draw();
    if(this.x <= -this.spriteWidth) {
      tentacleList.pop();

    }

    if(this.x+this.spriteWidth <= fufo.x && !this.counted) {
      this.counted = true;
      bleep.play();
      passes++;
      console.log('PASS');
    }
    //YLÄLONKERO HITBOXIT
    //ufon yläosa
    if(fufo.hitboxTopX + fufo.hitboxTopRad > this.hitboxX &&
      fufo.hitboxTopX - fufo.hitboxTopRad < this.hitboxX+this.width &&
      fufo.hitboxTopY + fufo.hitboxTopRad > this.top &&
      fufo.hitboxTopY - fufo.hitboxTopRad < this.top+this.height) {
        explosion.play();
        tries++;
        gameState.current = gameState.end;
      }
      //ufon alaosa
      if(fufo.hitboxBottomX < this.hitboxX+this.width &&
         fufo.hitboxBottomX + fufo.hitboxBottomW > this.hitboxX &&
         fufo.hitboxBottomY < this.top+this.height &&
         fufo.hitboxBottomY+fufo.hitboxBottomH > this.top) {
           explosion.play();
           tries++;
           gameState.current = gameState.end;
         }

      //ALALONKERO HITBOXIT
      //ufon yläosa
      if(fufo.hitboxTopX + fufo.hitboxTopRad > this.hitboxX &&
        fufo.hitboxTopX - fufo.hitboxTopRad < this.hitboxX+this.width &&
        fufo.hitboxTopY + fufo.hitboxTopRad > this.bottom &&
        fufo.hitboxTopY - fufo.hitboxTopRad < this.bottom+this.height) {
          explosion.play();
          tries++;
          gameState.current = gameState.end;
        }
        //ufon alaosa
        if(fufo.hitboxBottomX < this.hitboxX+this.width &&
           fufo.hitboxBottomX + fufo.hitboxBottomW > this.hitboxX &&
           fufo.hitboxBottomY < this.bottom+this.height &&
           fufo.hitboxBottomY+fufo.hitboxBottomH > this.bottom) {
             explosion.play();
             tries++;
             gameState.current = gameState.end;
           }

      //console.log(fufo.hitboxTopY);
    /* VANHA HITBOXLOGIIKKA
    if(fufo.x < this.x+this.width &&
       fufo.x + fufo.width > this.x &&
       fufo.y < this.top+this.height &&
       fufo.y+fufo.height > this.top) {
         explosion.play();
         gameState.current = gameState.end;
         console.log('HIT TOP');
       }
    if(fufo.x < this.x+this.width &&
      fufo.x + fufo.width > this.x &&
      fufo.y < this.bottom+this.height &&
      fufo.y+fufo.height > this.bottom) {
        explosion.play();
        gameState.current = gameState.end;
        console.log('HIT BOTTOM');
      }*/
  }
}

let keyTentacle = {x: cvs.width,
                  y: 21,
                  width: 372,
                  update: function() {
                    if (this.x <= cvs.width-this.width) {
                      gameState.current = gameState.solved;
                    } else {
                      this.x -= gamespeed;
                    }
                  },
                  draw: function() {
                    ctx.drawImage(fuk, this.x, this.y);
                  }
                };

const gameState = {current: 0,
                   desktop: 0,
                   title: 1,
                   start: 2,
                   play: 3,
                   end: 4,
                   solved: 5,
                   extraSolved: 6};

//let keyPressed = false;
//let esto = false;
let gamespeed = 3;
let frame = 0;
let passes = 0;
let tries = 0;
let stopped = false;
let gameStarted = false;
let firstTimeOpen = true;
let gameEnd = false;
let thoughts = false;

let pcLock = false;

let x = 100;
let y = 150;
let dx = 3;
let dy = -3;
let gravity = 3;
let ballRadius = 20;




//cvs.tabIndex = '1';

//EVENT LISTENERI
//ON TÄSSÄ!!!!!!!!!!
let rect;
let clickX;
let clickY;

cvs.addEventListener('dblclick', function(e) {
  if(!gameStarted) {
    rect = cvs.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;

    if(clickX >= fuExe.x && clickX <= fuExe.x+fuExe.width &&
      clickY >= fuExe.y && clickY <= fuExe.y + fuExe.height) {
        drawGame();
        titleTune.play();
        gameState.current = gameState.title;
        gameStarted = true;
      }

  }
});
cvs.addEventListener('click', function(e) {
  switch (gameState.current){
    case gameState.desktop:
    rect = cvs.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;

    if(clickX >= fuExe.x && clickX <= fuExe.x+fuExe.width &&
      clickY >= fuExe.y && clickY <= fuExe.y + fuExe.height) {
        exeClick.play();
      }
    break;
    case gameState.title:
      rect = cvs.getBoundingClientRect();
      clickX = e.clientX - rect.left;
      clickY = e.clientY - rect.top;

      if(clickX >= startBtn.x && clickX <= startBtn.x+startBtn.width &&
        clickY >= startBtn.y && clickY <= startBtn.y + startBtn.height) {
          titleTune.pause();
          bgMusic.play();
          gameState.current = gameState.start;
        }
    break;

    case gameState.start:

        gameState.current = gameState.play;
      break;

    case gameState.play:
      fufo.fly();
      flySound.play();
    break;

    case gameState.end:
      rect = cvs.getBoundingClientRect();
      clickX = e.clientX - rect.left;
      clickY = e.clientY - rect.top;

      if(clickX >= continueBtn.x && clickX <= continueBtn.x+continueBtn.width &&
        clickY >= continueBtn.y && clickY <= continueBtn.y + continueBtn.height) {
          gameState.current = gameState.start;
          frame = 0;
          passes = 0;
          tentacleList = [];
          bgScroll.x = 0;
          fgScroll.x = 0;
          keyTentacle.x = cvs.width;
        }
    break;
  }
});

//drawGame();
//desktop.onload = drawDesktop();
//drawDesktop();
function drawDesktop() {
  ctx.drawImage(desktop, 0, 0);
  /*ctx.beginPath();
  ctx.rect(14, 14, 48, 69);
  ctx.fillStyle = '#f00';
  ctx.fill();
  ctx.closePath();*/
}

function drawSquare() {
  ctx.beginPath();
  ctx.rect(fufo.x+2, fufo.y+15, fufo.width-4, 13);
  ctx.fillStyle = '#f00';
  ctx.fill();
  ctx.closePath();
}

function drawTSquare() {
  ctx.beginPath();
  ctx.rect(tentacleNInfo.x+38, tentacleNInfo.y, 30, tentacleNInfo.height);
  ctx.fillStyle = '#f00';
  ctx.fill();
  ctx.closePath();
}

function drawEllipse() {
  ctx.beginPath();
  ctx.ellipse(100, 100, 17, 27, Math.PI/2, 0, 2 * Math.PI);
  //ctx.stroke();
  ctx.fillStyle = '#f00';
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(fufo.x+21, fufo.y+11, 11, 0, Math.PI*2);
  ctx.fillStyle = '#f00';
  ctx.fill();
  ctx.closePath();
}

function spawnTentacles() {
  if (frame%100 === 0) {
    if (passes<3) {
      tentacleList.unshift(new Tentacles);
    }
  }
  for(let i=0;tentacleList.length>i;i++) {
    tentacleList[i].update();
  }
  frame++;
}

function newApproach() {
  console.log('new appr');
  bgMusic.pause();
  fuSmash.play();
  shatter.play();
  thinkingThoughts.innerHTML = '';
  gameState.current = gameState.extraSolved;
  setTimeout(function() {
    unlockSound.play();
    pcLock = true;
  }, 1600);
}
/*
function fly() {
  y -= 20;
}
*/
function drawGame() {
  //ctx.clearRect(0, 0, cvs.width, cvs.height);
  //ctx.drawImage(bg, 0, 0);
  if (tries === 5 && !thoughts) {
    thoughts = true;
    thinkingThoughts.innerHTML =
    '<span onclick="newApproach()">Perhaps I should try another approach...?</span>';
  }
  if (gameState.current === gameState.desktop) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(desktop, 0, 0);

  }

  if (gameState.current === gameState.title) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(titleScreen, 0, 0);
    /*ctx.beginPath();
    ctx.rect(396, 342, startBtn.width, startBtn.height);
    ctx.fillStyle = '#f00';
    ctx.fill();
    ctx.closePath();*/
  }
  if (gameState.current === gameState.start) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(bgSky, 0, 0);
    bgScroll.update();
    bgScroll.draw();
    fgScroll.update();
    fgScroll.draw();
    fufo.update();
    fufo.draw();
    /*if (firstTimeOpen) {
      titleTune.play();
      firstTimeOpen = false;
    }*/
    //drawBall();
    //drawSquare();
    //drawEllipse();

    /*
    frame = 0;
    passes = 0;
    tentacleList = [];
    bgScroll.x = 0;
    fgScroll.x = 0;
    keyTentacle.x = cvs.width;
    */
    //requestAnimationFrame(drawGame);
  }
  if (gameState.current === gameState.play) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(bgSky, 0, 0);
    bgScroll.update();
    bgScroll.draw();
    fgScroll.update();
    fgScroll.draw();
    fufo.update();


    spawnTentacles();
    //console.log('passes '+passes+' tentaakkelit '+tentacleList.length);
    if (passes>3 && tentacleList.length === 0) {
      keyTentacle.update();
      keyTentacle.draw();
    }
    fufo.draw();
    //frame++;
    //requestAnimationFrame(drawGame);
  }
  if (gameState.current === gameState.end) {
    ctx.drawImage(fuGameOver, cvs.width/2-167.5, 50);
    ctx.drawImage(fuContinue, continueBtn.x, continueBtn.y);
    console.log(continueBtn.x);
    //requestAnimationFrame(drawGame);
  }
  if (gameState.current === gameState.solved) {
    if(thoughts) {
      thinkingThoughts.innerHTML = '';
    }
    bgMusic.pause();
    victorySong.play();
    gameEnd = true;
    setTimeout(function() {
      ctx.beginPath();
      ctx.rect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = '#8bac0f';
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.rect(25, 25, 450, 350);
      ctx.fillStyle = '#9bbc0f';
      ctx.fill();
      ctx.closePath();
      ctx.drawImage(fukFound, cvs.width/2-22.5, cvs.height/2-54, 45, 108);
      ctx.font = '50px VT323';
      ctx.fillStyle = '#0f380f';
      ctx.textAlign = 'center';
      ctx.fillText('You Got The Key!', cvs.width/2, 100);

      setTimeout(function() {
        unlockSound.play();
        pcLock = true;
      }, 1500);
    }, 2550);
  }
  if (gameState.current === gameState.extraSolved) {
    ctx.drawImage(extraSolved, 0, 0);
    gameEnd = true;
  }
  /*switch(gameState.current) {
    case gameState.start:
      ctx.drawImage(fufoSprite, x, y);
      console.log('tut');
      requestAnimationFrame(drawGame);
      break;
    case gameState.play:
      //ctx.drawImage(bg, 0, 0);
      ctx.drawImage(fufoSprite, x, y);
      spawnTentacles();
        console.log(tentacleList);
      //x += dx;
      y += gravity;
      frame++;
      requestAnimationFrame(drawGame);
      break;
    }*/
    if(!gameEnd) {
      console.log(gameState.current);
    requestAnimationFrame(drawGame);
  }
}
