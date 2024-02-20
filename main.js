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

  //   console.log("player clg start..");
  //   console.log(x);
  //   console.log(y);
  //   console.log(width);
  //   console.log(height);
  //   console.log("player clg end!");

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

class Game{
  constructor(){
    this.isRunning = true;
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.entities = new Array();
    this.entities.push(new Player(1, 1, 50, 50));
  }

  renderClear(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  render(){
    this.renderClear();

    console.log(this.entities.length);

    this.entities.forEach(entity => {
      // console.log(entity.x);
      // console.log(entity.y);
      // console.log(entity.width);
      // console.log(entity.height);
      entity.draw(this.ctx);
    });

  }
}

let game = new Game()

document.addEventListener("keydown", (e)=>{
  if(e.key=="d" || e.key=="D"){
      game.entities[0].moveX(10);
      // console.log("keyd")
  }
  if(e.key=="a" || e.key=="A"){
      // console.log("keya")
      game.entities[0].moveX(-10);
  }
})

  setInterval(()=>{;
    game.render()
  },TARGET_FRAMETIME_MILISECONDS);

