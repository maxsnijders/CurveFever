/*
  Player:       Genetic
  Author:       Max Snijders
  Description:  Scores different board states based on certain weighted criteria. Criteria evolve from pre-set genes.
*/
(function(){
  function Genetic(){
    //Is the value ours?
    this.value_is_self = function(Board, value){
      var color_self = this.self_color;
      var color_self_head = Board.PLAYER_BLUE_HEAD;
      if(color_self == Board.PLAYER_RED){ color_self_head = Board.PLAYER_RED_HEAD; }

      if(value == color_self || value == color_self_head){
        return true;
      }
      return false;
    };

    //The sigmoid function, which we'll use for activation
    this.sigmoid = function(x){
      return 1/(1+Math.pow(Math.e, -1 * x));
    };

    

    //Make a move
    this.move = function(Board){

    };
  };

  console.log("Genetic player: loaded.");
  window.Players.Genetic = Genetic;
})();
