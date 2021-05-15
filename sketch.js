var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed;
var lastFeed , feedTime;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed = createButton("Feed The Dog")
  feed.position(700,95);
  feed.mousePressed(feedDog)


  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj = new Food(foodS,lastFeed)
}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedTime = database.ref('hour');
  feedTime.on("value",function(data){
    lastFeed = data.val();
  });
 
  //write code to display text lastFed time here
  fill("black");
  textSize(30);
 
  text("Food Available:" + foodS,200,500);
  fill(255,255,254); 
  textSize(15); 
  if(lastFeed>=12){ 
    text("Last Feed : "+ lastFeed%12 + " PM", 350,30); 
  }else if(lastFeed==0){ 
    text("Last Feed : 12 AM",350,30); 
  }else{ 
    text("Last Feed : "+ lastFeed + " AM", 350,30); 
  } 

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({ 
    Food:foodObj.getFoodStock(),
    hour:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
