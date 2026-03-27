document.addEventListener("DOMContentLoaded", function () {

let randomNumber;
let prevGuesses = [];
let maxGuesses = 10;
let range = null; // 50, 100, 500 (difficulty)
let timer;
let timeLeft = 30; //countdown timer in seconds

// DOM ELEMENTS
const userInput = document.querySelector("#guessField"); //input field
const submit = document.querySelector("#subt");
const guessesSlot = document.querySelector(".guesses");
const remaining = document.querySelector(".lastResult"); //remaining guesses
const lowOrHi = document.querySelector(".lowOrHi"); //results text
const resetBtn = document.querySelector("#resetBtn"); 
const timerDisplay = document.getElementById("timer");

const difficultyScreen = document.getElementById("difficultyScreen"); 
const gameScreen = document.getElementById("gameScreen");
const rangeText = document.getElementById("rangeText");

const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const clickSound = document.getElementById("clickSound");


// 🔒 START ME GAME DISABLE
userInput.disabled = true; 
submit.disabled = true;


// 🎮 START GAME
function initGame(selectedRange) {
  range = selectedRange; //yha range set hogi difficulty ke hisab se
  randomNumber = Math.floor(Math.random() * range) + 1;

  prevGuesses = [];
  timeLeft = 30;

  guessesSlot.textContent = ""; //clear previous guesses
  remaining.textContent = maxGuesses; //10 guesses
  lowOrHi.textContent = ""; //clear result text 
  userInput.value = "";

  rangeText.textContent = `1 - ${range}`;

  // SCREEN SWITCH
  difficultyScreen.classList.add("hidden"); 
  gameScreen.classList.remove("hidden"); //show game screen

  userInput.disabled = false; //ab user input aur submit button enable kar denge
  submit.disabled = false;

  startTimer(); //start countdown timer

  console.log("Random:", randomNumber);
}


// 🎯 DIFFICULTY BUTTONS
document.getElementById("easy").addEventListener("click", () => initGame(50));
document.getElementById("medium").addEventListener("click", () => initGame(100));
document.getElementById("hard").addEventListener("click", () => initGame(500));


// ⏱ TIMER
function startTimer() {
  clearInterval(timer); //clear previous timer if any
  timerDisplay.textContent = timeLeft; //display initial time jo 30 seconds hai

  timer = setInterval(() => {
    timeLeft--;        //30, 29, 28, ...
    timerDisplay.textContent = timeLeft; //update timer UI

    if (timeLeft <= 0) {
      clearInterval(timer);
      lowOrHi.textContent = `⏰ Time Over! Number was ${randomNumber}`;
      playSound(loseSound);
      endGame();
    }
  }, 1000);
}


// 🎯 SUBMIT
submit.addEventListener("click", function (e) {
  e.preventDefault(); 
  playSound(clickSound);

  const guess = Number(userInput.value);

  // VALIDATION 
  if (guess < 1 || guess > range || isNaN(guess)) {
    lowOrHi.textContent = `⚠️ Enter between 1-${range}`;
    return;
  }

  if (prevGuesses.includes(guess)) { //duplicate guess checking
    lowOrHi.textContent = "⚠️ Duplicate guess!";
    return;
  }

  prevGuesses.push(guess);       //array me guess add hoga
  guessesSlot.textContent = prevGuesses.join(" "); //display previous guesses
  remaining.textContent = maxGuesses - prevGuesses.length; 

  // WIN
  if (guess === randomNumber) {
    lowOrHi.textContent = "🎉 You Win!";
    playSound(winSound);
    endGame();
    return;
  }

  // LOSE
  if (prevGuesses.length >= maxGuesses) {
    lowOrHi.textContent = `💀 Lost! Number was ${randomNumber}`;
    playSound(loseSound);
    endGame();
    return;
  }

  // HIGH / LOW LOGIC
  lowOrHi.textContent = guess < randomNumber ? "📉 Too Low!" : "📈 Too High!"; //Ternary Operator

  // CLOSE LOGIC
  let closeRange = range === 50 ? 3 : range === 100 ? 5 : 10; //difficulty ke hisab se close range set karenge

  if (Math.abs(guess - randomNumber) <= closeRange) { 
    lowOrHi.textContent += " 🔥 Very Close!";
  }

  userInput.value = ""; //input wapas reset hogya
});


// 🔊 SOUND
function playSound(sound) {
  if (!sound) return; //agar sound element exist nahi karta to return kar denge

  sound.currentTime = 0;
  sound.play().catch(() => {}); //play sound, agar koi error aata hai to catch kar lenge (jaise user ne sound block kar diya ho)
}


// 🔚 END GAME
function endGame() {
  userInput.disabled = true; //game end hone ke baad input aur submit button disable kar denge 
  submit.disabled = true;
  clearInterval(timer); //timer stop kar denge
}


// 🔄 RESTART
resetBtn.addEventListener("click", () => {
  clearInterval(timer);

  // BACK TO DIFFICULTY
  gameScreen.classList.add("hidden");
  difficultyScreen.classList.remove("hidden");

  // RESET STATE
  prevGuesses = [];
  range = null;
  timeLeft = 30;

  // RESET UI
  guessesSlot.textContent = "";
  remaining.textContent = maxGuesses;
  lowOrHi.textContent = "";
  userInput.value = "";

  // Again start me game disable kar denge jab tak user difficulty select nahi karta
  userInput.disabled = true;
  submit.disabled = true;
});

});
