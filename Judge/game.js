(function(){
  function Game (options){
    this.Board = null;

    this.play = function(){
      this.Board = new window.Board({
        size : {
          width   : this.width,
          height  : this.height
        }
      });

      //We can start playing. Blue begins.
      this.currentPlayer = this.blue;
      this.otherPlayer   = this.red;

      this.Board.draw(this.canvas);

      $("#game_restart").attr("disabled", "disabled");

      if(window.logging) console.log("Game: playing");
      //Play!
      var _that = this;
      var timer = window.setInterval(function () {
        var moves = _that.Board.getPossibleMoves();
        if(moves.length == 0){
          window.clearInterval(timer);
          var Player = "Red";
          if(_that.Board.currentPlayer == _that.Board.PLAYER_BLUE){
            Player = "Blue";
            _that.scores.red++;
          }else {
            _that.scores.blue++;
          }
          //alert("Game: game over. Player " + Player + " has lost.");

          /* Write the scores to the screen */
          $("#blue_score").html(_that.scores.blue);
          $("#red_score").html(_that.scores.red);

          $("#game_restart").removeAttr("disabled");

          _that.gamesToPlay--;
          if(_that.gamesToPlay > 0){
            if(window.logging) console.log("Game: Play again");
            _that.play();
          }
          return; //Terminate the game.
        }

        //Make a move!
        var tempBoard = _that.Board.copy();
        move = _that.currentPlayer.move(tempBoard);
        _that.Board.makeMove(move);
        _that.Board.draw(_that.canvas);

        //Switch the players.
        var temp = _that.currentPlayer;
        _that.currentPlayer = _that.otherPlayer;
        _that.otherPlayer = temp;
      }, _that.turnLengthMs);
    }

    this.construct = function(options){
      this.blue          = options.blue;
      this.red           = options.red;
      this.canvas        = options.canvas;
      this.turnLengthMs  = options.turnLengthMs;
      this.width         = options.width;
      this.height        = options.height;

      this.gamesToPlay = 1;

      if(window.logging) console.log("Game: setting up");

      this.scores = {
        blue : 0,
        red  : 0
      };

      var _that = this;
      $("#game_restart").click(function(){
        _that.gamesToPlay = $("#game_restart_times").val();
        _that.play();
      });

      this.play();
    };
    this.construct(options);
  };

  window.Game = Game;
})();
