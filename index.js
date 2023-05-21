const setup = () => {
  let firstCard, secondCard, totalCards = 3, matchedCards = 0, clicks = 0, time = 60;
  let gameStarted = false, selectedDifficulty = "easy", difficultyMultiplier = 1;

  let timerInterval;
  const clicksCounter = $("#clicks");
  const pairsCounter = $("#pairs");
  const timerCounter = $("#timer");
  const easyButton = $("#easy");
  const mediumButton = $("#medium");
  const hardButton = $("#hard");
  const startButton = $("#startButton");
  const resetButton = $("#resetButton");
  const lightButton = $("#light");
  const darkButton = $("#dark");
  const gameGrid = $("#game_grid");

  //Switch Theme Color
  const switchToLight = () => {
    $(".card").css("background-color", "white");
  };
  
  const switchToDark = () => {
    $(".card").css("background-color", "black");
  };
  
  lightButton.on("click", switchToLight);
  darkButton.on("click", switchToDark);

  const startTimer = () => {
    timerInterval = setInterval(() => {
      time--;
      timerCounter.text(`Time Left: ${time}`);

      if (time === 0) {
        clearInterval(timerInterval);
        setTimeout(() => {
          alert("Game is Over.");
          resetGame();
        }, 500);
      }
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
  };

  const resetTimer = () => {
    time = timeDifficulty(selectedDifficulty);
    timerCounter.text(`Time Left: ${time}`);
  };

  //Time of Each difficulty
  const timeDifficulty = (difficulty) => {
    if (difficulty === "medium") {
      return 120;
    } else if (difficulty === "hard") {
      return 180;
    } else {
      return 60;
    }
  };

  const startGame = () => {
    gameStarted = true;
    $(".card").on("click", flipCard);
    alert("Game is started! Have Fun!");
    startTimer();
  };

  const resetGame = () => {
    stopTimer();
    resetTimer();
    gameStarted = false;

    firstCard = undefined;
    secondCard = undefined;
    matchedCards = 0;
    clicks = 0;
    totalCards = 0;
    createCards();
    $(".card").remove();
    $(".card").removeClass("flip").off("click");
    createCards();
    updateStats();
  };

  function generateRandomNumbersArray(length) {
    const numbers = [];

    for (let i = 1; i <= length; i++) {
      const randomNumber = Math.floor(Math.random() * 810) + 1;
      numbers.push(randomNumber, randomNumber);
    }

    shuffleArray(numbers);

    return numbers;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const createCards = () => {
    const container = $("#game_grid");
    const cardsCount = 6 * difficultyMultiplier;
    const randomNumbersArray = generateRandomNumbersArray(cardsCount / 2);

    console.log(randomNumbersArray);

    if (cardsCount === 12) {
      container.addClass("med");
    }

    for (let i = 0; i < cardsCount; i++) {
      const cardElement = $("<div>").addClass("card");
      if (cardsCount === 24) cardElement.addClass("hard");
      if (cardsCount === 12) cardElement.addClass("med");

      const frontFace = $("<img>")
        .addClass("front_face")
        .attr("src", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomNumbersArray[i]}.png`)
        .attr("id", `front_${i}`);
      const backFace = $("<img>")
        .addClass("back_face")
        .attr("src", `back.webp`)
        .attr("id", `back_${i}`);

      cardElement.append(frontFace, backFace);

      container.append(cardElement);

      totalCards += 0.5;
    }
  };

  const flipCard = function () {
    if (clicks == 8) {
      clicks++;
      hint();
    }
    if ($(this).hasClass("flip")) return;

    $(this).toggleClass("flip");
    clicks++;

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0];
    } else {
      secondCard = $(this).find(".front_face")[0];

      if (firstCard.src === secondCard.src) {
        $(`#${firstCard.id}`).parent().off("click").addClass("matched");
        $(`#${secondCard.id}`).parent().off("click").addClass("matched");
        firstCard = undefined;
        secondCard = undefined;
        matchedCards += 2;

        if (matchedCards === totalCards) {
          stopTimer();
          setTimeout(() => {
            alert("You are the Champion!");
            resetGame();
          }, 500);
        }
      } else {
        $(".card").addClass("locked");
        setTimeout(() => {
          $(this).toggleClass("flip");
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          firstCard = undefined;
          secondCard = undefined;
          $(".card").removeClass("locked");
        }, 1000);
      }
    }
    updateStats();
  };

  const hint = () => {
    alert("Let's Power Up!");
    $(".card").each(function () {
      if (!$(this).hasClass("matched")) {
        $(this).addClass("flip");
      }
    });

    setTimeout(() => {
      $(".card").not(".matched").removeClass("flip");
    }, 1000);
  };

  const updateStats = () => {
    clicksCounter.text(`Number of Clicks: ${clicks}`);
    pairsCounter.text(`Number of Pairs Matches: ${matchedCards / 2} / ${totalCards / 2}`);
  };

  const updateDifficulty = (difficulty) => {
    selectedDifficulty = difficulty;
    time = timeDifficulty(selectedDifficulty);
    if (selectedDifficulty === "medium") {
      difficultyMultiplier = 2;
    } else if (selectedDifficulty === "hard") {
      difficultyMultiplier = 4;
    } else {
      difficultyMultiplier = 1;
    }
    totalCards = $(".card").length * difficultyMultiplier;
    pairsCounter.text(`Number of Pairs Matches: ${matchedCards / 2} / ${totalCards / 2}`);
    resetGame();
  };



  easyButton.on("click", () => updateDifficulty("easy"));
  mediumButton.on("click", () => updateDifficulty("medium"));
  hardButton.on("click", () => updateDifficulty("hard"));
  startButton.on("click", startGame);
  resetButton.on("click", resetGame);
  createCards();
  updateStats();
};



$(document).ready(setup);


