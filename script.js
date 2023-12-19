const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY= 10;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;  // timer hai
let score = 0;
let musicStarted = false;

// store highscore in local storage and update highscore text
let highscore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Highscore: ${highscore}`;

// change food position randomly
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// when game is over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    toggleSound("./sound/Run-Amok.mp3", true);
    alert("Game over!");
    location.reload();
}

// change direction
const changeDirection = (e) => {
    // console.log(e);
    let isRightKey = false;
    if(e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
        isRightKey = true;
    }

    if(musicStarted === false && isRightKey === true) {
        toggleSound("./sound/Run-Amok.mp3", gameOver);
        musicStarted = true;
    }

    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// buttons pe click karne ka even listener add kiya hai
controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
    // key.addEventListener("click", console.log(key));
})

// play bg music
const toggleSound = (audioName, gameOver) => {
    let audio = new Audio(audioName);
    if(gameOver === true) {
        audio.pause();
    }
    else {
        audio.loop = true;
        audio.play();
    }
}

// add sound on eating food
const foodSound = (audioName) => {
    let audio = new Audio(audioName);
    audio.play();
}


const initGame = () => {
    if(gameOver) return handleGameOver();
    
    
    // creating a food div and inserting in the playboard element
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    // check if snake hits the food
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);  // pushing food positon to snake body
        
        score++;
        foodSound("./sound/mixkit-arcade-retro-changing-tab-206.wav");
        if(score > highscore) {
            highscore = score;
        }
        localStorage.setItem("high-score", highscore);
        highScoreElement.innerText = `Highscore: ${highscore}`;
        scoreElement.innerText = `Score: ${score}`;
    }
    
    // shifting forward the values of the elements in the snakes body
    for(let i=snakeBody.length-1; i>0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    
    // Setting first element of snake body to current snake position
    snakeBody[0] = [snakeX, snakeY];
    
    // updating snakes head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // check if snake hits the wall
    if(snakeX <= 0 || snakeY <= 0 || snakeX > 30 || snakeY > 30) {
        gameOver = true;
        console.log("game over");
    }
    
    
    // add div for each part of snake body
    for(let i=0; i<snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        // check if snake head is hitting the body
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    // if want to make snake pass through walls
    // if (snakeX <= 0) {
    //     snakeX = 30; // Set snakeX to the opposite wall position
    // } 
    // else if (snakeY <= 0) {
    //     snakeY = 30; // Set snakeY to the opposite wall position
    // } 
    // else if (snakeX > 30) {
    //     snakeX = 1; // Set snakeX to the opposite wall position
    // } 
    // else if (snakeY > 30) {
    //     snakeY = 1; // Set snakeY to the opposite wall position
    // }

    playBoard.innerHTML = html;
}
   
changeFoodPosition(); 

// setInterval karne se automatically har 200 ms mai hilega snake
setIntervalId = setInterval(initGame, 100); 

document.addEventListener("keydown", changeDirection);
  

