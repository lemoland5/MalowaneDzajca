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

class Jajco{
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
    this.zlapanejajca = 0;
    this.canvas = document.getElementById("mainCanvas");
    this.dpr = window.devicePixelRatio || 1;
    this.rect = this.canvas.getBoundingClientRect();
    this.canvas.width = this.rect.width * this.dpr;
    this.canvas.height = this.rect.height * this.dpr;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.font = '3vw Arial'
    this.entities = new Array();
    this.entities.push(new Player(1, this.rect.height-1.993025283347864*0.08*this.rect.height, 0.08*this.rect.width, 1.993025283347864*0.08*this.rect.height));
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
    this.ctx.fillText(`Punkty: ${this.zlapanejajca}`, 0.01*this.rect.width, 1.993025283347864*0.04*this.rect.height)

  }
  collision(jajco) {
    return (
        this.entities[0].position.x + this.entities[0].width >= jajco.position.x &&
        jajco.position.x + jajco.width >= this.entities[0].position.x &&
        this.entities[0].position.y + this.entities[0].height >= jajco.position.y &&
        jajco.position.y + jajco.height >= this.entities[0].position.y
    )
  }
}

let game = new Game()

document.addEventListener("keydown", (e)=>{
  if(e.key=="d" || e.key=="D"){
      game.entities[0].moveX(game.rect.height*0.03);
      // console.log("keyd")
  }
  if(e.key=="a" || e.key=="A"){
      // console.log("keya")
      game.entities[0].moveX(-game.rect.height*0.03);
  }
})

setInterval(()=>{
  game.jajca.push(new Jajco(Math.floor(Math.random()*game.rect.width), 0, 0.08*game.rect.height, 1.993025283347864*0.04*game.rect.height));
},1000)
setInterval(()=>{
  game.entities[0].position.y -= game.rect.height*0.003
  setTimeout(()=>{
    game.entities[0].position.y -= game.rect.height*0.003;
  },50)
  setTimeout(()=>{
    game.entities[0].position.y -= game.rect.height*0.003;
  },100)
  setTimeout(()=>{
    game.entities[0].position.y -= game.rect.height*0.003;
  },150)
  setTimeout(()=>{
    game.entities[0].position.y += game.rect.height*0.003;
  },200)
  setTimeout(()=>{
    game.entities[0].position.y += game.rect.height*0.003;
  },250)
  setTimeout(()=>{
    game.entities[0].position.y += game.rect.height*0.003;
  },300)
  setTimeout(()=>{
    game.entities[0].position.y += game.rect.height*0.003;
  },350)
},400)

setInterval(()=>{
  game.jajca.forEach(jajca => {
    if (jajca.position.y<game.canvas.height){
      if (game.collision(jajca)) {
        let index = game.jajca.indexOf(jajca)
        game.jajca.splice(index, 1)
        console.log("Egg discombobulate")
        game.zlapanejajca+=1;
        console.log(game.zlapanejajca)
      }else{
        jajca.moveY(game.rect.height*0.005)
    }
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

