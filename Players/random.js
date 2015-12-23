/*
  Player:       Random
  Author:       Max Snijders
  Description:  Makes a random legal move each turn.
*/
(function(){
  function Random(){
    //Function is called when its this user's next turn
    //Returns a random item from Board.getPossibleMoves
    this.move = function(Board){
      var moves = Board.getPossibleMoves();
      return moves[Math.floor(Math.random() * moves.length)];
    };
  };

  console.log("Random player: loaded.");
  window.Players.Random = Random;
})();
