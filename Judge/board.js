(function(){
  function Board(options){
    /*
      Board constants
    */
    this.PLAYER_BLUE      = 1;
    this.PLAYER_RED       = 2;
    this.PLAYER_BLUE_HEAD = 3;
    this.PLAYER_RED_HEAD  = 4;
    this.EMPTY            = 0;

    //The list of possible moves
    this.MOVE_LEFT  = 1;
    this.MOVE_UP    = 2;
    this.MOVE_RIGHT = 3;
    this.MOVE_DOWN  = 4;

    //Stores whose turn it is
    this.currentPlayer = this.PLAYER_BLUE;
    this.turnCount     = 1;

    //Stores the actual board data
    this.state = [];

    // Draws the board to the passed in jQuery canvas element.
    this.draw = function(canvas){
      var context = canvas[0].getContext("2d");
      var width = canvas.attr("width");
      var height = canvas.attr("height");

      var blockWidth = width / this.size.width;
      var blockHeight = height / this.size.height;

      //Clear the canvas
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);

      //Draw our state
      for(var i = 0; i < this.size.width; i++){
        for(var j = 0; j < this.size.height; j++){
          var value = this.state[i][j];
          if(value == this.PLAYER_BLUE){
            context.fillStyle = "#00F"
          }else if(value == this.PLAYER_RED){
            context.fillStyle = "#F00";
          }else if(value == this.PLAYER_BLUE_HEAD){
            context.fillStyle = "#55F";
          }else if(value == this.PLAYER_RED_HEAD){
            context.fillStyle = "#F55";
          }else{
            context.fillStyle = "#000";
          }
          context.fillRect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);
        }
      }
    };

    //Get the current player's head position
    this.getCurrentPlayerHeadPosition = function(){
      var head_token;
      if(this.currentPlayer == this.PLAYER_BLUE){
        head_token = this.PLAYER_BLUE_HEAD;
      }else{
        head_token = this.PLAYER_RED_HEAD;
      }

      //Now look for this token in our state
      for(var i = 0; i < this.size.width; i++){
        for(var j = 0; j < this.size.height; j++){
          if(this.state[i][j] == head_token){
            return {x : i, y : j};
          }
        }
      }

      console.error("Board: error. Invalid game state.");
      return NULL;
    };

    //Get list of possible moves for the current player on the current board.
    this.getPossibleMoves = function(){
      var moves = [];

      //Find the player's head
      var headPosition = this.getCurrentPlayerHeadPosition();

      //Can we move left?
      if(headPosition.x > 0 && this.state[headPosition.x - 1][headPosition.y] == this.EMPTY){
        moves.push(this.MOVE_LEFT);
      }

      //Up
      if(headPosition.y > 0 && this.state[headPosition.x][headPosition.y - 1] == this.EMPTY){
        moves.push(this.MOVE_UP);
      }

      //Right
      if(headPosition.x < this.size.width - 1 && this.state[headPosition.x + 1][headPosition.y] == this.EMPTY){
        moves.push(this.MOVE_RIGHT);
      }

      //Down
      if(headPosition.y < this.size.height - 1 && this.state[headPosition.x][headPosition.y + 1] == this.EMPTY){
        moves.push(this.MOVE_DOWN);
      }

      return moves;
    };

    /* Copy constructor */
    this.copy = function(){
      var Board = new window.Board(this.options);

      for(var i = 0; i < this.size.width; i++){
        for(var j = 0; j < this.size.height; j++){
          Board.state[i][j] = this.state[i][j];
        }
      }

      Board.currentPlayer = this.currentPlayer;
      Board.turnCount = this.turnCount;

      return Board;
    };

    /* Make a move */
    this.makeMove = function(move){
      if(this.currentPlayer == this.PLAYER_BLUE){
        if(window.logging) console.log("Board: blue plays");
      }else{
        if(window.logging) console.log("Board: red plays");
      }

      //Is this move legal?
      var legal = false;
      var moves = this.getPossibleMoves();
      for(var i = 0; i < moves.length; i++){
        if(moves[i] == move) legal = true;
      }

      if(!legal){
        console.error("Board: player attempting illegal move. Current player should be kicked out.");
        return;
      }

      //Find the player's head
      var head = this.getCurrentPlayerHeadPosition();

      //Calculate the new head position
      switch(move){
        case this.MOVE_UP:
          head.y--;
          break;
        case this.MOVE_RIGHT:
          head.x++;
          break;
        case this.MOVE_DOWN:
          head.y++;
          break;
        case this.MOVE_LEFT:
          head.x--;
          break;
      }

      //Move the head
      var oldHead = this.getCurrentPlayerHeadPosition();
      this.state[head.x][head.y] = this.state[oldHead.x][oldHead.y];
      this.state[oldHead.x][oldHead.y] = this.currentPlayer;

      //Set other player active
      if(this.currentPlayer == this.PLAYER_BLUE){
        this.currentPlayer = this.PLAYER_RED;
      }else{
        this.currentPlayer = this.PLAYER_BLUE;
      }

      //Keep track of the number of turns played
      this.turnCount++;
      if(window.logging) console.log("Board: " + (this.turnCount - 1 )+ " turns played.");
    };

    /* Constructor to build initial board */
    this.construct = function(options){
      if(window.logging) console.log("Board: building");

      this.options = options;

      //Read options size
      this.size = options.size;

      //Set our initial state.
      for(var i = 0; i < this.size.width; i++){
        this.state[i] = [];
        for(var j = 0; j < this.size.height; j++){
          this.state[i][j] = 0;
        }
      }

      this.state[0][0] = this.PLAYER_BLUE_HEAD;
      this.state[this.size.width - 1][this.size.height - 1] = this.PLAYER_RED_HEAD;
    };

    //Call the constructor
    this.construct(options);
  }
  window.Board = Board;
})();
