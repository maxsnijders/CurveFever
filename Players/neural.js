/*
  Player:       Neural
  Author:       Max Snijders
  Description:  Uses a neural network to make descisions
*/
(function(){
  function Neural(){
    var _that = this;

    //How often do we train before playing?
    this.trainNumber = 100;
    this.numberOfTrainingGames = 100;
    this.trainBoard = null;

    //Checks if the given value belongs to us
    this.valueIsSelf = function(Board, value){
      var color_self = this.color;
      var color_self_head = Board.PLAYER_BLUE_HEAD;
      if(color_self == Board.PLAYER_RED){ color_self_head = Board.PLAYER_RED_HEAD; }

      if(value == color_self || value == color_self_head){
        return true;
      }
      return false;
    };

    //Converts board state to a 2 dim array with values (0-3) (self, self head, other, other head)
    this.convertBoardToInput = function(Board){
      var input = [];
      for(var i = 0; i < Board.size.width; i++){
        input[i] = [];
        for(var j = 0; j < Board.size.height; j++){
          var value = Board.state[i][j]
          var head  = (value == Board.PLAYER_RED_HEAD) || (value == Board.PLAYER_BLUE_HEAD);
          var self  = this.valueIsSelf(value);

          if(self){
            if(!head) input[i][j] = -20;
            else input[i][j] = -1;
          }else{
            if(!head) input[i][j] = 1;
            else input[i][j] = 20;
          }
        }
      }
      return input;
    };

    this.color = null;
    this.initted = false;

    this.init = function(Board){
      //Called right before we do our first move. It is currently our turn.
      this.color = Board.currentPlayer;

      this.network = new this.NeuralNetwork(Board.size.width * Board.size.height, 4);
      this.trainBoard = Board.copy();

      for(var i = 0; i < this.trainNumber; i++){
        console.log("Training " + (i+1) +"/" + this.trainNumber)
        this.network.train(this.neuralNetworkFitness);
      }
    };

    //Get move based on current board and a network
    this.getNetworkMoveOnBoard = function(network, board){
      //Play using the network
      var networkInput = this.convertBoardToInput(board);

      //Calculate output
      var output = network.calculateOutput(networkInput);

      //Calculate move
      //Whichever output is highestScore
      var move = null;
      var highestOutputIndex = null;
      var highestOutput = null;
      for(var i = 0; i < output.length; i++){
        var val = output[i];
        if(highestOutput === null || val > highestOutput){
          highestOutputIndex = i;
          highestOutput = val;
        }
      }

      switch(highestOutputIndex){
        case 0:
          move = board.MOVE_LEFT;
          break;
        case 1:
          move = board.MOVE_UP;
          break;
        case 2:
          move = board.MOVE_RIGHT;
          break;
        case 3:
          move = board.MOVE_DOWN;
          break;
        default:
          var moves = board.getPossibleMoves();
          move =  moves[Math.floor(Math.random() * moves.length)];
          console.error("Invalid output");
      }

      //Is this move legal?
      var moves = board.getPossibleMoves();
      var legal = false;
      for(var j = 0; j < moves.length; j++){
        if(moves[j] == move){ legal = true; break; }
      }

      if(!legal){
        var moves = board.getPossibleMoves();
        move = moves[Math.floor(Math.random() * moves.length)];
      }
      return move;
    }

    //Calculates a fitness score for a neural network
    this.neuralNetworkFitness = function(network){
      var wins = 0;

      //Play some games against a random oponent with this neural network
      for(var i = 0; i < _that.numberOfTrainingGames; i++){
        var boardCopy = _that.trainBoard.copy();

        while(true){
          //Whats our move?
          //Apply it
          boardCopy.makeMove(_that.getNetworkMoveOnBoard(network, boardCopy));

          if(boardCopy.getPossibleMoves().length == 0){
            //We won!
            wins++;
            break;
          }

          var moves = boardCopy.getPossibleMoves();
          boardCopy.makeMove(moves[Math.floor(Math.random() * moves.length)]);

          if(boardCopy.getPossibleMoves().length == 0){
            break; //We lost
          }
        }
      }

      return wins;
    };

    this.move = function(Board){
      //Ensure that we have initted once
      if(!this.initted){
        this.initted = true;
        this.init(Board);
      }

      Board.makeMove(this.getNetworkMoveOnBoard(this.network, Board));
    };

    this.NeuralNetwork = function(numInputs, numOutputs){
      //Build a randomly weighted network
      this.construct = function(numInputs, numOutputs){
        this.numInputs = numInputs;
        this.numOutputs = numOutputs;

        //Make neurons for all of these
        //Hidden layer
        this.hiddenLayer = [];
        this.outputLayer = [];

        for(var i = 0; i < numInputs; i++){
          var weights = [];
          for(var j = 0; j < numInputs + 1; j++){
            weights[j] = Math.random() * 2 - 1; //Between -1 and 1
          }
          this.hiddenLayer[i] = new _that.Neuron(this.numInputs, weights);
        }

        for(var i = 0; i < numOutputs; i++){
          var weights = [];
          for(var j = 0; j < numInputs + 1; j++){
            weights[j] = Math.random() * 2 - 1; //Between -1 and 1
          }

          this.outputLayer[i] = new _that.Neuron(this.numInputs, weights);
        }
      };

      //Calculate the output for the current weights
      this.calculateOutput = function(inputs){
        var hiddenOutput = [];
        for(var i = 0; i < this.numInputs; i++){
          //Assign all inputs to the hidden layer neurons
          hiddenOutput[i] = this.hiddenLayer[i].output(inputs);
        }

        var output = [];
        for(var i = 0; i < this.numOutputs; i++){
          output[i] = this.outputLayer[i].output(hiddenOutput);
        }

        return output;
      };

      //Train this network with one random variation
      this.train = function(fittnessCallback){
        //Vary a random weight from a random layer
        var rand = Math.random() * 2;
        var layer = this.outputLayer;
        if(rand < 1){
          //Hidden layer
          layer = this.hiddenLayer;
        }

        //Random neuron in that layer
        var neuronIndex = Math.floor(Math.random() * layer.length);
        var neuron = layer[neuronIndex];

        //Random weight in that neuron
        var weight = Math.floor(Math.random() * neuron.weights.length);

        //Vary it, test for fitness, restore if worse
        var current = neuron.weights[weight];

        //Calculate the current fitness
        var oldFitness = fittnessCallback(this);

        //Calculate varied value
        var newValue = current * (0.9 + Math.random() * 0.2);

        //Store the new variable
        if(rand < 1){
          //Hidden layer
          this.hiddenLayer[neuronIndex][weight] = newValue;
        }else{
          //Output layer
          this.outputLayer[neuronIndex][weight] = newValue;
        }

        //Calculate the new fitness
        var newFitness = fittnessCallback(this);

        if(newFitness <= oldFitness){
          //Restore old value
          if(rand < 1){
            //Hidden layer
            this.hiddenLayer[neuronIndex][weight] = current;
          }else{
            //Output layer
            this.outputLayer[neuronIndex][weight] = current;
          }
        }
      };

      this.construct(numInputs, numOutputs);
    };

    this.Neuron = function(numInputs, weights){
      //there are numInputs weights plus a weight for the bias
      this.weights = [];

      //Calculate value based on inputs and weights
      this.output = function(inputs){
        this.value = 0;
        for(var k = 0; k < this.numInputs; k++){
          this.value += inputs[k] * this.weights[k];
        }

        //Apply the bias by using the last weight
        this.value += this.weights[this.weights.length - 1];

        //return the sigmoid of this value
        return 1/(1+Math.pow(Math.e, -1 * this.value));
      };

      this.construct = function(numInputs){
        this.numInputs = numInputs;
        this.weights = weights;
      }

      this.construct(numInputs);
    };
  };

  console.log("Neural player: loaded.");
  window.Players.Neural = Neural;
})();
