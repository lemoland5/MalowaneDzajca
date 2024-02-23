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
    ctx.drawImage(this.sprite, this.position.x, game.canvas.height-this.height, this.width, this.height);
  }
}

class Jajco{
  constructor(x, y, width, height){
    this.position = new Point(x, 0);

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
    this.isRunning = true;
    this.canvas = document.getElementById("mainCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.entities = new Array();
    this.entities.push(new Player(1, 1, 50, 50));
    this.jajca = new Array();
  }

  renderClear(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  render(){
    this.renderClear();

    this.entities.forEach(entity => {
      entity.draw(this.ctx);
      this.jajca.forEach(jajca =>{
        jajca.draw(this.ctx)
      })
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

setInterval(()=>{
  game.jajca.push(new Jajco(Math.floor(Math.random()*game.canvas.width), 0, 20, 20));
},1000)

setInterval(()=>{
  game.jajca.forEach(jajca => {
    if (jajca.position.y<game.canvas.height){
      jajca.moveY(1)
    }else{
      let index = game.jajca.indexOf(jajca)
      game.jajca.splice(index, 1)
      console.log("Egg discombobulate")
    }
  })
},20)


  setInterval(()=>{
    game.render()
  },TARGET_FRAMETIME_MILISECONDS);

