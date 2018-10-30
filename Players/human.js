/*
  Player:       Human
  Author:       Max Snijders
  Description:  Human in control. Conrols: wasd (up left down right)
*/
(function(){
  function Human(){
    var _that = this;
    this.initted = false;

    this.waiting = true;

    this.sleepFor = function( sleepDuration ){
      var now = new Date().getTime();
      while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
    }


    this.init = function(Board){
      $(document).bind('keypress', function(e) {
          if(e.keyCode == 13) {
            this.waiting = false;
            console.log("enter");
          }
      });
    };

    this.move = function(Board){
      if(!this.initted){
        this.initted = true;
        this.init(Board);
      }

      //Wait for user input
      this.waiting = true;

      while(this.waiting){
        //Do nothing
        for(var i = 0; i < 1000; i++){

        }
      }

      return Board.getPossibleMoves()[0];
    };
  };

  console.log("Human player: loaded.");
  window.Players.Human = Human;
})();
