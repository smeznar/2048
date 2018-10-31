function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  this.startTiles     = 2;

  this.setup();
  this.setupListeners();
  this.inputManager.on("move", this.grid.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
}

GameManager.prototype.setupListeners = function(){
  this.runAi = false;
  gm = this;
  $(document).on('click', '.ai-button', function (event) {
    if(!gm.runAi){
      gm.runAi = true;
      gm.numOfGames = $('#num-of-games').val();
      gm.aiController.makeAMove(gm.grid, gm.numOfGames);
      $('#ai-btn').empty();
      $('#ai-btn').append("Stop AI");
    } else {
      gm.runAi = false;
      $('#ai-btn').empty();
      $('#ai-btn').append("Start AI");
    }
  });
};

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (previousState) {
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
    this.grid        = new Grid(previousState.grid.size,
                                this, previousState.grid.cells); // Reload grid
  } else {
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;
    this.grid        = new Grid(this.size, this);

    // Add the initial tiles
    this.grid.addStartTiles();
  }
  this.aiController = new AIController(this);
  // Update the actuator
  this.actuate(this.grid);
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function (grid) {
  this.grid = grid;
  this.score = grid.score;
  this.over = grid.over;
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.endGame();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

  if(this.runAi && !this.over){
    gm = this
    setTimeout(function(){
      gm.aiController.makeAMove(gm.grid,gm.numOfGames);
    }, 100);
  }
};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

GameManager.prototype.endGame = function(){
  this.storageManager.clearGameState();
}
/*
writeFile = function(score){
  var fh = fopen("scores.txt", 3); // Open the file for writing
  if(fh!=-1){
    var str = score + "";
    fwrite(fh, str); // Write the string to a file
    fclose(fh); // Close the file
  }
}
*/