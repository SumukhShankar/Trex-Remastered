var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth-20,displayHeight-120);
  camera.velocityX = (6 + 3*score/100);
  trex = createSprite(50,displayHeight/2,20,50);
  trex.velocityX = (6 + 3*score/100);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(camera.x,displayHeight - 300,400,20);
  ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(camera.x,displayHeight/2 - 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.x,displayHeight/2 + 25);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.75;
  restart.scale = 0.75;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,displayHeight - 290,400,10);
  invisibleGround.visible = true;
  invisibleGround.velocityX = (6 + 3*score/100);
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  textSize(30);
  text("Score: "+ score, camera.x,displayHeight-700);
  gameOver.x = camera.x;
  restart.x = camera.x;
  camera.position.x = (trex.x + 700);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= displayHeight-340) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < trex.x + 500){
      ground.x = camera.x ;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    invisibleGround.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x + displayWidth/2,75,40,10);
    cloud.y = Math.round(random(displayHeight - 600,displayHeight - 450));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -(6 + 3*score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x + displayWidth/2,displayHeight-310,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  spawnClouds();
  spawnObstacles();
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
  trex.velocityX = (6 + 3*score/100);
  invisibleGround.velocityX = (6 + 3*score/100);
  
  score = 0;
  
}