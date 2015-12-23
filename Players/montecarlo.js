/*
  Player:       Monte Carlo
  Author:       Max Snijders
  Description:  Utilizes the Monte Carlo strategy to play. https://en.wikipedia.org/wiki/Monte_Carlo_method
*/
(function(){
  function MonteCarlo(){
    //This is a difficulty setting for this player. Higher is harder to play against.
    this.numberOfGames = 100;

    this.move = function(Board){
      var moves = Board.getPossibleMoves();

      var mostWins = 0;
      var bestMove = 0;

      //For each possible move, play some random games
      for(var i = 0; i < moves.length; i++){
        var newBoard = Board.copy();

        var player2 = newBoard.currentPlayer;

        //Do them over
        newBoard.makeMove(moves[i]);

        //Play random games on this board.
        var wins = 0;

        for(var game = 0; game < this.numberOfGames; game++){
          var randomBoard = newBoard.copy();

          var player1 = randomBoard.currentPlayer;

          var player = player1;
          var notPlayer = player2;

          //Play a random game until either we or the other player dies.
          while(true){
            //Random move
            //Get list of moves
            var possibleMoves = randomBoard.getPossibleMoves();

            if(possibleMoves.length == 0){
              //The current player has lost
              if(player == player1){
                wins++;
              }
              break; //Stop this game
            }

            //Play a random move
            randomBoard.makeMove(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);

            var temp = player;
            player = notPlayer;
            notPlayer = temp;
          }
        }

        //If this move was better, store it
        if(wins >= mostWins){
          mostWins = wins;
          bestMove = moves[i]
        }

      }

      //Return the best move
      return bestMove;
    };
  };

  console.log("MonteCarlo player: loaded.");
  window.Players.MonteCarlo = MonteCarlo;
})();
