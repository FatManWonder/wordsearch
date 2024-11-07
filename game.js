// List of possible words to use in the word search
const possibleWords = [
    "SUN", "MOON", "STARS", "PLANET", "COMET", "ASTRO", "GALAXY", "ORBIT",
    "ROCKET", "SPACE", "ALIEN", "UFO", "ASTEROID", "VENUS", "MARS", "JUPITER"
];

let foundWords = [];
let currentSelection = [];
let selectedLetters = [];
const gridSize = 10;
let grid = [];
let wordBank = [];

// Generate the game board
function generateBoard() {
    const board = document.getElementById("word-search-board");

    // Clear previous board
    board.innerHTML = "";

    // Initialize empty grid
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));

    // Randomly pick words from the possible words
    wordBank = getRandomWords();
    
    // Place the words in the grid
    placeWordsInGrid();

    // Fill in the remaining empty spaces with random letters
    fillRandomLetters();

    // Create grid elements on the page
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const span = document.createElement("span");
            span.textContent = grid[i][j];
            span.addEventListener("click", () => handleClick(i, j, span));
            board.appendChild(span);
        }
    }

    // Display word bank
    displayWordBank();
}

// Randomly pick words from the possible words list
function getRandomWords() {
    const numberOfWords = 5; // Number of words to include in the word search
    const selectedWords = [];
    
    while (selectedWords.length < numberOfWords) {
        const word = possibleWords[Math.floor(Math.random() * possibleWords.length)];
        if (!selectedWords.includes(word)) {
            selectedWords.push(word);
        }
    }
    
    return selectedWords;
}

// Display word bank on the page
function displayWordBank() {
    const wordBankList = document.getElementById("word-bank");
    wordBankList.innerHTML = wordBank.map(word => `<li>${word}</li>`).join("");
}

// Function to place words in the grid
function placeWordsInGrid() {
    wordBank.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'; // Randomize direction
            const startRow = Math.floor(Math.random() * gridSize);
            const startCol = Math.floor(Math.random() * gridSize);
            
            if (canPlaceWord(word, startRow, startCol, direction)) {
                for (let i = 0; i < word.length; i++) {
                    if (direction === 'horizontal') {
                        grid[startRow][startCol + i] = word[i];
                    } else {
                        grid[startRow + i][startCol] = word[i];
                    }
                }
                placed = true;
            }
        }
    });
}

// Check if the word can be placed
function canPlaceWord(word, row, col, direction) {
    if (direction === 'horizontal') {
        if (col + word.length > gridSize) return false; // Out of bounds check
        for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) {
                return false;
            }
        }
    } else {
        if (row + word.length > gridSize) return false; // Out of bounds check
        for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) {
                return false;
            }
        }
    }
    return true;
}

// Fill empty spaces with random letters
function fillRandomLetters() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = letters.charAt(Math.floor(Math.random() * letters.length));
            }
        }
    }
}

// Handle letter clicks
function handleClick(row, col, span) {
    const letter = span.textContent;
    
    // Prevent re-selecting the same letter
    if (currentSelection.includes(letter)) return;

    currentSelection.push({row, col, letter});
    span.style.backgroundColor = "#f1c40f"; // Highlight selected letter

    // Check if we have completed any word
    wordBank.forEach(word => {
        if (!foundWords.includes(word) && isWordFound(word)) {
            foundWords.push(word);
            document.getElementById("found-words").innerHTML = foundWords.map(word => `<li>${word}</li>`).join("");
        }
    });
}

// Check if a word is found
function isWordFound(word) {
    return word.split('').every((letter, index) => {
        return currentSelection.some(sel => sel.letter === letter && isLetterInCorrectPosition(sel, word, index));
    });
}

// Check if a letter is in the correct position for the word
function isLetterInCorrectPosition(selection, word, index) {
    const wordLetter = word[index];
    return selection.letter === wordLetter;
}

generateBoard();
