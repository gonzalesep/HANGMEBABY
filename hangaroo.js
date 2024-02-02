var questions = {
    easy: [
        { text: "Capital of Japan", answer: "TOKYO" },
        { text: "Capital of Philippines", answer: "MANILA" },
        { text: "Tagline of Mendova", answer: "PRE" },
        { text: "Father of Opersyst", answer: "JAVIER" },
        { text: "Father of Webprog", answer: "SAMBAJON" },
        { text: "Father of Comporg/Datstruc", answer: "WU" },
        { text: "Surname of Jhon Travis", answer: "DELIGERS" },
        { text: "Currency of Philippines", answer: "PH PESO" },
        { text: "Main Character of Pepito Manaloto", answer: "BITOY" },
        { text: "Quality Speaker Brand", answer: "JBL" },
    ],
    moderate: [
        { text: "What does HTML stand for?", answer: "HYPERTEXT MARKUP LANGUAGE" },
        { text: "What is the command to clone a Git repository?", answer: "GIT CLONE" },
        { text: "What does CPU stand for?", answer: "CENTRAL PROCESSING UNIT" },
        { text: "What is the full form of PDF?", answer: "PORTABLE DOCUMENT FORMAT" },
        { text: "Process of making a computer file smaller called?", answer: "COMPRESSION" },
        { text: "Store information that needs to be used quickly.", answer: "RAM" },
        { text: "Output device that displays information in pictorial or textual form.", answer: "MONITOR" },
        { text: "Manages all of the software and hardware on the computer", answer: "OPERATING SYSTEM" },
        { text: "Who is known as the father of modern computers?", answer: "ALANTURING" },
        { text: "Open Source Operating System​", answer: "LINUX" },
    ],
    hard: [
        { text: "Explain the concept of multithreading.", answer: "PARALLEL EXECUTION OF THREADS" },
        { text: "What is the purpose of a virtual private network (VPN)?", answer: "SECURE NETWORK COMMUNICATION" },
        { text: "Developer of JavaScript", answer: "BRENDAN EICH" },
        { text: "What English man was a mathematician, philosopher, inventor and mechanical engineer, and is largely considered the originator of the concept of a digital programmable computer? Hint: his name rhymes with a common vegetable", answer: "CHARLES BABBAGE" },
        { text: "The Hardest programming language 14 lines in just a single output hello word", answer: "MALBOGE" },
        { text: "What is the name of the first computer?", answer: "ELECTRONIC NUMERICAL INTEGRATOR AND COMPUTER" },
        { text: "What does the  HTTP stand for ", answer: "HYPERTEXT TRANSFER PROTOCOL" },
        { text: "What does ASCII stand for?", answer: "AMERICAN STANDARD CODE FOR INFORMATION INTERCHANGE" },
        { text: "The H-Store system is considered one of the most prominent examples in the class of parallel database management systems which are typically known by what six-letter name?", answer: "NEWSQL" },
        { text: "What does ‘DOS’ stand for in computer terms?", answer: "DISK OPERATING SYSTEM" },
        
    ]
};


var currentDifficulty = "easy";
var currentQuestionIndex = 0;
var score = 0;
var incorrectGuesses = 0;
var cluesUsed = 0;
var currentWord = [];
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function startGame() {
    var selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
    if (selectedDifficulty) {
        currentDifficulty = selectedDifficulty.value;
        currentQuestionIndex = 0;
        score = 0;
        incorrectGuesses = 0;
        cluesUsed = 0;
        document.getElementById("question").textContent = ""; // Clear question

        // Shuffle questions for the selected difficulty level
        shuffleArray(questions[currentDifficulty]);

        initGame();
    } else {
        alert("Please select a difficulty level before starting the game.");
    }
}

function restartGame() {
    // Reload the entire page to start a new game
    location.reload();
}

function updateDifficultyRadioButton() {
    var radioButtons = document.getElementsByName("difficulty");
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].value === currentDifficulty) {
            radioButtons[i].checked = true;
            break;
        }
    }
}


function initGame() {
    updateDifficultyRadioButton(); // Update selected radio button
    var currentQuestion = questions[currentDifficulty][currentQuestionIndex];
    document.getElementById("question").textContent = currentQuestion.text;
    generateWordContainer(currentQuestion.answer);
    generateKeyboard();
    updateScore();
}


function generateWordContainer(answer) {
    var wordContainer = document.getElementById("word-container");
    currentWord = Array.from(answer).map(char => char === ' ' ? ' ' : '_');
    wordContainer.textContent = currentWord.join(' ');
}

function generateKeyboard() {
    var keyboardContainer = document.getElementById("keyboard-container");
    keyboardContainer.innerHTML = "";
    for (var i = 0; i < alphabet.length; i++) {
        var letterButton = document.createElement("button");
        letterButton.textContent = alphabet[i];
        letterButton.addEventListener("click", function () {
            guessLetter(this.textContent);
        });
        keyboardContainer.appendChild(letterButton);
    }
}

function guessLetter(letter) {
    letter = letter.toUpperCase(); // Convert to uppercase
    if (currentWord.includes('_')) {
        var currentQuestion = questions[currentDifficulty][currentQuestionIndex];
        var uppercaseAnswer = currentQuestion.answer.toUpperCase(); // Convert answer to uppercase
        if (uppercaseAnswer.includes(letter)) {
            for (var i = 0; i < uppercaseAnswer.length; i++) {
                if (uppercaseAnswer[i] === letter) {
                    currentWord[i] = letter;
                }
            }
            if (!currentWord.includes('_')) {
                // Correct answer
                score += 20;
                nextQuestion();
            }
        } else {
            incorrectGuesses++;
            if (incorrectGuesses === 3) {
                gameOver();
                return; // End the function to prevent further processing
            } else {
                // Display warning for incorrect guess
                alert("Incorrect guess! You have " + (3 - incorrectGuesses) + " attempts left.");
            }
        }
        updateScore();
        updateWordContainer();
    }
}



function updateWordContainer() {
    var wordContainer = document.getElementById("word-container");
    wordContainer.textContent = currentWord.join(' ');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions[currentDifficulty].length) {
        initGame();
    } else {
        // End of the current difficulty level
        alert("Congratulations! You've completed the " + currentDifficulty + " level.");
        // Proceed to the next difficulty level
        switch (currentDifficulty) {
            case "easy":
                currentDifficulty = "moderate";
                break;
            case "moderate":
                currentDifficulty = "hard";
                break;
            case "hard":
                alert("You've completed all difficulty levels!");
                // You may choose to restart the game or take any other action here
                break;
        }
        // Reset question index and shuffle questions for the new difficulty level
        currentQuestionIndex = 0;
        shuffleArray(questions[currentDifficulty]);
        initGame();
    }
}


function getClue() {
    if (cluesUsed < 3) {
        // Check if the player has enough points for a clue
        if (score >= 25) {
            var currentQuestion = questions[currentDifficulty][currentQuestionIndex];
            var hiddenChars = currentWord.map((char, index) => char === '_' ? currentQuestion.answer[index] : null);
            var hiddenConsonants = hiddenChars.filter(char => char && !'aeiou'.includes(char.toLowerCase()));
            var hiddenVowels = hiddenChars.filter(char => char && 'aeiou'.includes(char.toLowerCase()));

            var randomClue;
            if (hiddenConsonants.length > 0 && Math.random() < 0.5) {
                randomClue = hiddenConsonants[Math.floor(Math.random() * hiddenConsonants.length)];
            } else if (hiddenVowels.length > 0) {
                randomClue = hiddenVowels[Math.floor(Math.random() * hiddenVowels.length)];
            } else {
                // No hidden consonants or vowels, show any hidden character
                randomClue = hiddenChars[Math.floor(Math.random() * hiddenChars.length)];
            }

            // Replace this alert with your actual clue display logic
            alert("Clue: " + randomClue);

            cluesUsed++;
            score -= 25;
            updateScore();
        } else {
            alert("You don't have enough points for a clue. Keep playing!");
        }
    } else {
        alert("No more clues available!");
    }
}


function updateScore() {
    document.getElementById("score").textContent = "Score: " + score;
}

function gameOver() {
    alert("Game Over! You've reached the maximum incorrect guesses.");

    // Reload the entire page to start a new game
    location.reload();
}


function startGame() {
    var selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
    if (selectedDifficulty) {
        currentDifficulty = selectedDifficulty.value;
        currentQuestionIndex = 0;
        score = 0;
        incorrectGuesses = 0;
        cluesUsed = 0;
        document.getElementById("question").textContent = ""; // Clear question

        // Shuffle questions for the selected difficulty level
        shuffleArray(questions[currentDifficulty]);

        initGame();
    } else {
        alert("Please select a difficulty level before starting the game.");
    }
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


