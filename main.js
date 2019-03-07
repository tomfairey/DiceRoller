// Declare the username and password as variables in Base64 encoding so it is not directly viewable by the user
var authUsername = "VQ=="; // U
var authPassword = "UA=="; // P

// Declare an array with the unicode characters for displaying the dice
var diceCharacters = ["&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"];

function startLogin() {
    // Once the page loads show the div that contains the login box to allow the user to interact and login
    document.getElementById("loginBox").style.display = "block";
};

function confirmLogin() {
    // Set the username that was entered as a variable we can access
    var enteredUsername = document.getElementById("username").value;
    // Set the password that was entered as a variable we can access
    var enteredPassword = document.getElementById("password").value;
    // Check that the username is correct and if not show an error message
    if (btoa(enteredUsername) === authUsername) {
        // Check that the password is correct and if not show an error message
        if (btoa(enteredPassword) === authPassword) {
            // If the username and password is correct hide the login box...
            document.getElementById("loginBox").style.display = "none";
            // and start the game using an earlier defined function
            startGame();
        } else {
            // Log to the JS console that the password is incorrrect for testing purposes
            console.log("Incorrect Password");
            // Tell the user that the password is incorrect
            document.getElementById("messageText").innerText = "Incorrect password...";
        };
    } else {
        // Log to the JS console that the username is incorrrect for testing purposes
        console.log("Incorrect Username");
        // Tell the user that the username is incorrect
        document.getElementById("messageText").innerText = "Incorrect username...";
    };

};

function storeWinner(name, score) {
    // Hide roll boxes
    document.getElementById("gameBox").style.display = "none";
    document.getElementById("winnerBox").style.display = "block";
    // Show winner to users
    document.getElementById("winnerName").innerHTML = name+" with "+score;
    // Save file to local storage
    // If scoreboard already exists then bring in the data and add to it
    if(localStorage.getItem('scoreboard')){
        // Get the JSON data from local storage and store in variable as an array
        var scoreboard = JSON.parse(localStorage.getItem('scoreboard'));
        // Add a new record to the end of the array
        scoreboard.push(name, score);
        // Encode the array with the new record as JSON
        scoreboard = JSON.stringify(scoreboard);
        // Save the JSON to the local storage overwriting the previous record
        localStorage.setItem('scoreboard', scoreboard);
    } else {
         // Make new variable as an array to store the data in
        var scoreboard = [];
        // Add a new record to the end of the array
        scoreboard.push(name, score);
        // Encode the array with the new record as JSON
        scoreboard = JSON.stringify(scoreboard);
        // Save the JSON to the local storage
        localStorage.setItem('scoreboard', scoreboard);
    }
}

function playAgain() {
    document.getElementById("winnerBox").style.display = "none";
    document.getElementById("playerOneName").value = "";
    document.getElementById("playerTwoName").value = "";
    document.getElementById("playerOneNameDisplay").innerHTML = "Player One";
    document.getElementById("playerTwoNameDisplay").innerHTML = "Player Two";
    document.getElementById("playerOneName").disabled = false;
    document.getElementById("playerTwoName").disabled = false;
    document.getElementById("playerOneRoll").disabled = false;
    document.getElementById("playerTwoRoll").disabled = false;
    startGame();
}

function startGame() {
    // Show the div containing the game to allow for user interaction
    document.getElementById("gameBox").style.display = "block";
    // Set both player's scores and amount of rolls to 5
    window.playerOneScore = 0;
    window.playerOneRoles = 5;
    window.playerTwoScore = 0;
    window.playerTwoRoles = 5;
    // Display scoreboard if it exists
    if(localStorage.getItem('scoreboard')){
        var scoreboard = JSON.parse(localStorage.getItem('scoreboard'));
        scoreboard.forEach(function(data){
            
        });
    };
};

function playerRoll(player) {
    // Set name for players
    document.getElementById(player+"Name").disabled = true;
    // If the users have not entered a name then set names to "Player One" and "Player Two" respectively
    if(document.getElementById(player+"Name").value.length == 0) {
        document.getElementById(player+"Name").value = document.getElementById(player+"Name").placeholder;
    }
    // Set the name as a global variable that can be accessed later
    window[player+"Name"] = document.getElementById(player+"Name").value;
    // Change the name on the page to the user's chosen name and thus display it
    document.getElementById(player+"NameDisplay").innerHTML = window[player+"Name"];
    // Generate the dice roll array which includes two integers for the two dice and a boolean for whether the dice are doubles
    var thisRoll = rollDice();
    // Define the delay and runs of zero so the function can be run without interferenece of any previous runs
    var delay = 0, runs = 0;
    // Disable the button to prevent any new instances of the function while one is already running
    document.getElementById(player+"Roll").disabled = true;
    // Run the function in a loop for 8 times
    while(runs <= 16){
        // If we are the final run then we need to display to final roll
        if (runs == 16){
            // Sets a timeout as the loop runs instantly but we need each to be delayed as all at once will cause an issue and the order to be determined by the management of the browser
            setTimeout(function() {
                // Set variables for the value of each die
                var diceOneArrayValue = thisRoll[0] - 1, diceTwoArrayValue = thisRoll[1] - 1, rollSum = thisRoll[0] + thisRoll[1];
                // If the sum of the roll is even then add ten points to the score as we are required to do this
                if (rollSum % 2 == 0) {
                    rollSum = rollSum + 10;
                    console.log("EVEN ROLE:");
                    console.log(window[player+"Name"]+" has 10 points added...");
                // If the sum of the roll is odd then take away five points as asked for by the brief
                } else if (rollSum % 2 == 1) {
                    rollSum = rollSum - 5;
                    console.log("ODD ROLE:");
                    console.log(window[player+"Name"]+" has 5 points removed...");
                }
                // If you roll a double then gain an extra roll as asked for by the brief
                if (thisRoll[3]) {
                    window[player+"Roles"] = window[player+"Roles"] + 1;
                    console.log("DOUBLE ROLLED:");
                    console.log(window[player+"Name"]+" has an extra role...");
                }
                // Add the current roll score to the overall score
                window[player+"Score"] = window[player+"Score"] + rollSum;
                // As is it requested that the score never drop below zero this determines that is the score is less than zero then set it to zero
                if (window[player+"Score"] < 0) {
                    window[player+"Score"] = 0;
                }
                // Display the user's score to the user
                document.getElementById(player + "Dice").innerHTML = window[player+"Score"];
                // Count the roll so that the user has a limit
                window[player+"Roles"] = window[player+"Roles"] - 1;
                // Display the ASCII character dice as a visual representation for the user
                document.getElementById(player + "DiceDisplay").innerHTML = diceCharacters[diceOneArrayValue] + diceCharacters[diceTwoArrayValue];
                // If the player has had less than 5 rolls then allow them to make another roll next
                if (window[player+"Roles"] > 0) {
                    // Enable the button so a role may be made by the user
                    document.getElementById(player+"Roll").disabled = false;
                } else {
                    // If both users has had five or more rolls then see if there is a winner
                    if (window["playerOneRoles"] <= 0 && window["playerTwoRoles"] <= 0) {
                        if (window["playerOneScore"] > window["playerTwoScore"]) {
                            // P1 WIN SITUATION
                            console.log("WINNER:");
                            console.log("Player 1 has won...");
                            // Store the winner's name and score in JavaScript local storage within the browser for the scoreboard
                            storeWinner(window["playerOneName"], window["playerOneScore"]);
                        } else if (window["playerOneScore"] < window["playerTwoScore"]) {
                            // P2 WIN SITUATION
                            console.log("WINNER:");
                            console.log("Player 2 has won...");
                            // Store the winner's name and score in JavaScript local storage within the browser for the scoreboard
                            storeWinner(window["playerTwoName"], window["playerTwoScore"]);
                        } else if (window["playerOneScore"] === window["playerTwoScore"]) {
                            // TIE SITUATION
                            // Enable the button for both users so a role may be made by both the users to break the tie
                            window[player+"Roles"] = window["playerOneRoles"] + 1;
                            window[player+"Roles"] = window["playerTwoRoles"] + 1;
                            document.getElementById("playerOneRoll").disabled = false;
                            document.getElementById("playerTwoRoll").disabled = false;
                            console.log("TIE SITUATION:");
                            console.log("Each player now has one extra role...");
                        }
                    }
                }
                // Set runs to zero so function will work for any further rolls
                runs = 0;
            }, delay);
        } else {
            // Display random dice rolls to give the user a sense that the dice is really rolling
            setTimeout(function() {
                document.getElementById(player + "Dice").innerHTML = "?";
                document.getElementById(player + "DiceDisplay").innerHTML = diceCharacters[(Math.floor(Math.random() * 6) + 1) - 1] + diceCharacters[(Math.floor(Math.random() * 6) + 1) - 1];
            }, delay);
        };
        delay = delay + 125;
        runs = runs + 1;
    };
};

function rollDice() {
    var dieOne = Math.floor(Math.random() * 6) + 1;
    var dieTwo = Math.floor(Math.random() * 6) + 1;
    if (dieOne == dieTwo) {
        var doubles = 1;
    };
    return [dieOne, dieTwo, Boolean(doubles)];
};