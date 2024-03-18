console.log("Starting load..");

// 1 to max
function getRandomInt(max){
  return Math.ceil(Math.random() * max);
}

function getRandomRange(min, max){
  return Math.random() * (max - min) + min;
}

const TARGET_FRAMERATE = 165;
const TARGET_FRAMETIME_MILISECONDS = 1000 / TARGET_FRAMERATE;
class Point{
  constructor(x, y){
      this.x = x;
      this.y = y;
  }
}

let storedHighscore = 0
let highscore = 0;

if(localStorage.hasOwnProperty('bunnyhighscore')){
  storedHighscore = parseInt(localStorage.getItem('bunnyhighscore'));
  highscore = storedHighscore;
}

let currentPostfix = "";
let eggSpawnDelay = 1500;

console.log(highscore == null)

console.log(highscore);

if(typeof(storedHighscore) != "number" ){
  storedHighscore = 0;
}

console.log(storedHighscore);

class Player{
  constructor(x, y, width, height){
    this.caughtEggs = undefined
    this.lives = undefined
    this.position = new Point(x, y);
    this.movingLeft = false;
    this.movingRight = false;
    this.width = width;
    this.height = height;

    this.speed = 1;

    this.spriteId = "buniimg" + currentPostfix;
    this.sprite = document.getElementById(this.spriteId);
  }

  refreshSprite(){
    this.spriteId = "buniimg" + currentPostfix;
  }

  moveX(x){
    this.position.x += x;
  }

  draw(ctx){
    ctx.drawImage(this.sprite, this.position.x, this.position.y, this.width, this.height);
  }
}



class Egg{
  constructor(x, y, width, height){
    this.position = new Point(x, y);

    this.scale = getRandomRange(1,1.25)
    // this.rotation = getRandomInt(360);
    this.rotation = 0;
    this.rotationVelocity = Math.random(-1,1);

    this.type = getRandomInt(3);

    // if(getRandomInt(10) == 10){
    //   this.type = 4;
    // }

    console.log("type: " + this.type);

    this.spriteId = "jajco" + this.type + currentPostfix;

    this.collisionReaction = new Object;
    this.collisionReaction.score = 0;
    this.collisionReaction.lives = 0;
    
    // 0 - no reaction
    // 1 - dark mode for 10 second
    this.collisionReaction.mode = 0;

    switch(this.type){
      case 1:
        this.collisionReaction.score = 1;
        this.collisionReaction.lives = 0;
        break;
      case 2:
        this.collisionReaction.score = 2;
        this.collisionReaction.lives = 0;
        break;
      case 3:
        this.collisionReaction.score = 5;
        this.collisionReaction.lives = 0;
        break;
      case 4:
        this.collisionReaction.score = 3;
        this.collisionReaction.lives = -1;
        this.collisionReaction.mode = 1;

    }

    this.width = width * this.scale;
    this.height = height * this.scale;

    // this.spriteId = "jajco" + getRandomInt(3);
    console.log("sprite w id - " + this.spriteId)
    console.log(this.rotation);
    // document.getElementById(this.spriteId).style.transform = `rotate(${this.rotation}deg)`;

    this.sprite = document.getElementById(this.spriteId);

  }

  moveY(y){
    this.rotation += this.rotationVelocity;

    this.position.y += y;
  }

  draw(ctx){

    // context.clearRect(0,0,canvas.width,canvas.height);


    // ctx.setTransform(1, 0, 0, 1, this.position.x, this.position.y); // sets scale and origin
    ctx.save();

    ctx.translate(this.position.x + this.width/2, this.position.y + this.height/2);

    ctx.rotate(this.rotation * Math.PI/180);

    ctx.translate(0 - this.position.x - this.width/2, 0 - this.position.y - this.height/2);

    ctx.drawImage(this.sprite, this.position.x + this.width/2, this.position.y + this.height/2, this.width, this.height );


    ctx.restore();
  }
  
}

class Game{
  constructor(){
    this.intervals = []
    this.timeouts = []
    this.backgroundMusic = new Audio("./sound/bart the barter.wav")
    this.playerDamageSound = new Audio("./sound/damage.wav");
    this.gameoverSound = new Audio("./sound/gameover.wav");
    this.scoreSound = new Audio("./sound/score.wav");
    this.font = new FontFace('font', 'url(https://fonts.cdnfonts.com/s/19901/8-BIT%20WONDER.woff)');
    this.canvas = document.getElementById("mainCanvas");
    this.dpr = window.devicePixelRatio || 1;
    this.rect = this.canvas.getBoundingClientRect();
    this.canvas.width = this.rect.width * this.dpr;
    this.canvas.height = this.rect.height * this.dpr;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.font = '3vw font'
    this.player = new Player(1, this.rect.height-1.993025283347864*0.08*this.rect.height, 0.08*this.rect.width, 1.993025283347864*0.08*this.rect.height);
    this.eggs = [];
  }


  renderClear(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  render(){
    if(document.hasFocus()) {
      this.renderClear();


      if (this.player.lives > 0) {
        for (let i = 0; i < this.player.lives; i++) {
          this.ctx.drawImage(this.player.sprite, i * this.rect.width * 0.05, this.rect.height * 0.1, this.rect.width * 0.05, 1.993025283347864 * 0.05 * this.rect.height);
        }
        this.player.draw(this.ctx);
        this.eggs.forEach(eggs => {
          eggs.draw(this.ctx)
        });
        this.ctx.fillStyle = "white"
        this.ctx.fillText(`SCORE - ${this.player.caughtEggs}`, 0.01 * this.rect.width, 1.993025283347864 * 0.04 * this.rect.height)
      } else {
        if(highscore >= storedHighscore){
          localStorage.setItem("bunnyhighscore",highscore);
        }


        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0 * this.rect.width, 0 * this.rect.height, 1 * this.rect.width, 1 * this.rect.height)
        this.ctx.fillStyle = "white"
        this.ctx.fillText("START GAME", 0.3332555921861681 * this.rect.width, 0.525 * this.rect.height)
        this.ctx.fillStyle = "gray"
        this.ctx.fillText(`HIGH SCORE - ${highscore}`, 0.315 * this.rect.width, 0.7 * this.rect.height)
        // 0.0557565280126868
        this.mainMenu()
      }
    }
  }
  mainMenu() {
    this.reset(-10)
    document.addEventListener("click", this.onclick)
  }
  collision(egg) {

    let collision = this.player.position.x + this.player.width >= egg.position.x &&
    egg.position.x + egg.width >= this.player.position.x &&
    this.player.position.y + this.player.height >= egg.position.y &&
    egg.position.y + egg.height >= this.player.position.y

    if(collision){
      this.player.caughtEggs += egg.collisionReaction.score;
      this.player.lives += egg.collisionReaction.lives;

      if(egg.collisionReaction.mode){
        currentPostfix = "chalk";
        eggSpawnDelay = 1;
      }

    }

    return collision;
  }

  moveLeft(){
    game.player.moveX(-game.rect.width * game.player.speed / 1000);
    if (game.player.position.x < 0 - 0.9 * 0.08 * game.rect.width) {
      game.player.position.x = game.rect.width - 0.2 * 0.08 * game.rect.width
    }
  }
  moveRight(){
    game.player.moveX(game.rect.width * game.player.speed / 1000);
    if (game.player.position.x > game.rect.width - 0.2 * 0.08 * game.rect.width) {
      game.player.position.x = 0 - 0.2 * 0.3 * game.rect.width
    }
  }

  keyDown(e){
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        game.player.movingLeft = true
      }
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
      game.player.movingRight = true;
    }
  }

  keyUp(e){
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
      game.player.movingLeft = false
    }
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
      game.player.movingRight = false;
    }
  }
//   keydown(e){
//   if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
//   game.player.moveX(game.rect.height * 0.03);
//   if (game.player.position.x > game.rect.width - 0.2 * 0.08 * game.rect.width) {
//   game.player.position.x = 0 - 0.2 * 0.3 * game.rect.width
// }
// }
// if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
//   game.player.moveX(-game.rect.height * 0.03);
//   if (game.player.position.x < 0 - 0.9 * 0.08 * game.rect.width) {
//     game.player.position.x = game.rect.width - 0.2 * 0.08 * game.rect.width
//   }
// }
// }
onclick(e){
  // console.log("click")
  let canvasLeft = game.canvas.offsetLeft + game.canvas.clientLeft
  let  canvasTop = game.canvas.offsetTop + game.canvas.clientTop
  let x = e.pageX - canvasLeft
  let y = e.pageY - canvasTop;
  if(y > 0.5*game.rect.height-0.0557565280126868*game.rect.height && y < 0.5*game.rect.height-0.0557565280126868*game.rect.height + 0.0557565280126868*game.rect.height
      && x > 0.3332555921861681*game.rect.width && x < 0.3332555921861681*game.rect.width + 0.3332555921861681*game.rect.width) {
    game.startGame()
  }
}

  reset(lives){
    document.removeEventListener("keydown", this.keyDown)
    document.removeEventListener("keyup", this.keyUp)
    document.removeEventListener("click", this.onclick)
    this.intervals.forEach(interval=>{
      clearInterval(interval)
    })
    this.timeouts.forEach(timeout=>{
      clearTimeout(timeout)
    })
    this.backgroundMusic.pause()
    // this.playerDamageSound.pause();
    // this.gameoverSound.pause();
    // this.scoreSound.pause();

    if(!this.backgroundMusic.readyState){
      this.backgroundMusic.load();
    }
    if(!this.playerDamageSound.readyState){
      this.playerDamageSound.load();
    }

    if(!this.gameoverSound.readyState){
      this.gameoverSound.load();
    }
    if(!this.scoreSound.readyState){
      this.scoreSound.load();
    }

    game.player.movingLeft = false;
    game.player.movingRight = false;
    game.ctx.fillStyle = "black"
    game.eggs = []
    game.player.caughtEggs = 0;
    game.player.lives=lives;
    game.player.position.x=1;
    game.player.position.y=game.rect.height-1.993025283347864*0.08*game.rect.height;
  }
  startGame() {
    this.reset(3)
    document.addEventListener("keydown", game.keyDown)
    document.addEventListener("keyup", game.keyUp)
    this.backgroundMusic.play();
    game.intervals.push(setInterval(() => {
      if (document.hasFocus()) {
        game.eggs.push(new Egg(Math.floor(Math.random() * game.rect.width), 0, 0.08 * game.rect.height, 1.993025283347864 * 0.04 * game.rect.height));
      }
    }, eggSpawnDelay))

    game.intervals.push(setInterval(() => {
      if (document.hasFocus()) {
        game.player.position.y -= game.rect.height * 0.003
        game.timeouts.push(setTimeout(() => {
          game.player.position.y -= game.rect.height * 0.003;
        }, 50))
        game.timeouts.push(setTimeout(() => {
          game.player.position.y -= game.rect.height * 0.003;
        }, 100))
        game.timeouts.push(setTimeout(() => {
          game.player.position.y -= game.rect.height * 0.003;
        }, 150))
        game.timeouts.push(setTimeout(() => {
          game.player.position.y += game.rect.height * 0.003;
        }, 200))
        game.timeouts.push(setTimeout(() => {
          game.player.position.y += game.rect.height * 0.003;
        }, 250))
        game.timeouts.push(setTimeout(() => {
          game.player.position.y += game.rect.height * 0.003;
        }, 300))
        game.timeouts.push(setTimeout(() => {
          game.player.position.y += game.rect.height * 0.003;
          game.timeouts = []
        }, 350))
      }
    }, 400))
    game.intervals.push(setInterval(()=>{
      if(game.player.movingLeft===true){
        game.moveLeft()
      }
      if (game.player.movingRight===true){
        game.moveRight()
      }
    }, 1))
    game.intervals.push(setInterval(() => {
      if (document.hasFocus()) {
        game.eggs.forEach(eggs => {
          if (eggs.position.y < game.rect.height) {
            if (game.collision(eggs)) {
              let index = game.eggs.indexOf(eggs)
              game.eggs.splice(index, 1)
              // game.player.caughtEggs += 1;
              this.scoreSound.play();

              if(game.player.caughtEggs > highscore){
                highscore = game.player.caughtEggs;
              }

              console.log(game.player.caughtEggs)
            } else {
              eggs.moveY(game.rect.height * 0.005)
            }
          } else {
            let index = game.eggs.indexOf(eggs)
            game.eggs.splice(index, 1)
            game.player.lives = game.player.lives - 1;

            if(game.player.lives > 0){
              this.playerDamageSound.play();
            }
            else{
              console.log("ive died");
              // localStorage.setItem("bunnyhighscore",highscore)
              this.gameoverSound.play();
            }

            console.log(game.player.lives)
          }
        })
      }
        }, 20)
    )


  }


}



let game = new Game()
game.font.load().then(function(font){

  document.fonts.add(font);
  console.log('Font loaded');

  game.mainMenu()
setInterval(() => {
    game.render()
  }, TARGET_FRAMETIME_MILISECONDS)
});