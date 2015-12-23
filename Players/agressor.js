/*
  Player:       Agressor
  Author:       Max Snijders
  Description:  Moves towards the opponents head if possible.
*/
(function(){
  function Agressor(){
    this.move = function(Board){
      var moves = Board.getPossibleMoves();

      var self = Board.currentPlayer;
      var other = Board.PLAYER_RED;
      if(self == Board.PLAYER_RED){
        other = Board.PLAYER_BLUE;
      }

      //Get heads
      Board.currentPlayer = other;
      var headO = Board.getCurrentPlayerHeadPosition();
      Board.currentPlayer = self;
      var headS = Board.getCurrentPlayerHeadPosition();

      //Move in x or y direction?
      if(Math.abs(headS.x - headO.x) > Math.abs(headS.y - headO.y)){
        //X direction
        var prefered_move = Board.MOVE_LEFT;
        if(headS.x < headO.x){ prefered_move = Board.MOVE_RIGHT; }
        for(var i = 0; i < moves.length; i++){
          if(moves[i] == prefered_move){
            return prefered_move;
          }
        }
      }

      //Move in the y direction towards the enemy?
      var prefered_move = Board.MOVE_DOWN;
      if(headS.y > headO.y){ prefered_move = Board.MOVE_UP; }
      for(var i = 0; i < moves.length; i++){
        if(moves[i] == prefered_move){
          return prefered_move;
        }
      }

      //Return a random move
      return moves[Math.floor(Math.random() * moves.length)];
    };
  };

  console.log("Agressor player: loaded.");
  window.Players.Agressor = Agressor;
})();
