const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope1, rope2, rope3, fruit,ground;
var fruit_con, fruit_con_2, fruit_con_3;

var bg_img;
var food;
var rabbit;

var button1, button2, button3;
var bunny;
var blink,eat,sad;

var bg_song;
var cut_sound, sad_sound, eating_sound, air_sound;

var blower, muteButton;
var canW, canH;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  bg_song = loadSound("sound1.mp3");
  sad_sound = loadSound("sad.wav");
  cut_sound = loadSound("rope_cut.mp3");
  eating_sound = loadSound("eating_sound.mp3");
  air_sound = loadSound("air.wav");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth+80,displayHeight);
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }

  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  
  button1 = createImg('cut_btn.png');
  button1.position(20,30);
  button1.size(50,50);
  button1.mouseClicked(drop1);

  button2 = createImg('cut_btn.png');
  button2.position(330,35);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg('cut_btn.png');
  button3.position(350,190);
  button3.size(50,50);
  button3.mouseClicked(drop3);
  
  rope1 = new Rope(7,{x:40,y:30});
  rope2 = new Rope(8,{x:350,y:35});
  rope3 = new Rope(8,{x:380,y:200});

  ground = new Ground(200,canH,600,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(170,canH-80,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);

  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope1.body,fruit);
  
  fruit_con = new Link(rope1,fruit);
  fruit_con_2 = new Link(rope2,fruit);
  fruit_con_3 = new Link(rope3, fruit);

  blower = createImg("blower.png");
  blower.position(10,250);
  blower.size(150,100);
  blower.mouseClicked(airBlow);

  muteButton = createImg("mute.png");
  muteButton.position(450,20);
  muteButton.size(50,50);
  muteButton.mouseClicked(mute);


  bg_song.play();
  bg_song.setVolume(0.25);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}


function draw() 
{
  background(51);
  image(bg_img, 500, 500, displayWidth+80, displayHeight);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope1.show();
  rope2.show();
  rope3.show();
  ground.show();
  Engine.update(engine);
  drawSprites();

  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    eating_sound.play();
  }
   
  if(fruit!=null && fruit.position.y >=650)
  {
     bunny.changeAnimation('crying');
     bg_song.stop();
     sad_sound.play();
     fruit = null;
  }

}

function drop1()
{
  rope1.break();
  fruit_con.dettach();
  fruit_con = null; 
  cut_sound.play();

}

function drop2()
{
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null; 
  cut_sound.play();

}

function drop3()
{
  rope3.break();
  fruit_con_3.dettach();
  fruit_con_3 = null; 
  cut_sound.play();
}

function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}

function airBlow(){
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.02, y:0});
  air_sound.play();
}

function mute(){
  if(bg_song.isPlaying()){
    bg_song.stop();
  }
  else{
    bg_song.play();
  }
}