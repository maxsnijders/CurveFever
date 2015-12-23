$(document).ready(function(){
  /*
    Init the setup form
  */
  console.log("Setup: starting");

  var select_blue_cell = $("#player_select_blue");
  var select_red_cell  = $("#player_select_red");
  var select_form = $("#player_select");

  var board_wrapper = $("#board_wrapper");
  var board = $("#board");

  //Init a global var that will hold the loaded players
  window.Players = {};

  //Load the different AIs
  if(!window.Players_Setup || window.Players_Setup.length == 0){
    console.error("Setup: no players found.");
    return;
  }

  //List all the players
  var select_blue = $("<select>").appendTo(select_blue_cell);
  var select_red  = $("<select>").appendTo(select_red_cell);

  for (var Player_Allowed_Index in window.Players_Setup) {
    if (window.Players_Setup.hasOwnProperty(Player_Allowed_Index)) {
      var Player = window.Players_Setup[Player_Allowed_Index];
      var option = $("<option>").attr('value', Player_Allowed_Index).html(Player.name);
      var option_blue = option.clone();
      var option_red = option.clone();
      option_red.appendTo(select_red);
      option_blue.appendTo(select_blue);
    }
  }

  $("#game_start_button").click(function(){
    if(window.logging) console.log("Setup: beginning game");

    //Get selected players
    var blue_index = parseInt(select_blue[0].value);
    var red_index  = parseInt(select_red[0].value);

    //Read the player var
    var blue_player_def = window.Players_Setup[blue_index];
    var red_player_def  = window.Players_Setup[red_index];

    $("#blue_player_name").html("(" + blue_player_def.name + ")");
    $("#red_player_name").html("(" + red_player_def.name + ")");

    //Load the players
    $.ajax({ url: "Players/" + blue_player_def.file, dataType: 'script', success: function(){
      //Player blue is loaded, load player red

      $.ajax({ url: "Players/" + red_player_def.file, dataType: 'script', success: function(){
        if(window.logging) console.log("Setup: Players loaded.");

        //Remove the select form, show the board
        select_form.attr("style","display: none");
        board_wrapper.attr("style", "display: block");

        //Get the party started
        var blue = new window.Players[blue_player_def.name];
        var red  = new window.Players[red_player_def.name];

        var width = $("#board_width").val();
        var height = $("#board_height").val();

        //Get the turn length (ms)
        var turn_length_ms = $("#game_turn_length").val();

        //Continue...
        if(!blue || !red){
          console.error("Setup: Players not loaded, check your sources");
          return;
        }

        //Log that we are DONE
        if(window.logging) console.log("Setup: complete.");

        //Init the game object, it will take it from here.
        var Game = new window.Game({
          blue         : blue,
          red          : red,
          canvas       : board,
          turnLengthMs : turn_length_ms,
          width        : width,
          height       : height
        });
      }, error : function(jqXHR, textStatus, errorThrown){
        console.error("Setup: Player red could not be loaded: ");
        console.error(errorThrown);
      }});

    }, error : function(jqXHR, textStatus, errorThrown){
      console.error("Setup: Player blue could not be loaded: ");
      console.error(errorThrown);
    }});
  });

  if(window.logging) console.log("Setup: main thread ready");
});
