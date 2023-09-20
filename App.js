const countryName = document.getElementById("countryName");
const AnswerTypes = document.getElementById("options");
const resultTypes = document.getElementById("result");
const nextButton = document.getElementById("nextButton");
const timeCounter = document.getElementById("timer");
const correct_Answer = document.getElementById("correctAnswers");
const  wrongAnswer = document.getElementById("wrongAnswers");
  
let currentCountry = {};
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let questionNumber = 0;
let timeLeft = 15;
let timerInterval;

async function fetchRandomCountry() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

async function setupGame() {
  document.getElementById("playAgainButton").style.display = "none";
  currentCountry = await fetchRandomCountry();
  countryName.textContent = currentCountry.name.common;

  const correctOptionIndex = Math.floor(Math.random() * 4);
  const options = [currentCountry.capital[0]];

  for (let i = 0; i < 4; i++) {
    if (i !== correctOptionIndex) {
      let randomCountry = await fetchRandomCountry();
      while (randomCountry.capital[0] === currentCountry.capital[0]) {
        randomCountry = await fetchRandomCountry();
      }
      options.push(randomCountry.capital[0]);
    }
  }

  shuffleArray(options);
  AnswerTypes.innerHTML = "";
  options.forEach((option) => {
    AnswerTypes.innerHTML += `<button class="option" onclick="checkAnswer(this)">${option}</button>`;
  });

  resultTypes.textContent = "";
  nextButton.style.display = "none";
  correct_Answer.textContent = ` correct answers😎 ${correctAnswers}`;
  wrongAnswer.textContent = `found wrong😥${wrongAnswers}`;
  startTimer();
}

function startTimer() {
  timeLeft = 15;
  timeCounter.textContent = timeLeft;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timeCounter.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      checkAnswer(null);
    }
  }, 1000);
}



function playAgain() {
  questionNumber = 0;
  score = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  setupGame();
  document.getElementById("playAgainButton").style.display = "none";
}
 
function checkAnswer(selectedButton) {
    clearInterval(timerInterval);
    const selectedOption = selectedButton ? selectedButton.textContent : null;
    if (selectedOption === currentCountry.capital[0]) {
      score += 1;
      correctAnswers += 1;
      resultTypes.textContent = "Right😎";
    } else {
      wrongAnswers += 1;
      resultTypes.textContent = "error😢";
    }
    
    AnswerTypes.querySelectorAll(".option").forEach((button) => {
      if (button.textContent === currentCountry.capital[0]) {
        button.style.backgroundColor = "green";
      } else {
        button.style.backgroundColor = "red";
      }
      button.disabled = true;
    });
      
    correct_Answer.textContent = `correct answers😎-> ${correctAnswers}`;
    wrongAnswer.textContent = `found wrong😥-> ${wrongAnswers}`;
    nextButton.style.display = "block";
  }
   
  
function nextQuestion() {
  if (questionNumber < 10) {
    questionNumber += 1;
    setupGame();
  } else {
    resultTypes.textContent = `Game over. You ${score} have scored! : you are great keep it up👍🤞✌️`;
    
    nextButton.style.display = "none";
    document.getElementById("playAgainButton").style.display = "block";
    
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

setupGame();