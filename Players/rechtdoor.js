/*
  Player:       Rechtdoor
  Author:       Max Snijders
  Description:  Attempts to move in straight lines. When this is not possible, the player performs a random legal turn.
*/
(function(){
  function Rechtdoor(){
    this.prevDirection = null;

    this.move = function(Board){
      var moves = Board.getPossibleMoves();

      if(!this.prevDirection){
        this.prevDirection = moves[Math.floor(Math.random() * moves.length)];
      }

      //Can we move in our previous step direction?
      var repeat = false;
      for(var i = 0; i < moves.length; i++){
        if(moves[i] == this.prevDirection){
          repeat = true;
        }
      }

      if(!repeat){
        this.prevDirection = moves[Math.floor(Math.random() * moves.length)];
      }

      return this.prevDirection;
    };
  };

  console.log("Rechtdoor player: loaded.");
  window.Players.Rechtdoor = Rechtdoor;
})();
