// our javascript code

/****************************************************
 *** Variables ***
 ****************************************************/

// important HTML blocks
let container = document.querySelector("#game");
let player = document.querySelector("#player");
let ground = document.querySelector("#ground");
let enemies = document.querySelector("#enemies");
let popup = document.querySelector("#popup");
let startbutton = document.querySelector("#buttonstart");
let myaudio = document.querySelector('#myaudio');
let btnplay = document.querySelector('#btn-container');

// some parameters
// minimal margin to the bottom (in pixels)
let marginBottom = 100;
// plane jump speed (in seconds)
let jumpSpeed = 0.5;
// how much height is a jump (in pixels)
let jumpStep = 100;

// how long is a fall (in seconds)
let fallSpeed = 2;
// how much time after a jump do we fall (in milliseconds)
let timeToFallAfterJump = 400;

// delay between two enemies motion (in milliseconds)
//Vitesse de l'ennemi
let motionDelay = 10;
// motion distance at each step (in pixels)
let motionStep = 10;

// other variables
let spawn, motion, playerGravity;

function start(){
/****************************************************
 *** When game starts ***
 ****************************************************/

// enemy motion
motion = setInterval(function() {
  document.querySelectorAll("#enemies > .ennemy").forEach(function(div) {
    move(div);
  });
}, motionDelay);

playAudio();

btnplay.style.display = "none";
myaudio.style.display = "none";

// player gravity
// make the player fall
// change the player bottom margin
// 'px' is the unit (=pixels)
// thanks to the CSS 'transition' rule,
// the fall is progressive
player.style.bottom = marginBottom + "px";

// invoke an enemy
spawnEnemy();
spawnEnemy2();
  intervalID = window.setInterval(spawnEnemy,getRandomArbitrary(0, 2000));
  intervalID = window.setInterval(spawnEnemy2,getRandomArbitrary(0, 1700));


startbutton.style.display = "none";
}

/****************************************************
 *** Functions ***
 ****************************************************/

// make the player jump
document.addEventListener('keydown', (e) => {
  if (e.code === "Space") jump();
});
function jump() {
  // if we are on the top, don't jump anymore
  if (player.offsetTop < 50) return;
  // set the jump duration
  // as we use the CSS animation
  player.style.transition = jumpSpeed + "s";
  // the CSS animation is described in the 'fallingPlayer' class
  player.classList.remove("fallingPlayer");

  // if we jump, we stop the gravity fall
  clearInterval(playerGravity);

  // and then update the player position
  let offsetBottom =
    container.offsetHeight - (player.offsetTop + player.offsetHeight);
  player.style.bottom = offsetBottom + jumpStep + "px";

  // after we have jumped, we fall again (gravity)
  setGravity();
}


function playAudio() { 
  myaudio.play(); 
} 

function pauseAudio() { 
  myaudio.pause(); 
} 


// make the player fall after a jump
function setGravity() {
  playerGravity = setTimeout(function() {
    player.style.transition = fallSpeed + "s";
    player.style.bottom = marginBottom + "px";
  }, timeToFallAfterJump);
}

function getPosition(div) {
  let left = div.offsetLeft;
  let top = div.offsetTop;
  let right = div.offsetLeft + div.offsetWidth;
  let bottom = div.offsetTop + div.offsetHeight;

  // the '10' here is to allow some tolerance in the collision
  return [left + 10, right - 10, top + 10, bottom - 10];
}

// check if there is a collision between two blocks
function isCollision(bloc1, bloc2) {
  return !(
    bloc1[1] < bloc2[0] ||
    bloc1[0] > bloc2[1] ||
    bloc1[3] < bloc2[2] ||
    bloc1[2] > bloc2[3]
  );
}

// spawn a new enemy HTML block


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnEnemy() {
  let newObstacle = document.createElement("div");
  newObstacle.classList.add("grosminet");
  newObstacle.classList.add("ennemy");
  newObstacle.style.bottom = marginBottom + getRandomArbitrary(0, 600) + "px";
  enemies.appendChild(newObstacle);
}


function spawnEnemy2() {
  let newObstacle = document.createElement("div");
  newObstacle.classList.add("taz");
  newObstacle.classList.add("ennemy");
  newObstacle.style.bottom = marginBottom + getRandomArbitrary(0, 600) + "px";
  enemies.appendChild(newObstacle);

}



// move an enemy
// this function is called for each enemy step
// see the setInterval above
function move(div) {
  div.style.left = div.offsetLeft - motionStep + "px";

  if (div.offsetLeft <= 0) div.remove();

  posPlayer = getPosition(player);
  posObs = getPosition(div);

  if (isCollision(posPlayer, posObs)) stopAll();
}



// allow to stop the game
function stopAll() {
  // hide the player
  player.style.display = "none";

  // stop the enemies motion
  clearInterval(motion);

  // stop to spawn new enemies
  clearInterval(spawnEnemy);

  pauseAudio();

  //show popup game over
  popup.style.display = "flex";
}

