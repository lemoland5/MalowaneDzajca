console.log("Starting load..");

const TARGET_FRAMERATE = 60;
const TARGET_FRAMETIME_MILISECONDS = 1000 / TARGET_FRAMERATE;
class Point{
  constructor(x, y){
      this.x = x;
      this.y = y;
  }
}

class Player{
  constructor(x, y, width, height){
    this.caughtEggs=undefined
    this.lives=undefined
    this.position = new Point(x, y);

    this.width = width;
    this.height = height;

    this.spriteId = "buniimg";
    this.sprite = document.getElementById(this.spriteId);
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

    this.width = width;
    this.height = height;

    this.spriteId = "buniimg";
    this.sprite = document.getElementById(this.spriteId);
  }

  moveY(y){
    this.position.y += y;
  }

  draw(ctx){
    ctx.drawImage(this.sprite, this.position.x, this.position.y, this.width, this.height);
  }
}

class Game{
  constructor(){
    this.intervals = []
    this.timeouts = []
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
    this.renderClear();
    if (this.player.lives>0) {
      for (let i = 0; i < this.player.lives; i++) {
        this.ctx.drawImage(this.player.sprite, i * this.rect.width * 0.05, this.rect.height * 0.1, this.rect.width * 0.05, 1.993025283347864 * 0.05 * this.rect.height);
      }
      this.player.draw(this.ctx);
      this.eggs.forEach(eggs => {
        eggs.draw(this.ctx)
      });
      this.ctx.fillText(`Punkty: ${this.player.caughtEggs}`, 0.01 * this.rect.width, 1.993025283347864 * 0.04 * this.rect.height)
    }else{
      this.intervals.forEach(interval=>{
        clearInterval(interval)
      })
      this.timeouts.forEach(timeout=>{
        clearTimeout(timeout)
      })
      startGame()
    }
  }
  collision(egg) {
    return (
        this.player.position.x + this.player.width >= egg.position.x &&
        egg.position.x + egg.width >= this.player.position.x &&
        this.player.position.y + this.player.height >= egg.position.y &&
        egg.position.y + egg.height >= this.player.position.y
    )
  }
  keydown(e){
  if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
  game.player.moveX(game.rect.height * 0.03);
  if (game.player.position.x > game.rect.width - 0.2 * 0.08 * game.rect.width) {
  game.player.position.x = 0 - 0.2 * 0.3 * game.rect.width
}
}
if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
  game.player.moveX(-game.rect.height * 0.03);
  if (game.player.position.x < 0 - 0.9 * 0.08 * game.rect.width) {
    game.player.position.x = game.rect.width - 0.2 * 0.08 * game.rect.width
  }
}
}
}

function startGame() {
  document.removeEventListener("keydown", game.keydown)
  game.eggs = []
  game.player.caughtEggs = 0;
  game.player.lives=3;
  game.player.position.x=1;
  game.player.position.y=game.rect.height-1.993025283347864*0.08*game.rect.height;
  document.addEventListener("keydown", game.keydown)

  game.intervals.push(setInterval(() => {
    game.eggs.push(new Egg(Math.floor(Math.random() * game.rect.width), 0, 0.08 * game.rect.height, 1.993025283347864 * 0.04 * game.rect.height));
  }, 1000))

  game.intervals.push(setInterval(() => {
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
  }, 400))

  game.intervals.push(setInterval(() => {
        game.eggs.forEach(eggs => {
          if (eggs.position.y < game.rect.height) {
            if (game.collision(eggs)) {
              let index = game.eggs.indexOf(eggs)
              game.eggs.splice(index, 1)
              game.player.caughtEggs += 1;
              console.log(game.player.caughtEggs)
            } else {
              eggs.moveY(game.rect.height * 0.005)
            }
          } else {
            let index = game.eggs.indexOf(eggs)
            game.eggs.splice(index, 1)
            game.player.lives = game.player.lives - 1;
            console.log(game.player.lives)
          }
        })
      }, 20)
  )
  game.intervals.push(setInterval(() => {
    game.render()
  }, TARGET_FRAMETIME_MILISECONDS))

}




let game = new Game()
game.font.load().then(function(font){

  document.fonts.add(font);
  console.log('Font loaded');
  startGame()

});