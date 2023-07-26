
    const guessForm = document.getElementById('guessForm');
    const resultElement = document.getElementById('result');
    const scoreElement = document.querySelector('.score'); // Changed to use querySelector
    const guessedList = document.getElementById('guessedList');
    const clearButton = document.getElementById('clearButton');

let gameActive = true; // Variable to track if the game is still active
const guessedWords = new Set(); // Keep track of guessed words to prevent duplicates
let nplays = parseInt("{{ nplays }}"); // Parse the number of plays from the template variable
let highScore = parseInt("{{ highscore }}"); // Parse the high score from the template variable 



const handleGuessSubmit = async (event) => {
    event.preventDefault();//event handler function that is executed when the form is submitted - prevents default behavior of the form which will refresh the page upon submission.
    if (!gameActive) return; // If the game is not active, ignore the guess
    const formData = new FormData(guessForm);//creates new formData object- represents data submitted in the form- automatically gathers all the form fields and values
    const word = formData.get('guess').toLowerCase();
    
    if (word.length <= 1) {
        // Show an error message indicating that 1-letter words are not allowed
        resultElement.textContent = "Please enter a word with more than 1 letter.";
        return;
    }
    if (guessedWords.has(word)) {
        resultElement.textContent = `Already guessed ${word}.`;
        return;
    };


//HANDLEING THE AJAX REQUEST: 
    try {
        const response = await axios.post('/check-guess', formData); //MAKE HTTP POST REQUEST TO SERVER ENDPOINT. formData is sent as request body. SERVER WILL PROCESS DATA AND RESPOND WITH JSON OBJ CONTAINING RESULT OF USERS GUESS!
        console.log(response.data);
        const result = response.data.result; //EXTRACT "RESULT" PROPERTY FROM THE RESPONSE JSON OBJ containing the validation of users guess "ok", "not on board", etc

        if (result === "ok") { 
// Update the score on the front-end
            const word = formData.get('guess'); //get ok word from FormData object. //name='guess' in HTML
            const wordLength = word.length; //calc word lenth
            const currentScore = parseInt(scoreElement.textContent); //extract current score and converts to integer
            const newScore = currentScore + wordLength; //updates the content of the scoreElement with the new score, displaying it on the front-end.
            scoreElement.textContent = newScore;
     if (result === "ok" || result === "not-on-board") {
// Update the highest score if the current score is higher
            if (newScore > highScore) {
                 highScore = newScore;  
// Update the high score on the DOM
                 document.querySelector('.high-score').textContent = highScore;
                            }
                        }
 // Update the score and add the guessed word to the list
            const listItem = document.createElement('li');
            listItem.textContent = word;
            guessedList.appendChild(listItem);

              // Clear the guess box after successful guess
              document.getElementById('guessid').value = '';
            }

// Add the word to the guessedWords set
            guessedWords.add(word);
            console.log(resultElement.textContent)
        resultElement.textContent = result; //update content of resultElement with result "ok","not-on-board", "not-a-word"
    } catch (error) {
        console.error('Error:', error);
    }
};

// Add the event listener with the handleGuessSubmit function
    guessForm.addEventListener('submit', handleGuessSubmit);

// Function to clear the guessed words list
    const clearGuessedList = () => {
    guessedWords.clear();
    guessedList.innerHTML = ''; // Clear all list items
  };
  
// Add event listener to the Clear List button
    clearButton.addEventListener('click', clearGuessedList);

// Start a 60-second timer
setTimeout(() => {
    gameActive = false;
    guessForm.removeEventListener('submit', handleGuessSubmit);
    resultElement.textContent = "Time's up! Game over.";

    // Send AJAX request to the server with score and update the number of times played
    const score = parseInt(scoreElement.textContent); // Parse the score as an integer
    const data = {
        score: score, // Add score to the data object
        nplays: ++nplays, // Increment and add the number of plays to the data object
    };

    axios.post('/game-over', data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            console.log('Server response:', response.data);
            // Update the high score and number of plays on the front-end
            highScore = response.data.highScore;
            nplays = response.data.nplays;
            scoreElement.textContent = "0"; // Reset the score to 0 after the game ends

            // Update the high score on the DOM
            document.querySelector('.high-score').textContent = highScore;
        })
        .catch(error => {
            console.error('Error sending data to the server:', error);
        })
}, 60000);