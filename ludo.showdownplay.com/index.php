<?php include 'session_check.php'; ?>
              
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="assets/css/main.css?version=<?=time()?>" type="text/css">
    <!-- <link rel="stylesheet" href="assets/css/dice.css?version=<?=time()?>" type="text/css"> -->
<link rel="icon" href="assets/img/dice.png">
<script src="assets/js/jquery-3.6.0.min.js"></script>

<script src="assets/js/players.js?version=<?=time()?>"></script>

    <title>Ludo Board Game v3.0</title>
</head>
<body>
    <div class="gameover" style="display:none">
        
        <div class="scoreboard">
        <h1>Game Over</h1>
            <div class="playerlist"><div class="player movered1"></div><div id="r1">Red Player</div><img src="assets/img/crown1.png" class="icon2"/></div>
            <div class="playerlist"><div class="player movegreen1"></div><div id="r2">Green Player</div><img src="assets/img/crown2.png" class="icon2"/></div>
            <div class="playerlist"><div class="player moveyellow1"></div><div id="r3">Yellow Player</div><img src="assets/img/crown3.png" class="icon2"/></div>
            <div class="playerlist"><div class="player moveblue1"></div><div id="r4">Blue Player</div> Looser</div>

</div>
    </div>
    <div class="welcome" style="display:">
        
        <div class="menu">



     

  <div class="lobby" style="display:">
           <h2 class="super-center"> Play Ludo</h2>
<div class="control3"> 
<div class="lb"><button id="move-blue1" class="player playersel bg-red"></button>&nbsp;&nbsp;<span id="red_player_name" class="f"><input type="text" class="cun"><button style = "display: none;" class="bot botoff"></button></span></div>
<div class="lb"><button id="move-blue2" class="player playersel bg-green"></button>&nbsp;&nbsp;<span id="green_player_name" class="f"><input type="text" class="cun"><button style = "display: none;" class="bot botoff"></button></span> </div>
<div class="lb"><button id="move-blue3" class="player playersel bg-yellow"></button>&nbsp;&nbsp;<span id="yellow_player_name" class="f"><input type="text" class="cun"><button style = "display: none;" class="bot botoff"></button></span> </div>
<div class="lb"><button id="move-blue4" class="player playersel bg-blue"></button>&nbsp;&nbsp;<span id="blue_player_name" class="f"><input type="text" class="cun"><button style = "display: none;" class="bot botoff"></button></span> </div>
</div>
<div class="super-center"><button id="start_btn">Start Game</button><button id="loading_btn" style="display:none" disabled><div class="spinner-border text-danger" role="status">
   <a href="recharge.html">Recharge Wallet</a>
<span class="visually-hidden">Loading...</span>
</div></button></div>
       </div>
       <hr>
<!--<div class="super-center">Developed By Vss Games/&nbsp;<a href="https://www.youtube.com/devninja" class="text-decoration-none" target="_blank">Follow</a></div> -->


</div>

    </div>
  
 <main class="container">
<div class="ludo-board">
<div class="red-home red-home-bg bg-red super-center">
    <div class="white-box super-center">
   <div class="player-room">

</div>
    </div>
</div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="green-home green-home-bg bg-green super-center">
<div class="white-box super-center">
   <div class="player-room">

</div>
    </div>
</div>
<div class="step"></div>
<div class="step bg-green"></div>
<div class="step bg-green"></div>
<div class="step red-stop"></div>
<div class="step bg-green"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step bg-green"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step bg-green"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step bg-green"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step bg-red">
    
</div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="winner-home">
    <div class="rwh stack"></div>
    <div class="gwh stack"></div>
    <div class="bwh stack"></div>
    <div class="ywh stack"></div>

</div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step green-stop"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step bg-red"></div>
<div class="step bg-red"></div>
<div class="step bg-red"></div>
<div class="step bg-red"></div>
<div class="step bg-red"></div>
<div class="step bg-yellow"></div>
<div class="step bg-yellow"></div>
<div class="step bg-yellow"></div>
<div class="step bg-yellow"></div>
<div class="step bg-yellow"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step blue-stop"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step bg-yellow"></div>
<div class="step"></div>
<div class="blue-home bg-blue blue-home-bg super-center">
<div class="white-box super-center">
   <div class="player-room">

</div>
    </div>
</div>
<div class="step"></div>
<div class="step bg-blue"></div>
<div class="step"></div>
<div class="yellow-home yellow-home-bg bg-yellow super-center">
<div class="white-box super-center">
   <div class="player-room">

</div>
    </div>
</div>
<div class="step"></div>
<div class="step bg-blue"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step bg-blue"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step bg-blue"></div>
<div class="step yellow-stop"></div>
<div class="step bg-blue"></div>
<div class="step bg-blue"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>
<div class="step"></div>




</div>

<div class="test_controller">
    <div class="topbar"><div class="timer"><img src="assets/img/clock.png" class="icon"/> <span id="watch">00:00:00</span></div>
    <div class="timer">Turn : <span class="current_turn">...</span><span id="dice_value"></span></div></div>

  


    <button id="dice" class="d0"></button>
    <div class="red_control control"> 
        <button id="movered1" class="player movered1 bg-red"></button>
        <button id="movered2" class="player movered2 bg-red"></button>
        <button id="movered3" class="player movered3 bg-red"></button>
        <button id="movered4" class="player movered4 bg-red"></button>
        
    </div>

    <div class="green_control control"> 
<button id="movegreen1" class="player movegreen1 bg-green"></button>
<button id="movegreen2" class="player movegreen2 bg-green"></button>
<button id="movegreen3" class="player movegreen3 bg-green"></button>
<button id="movegreen4" class="player movegreen4 bg-green"></button>
</div>
<div class="yellow_control control"> 
<button id="moveyellow1" class="player moveyellow1 bg-yellow"></button>
<button id="moveyellow2" class="player moveyellow2 bg-yellow"></button>
<button id="moveyellow3" class="player moveyellow3 bg-yellow"></button>
<button id="moveyellow4" class="player moveyellow4 bg-yellow"></button>
</div>
<div class="blue_control control"> 
<button id="moveblue1" class="player moveblue1 bg-blue"></button>
<button id="moveblue2" class="player moveblue2 bg-blue"></button>
<button id="moveblue3" class="player moveblue3 bg-blue"></button>
<button id="moveblue4" class="player moveblue4 bg-blue"></button>
</div>

<h1 class="red_control rc_name"></h1>
<h1 class="green_control gc_name"></h1>
<h1 class="yellow_control yc_name"></h1>
<h1 class="blue_control bc_name"></h1>
<!--<button id="host_btn" class="restartgame" style="">Restart Game</button>-->

<div class="chatscreen">
<input type="text" class="user_msg" placeholder="say something..."><button class="send_btn"></button>
</div>
</div>

</main>
<script src="assets/js/timer.js?version=<?=time()?>"></script>

<script src="assets/js/logic.js?version=<?=time()?>"></script>

<script src="assets/js/autorun.js?version=<?=time()?>"></script>
<script>
    alert("1.Decide who goes first by rolling the die 2.Roll a 6 to bring your first pawn onto the board. 3.Roll again to determine how many spaces to move your first pawn. 4.End your turn and pass the die to the next player after you move a pawn. 5.Place another pawn on the board if you roll another. 6.Continue to roll at the beginning of each turn and move your pawns. 7.Capture an opponent’s pawn by landing on the same space. 8.Get more than 1 of your pieces on the same space to make a block. 9.Land on the same space as an opponent’s pawn to move past it. 10.Move your pawns around the board going towards your home stretch. 11.Roll the exact number needed to get each pawn onto the home base. 12.Reach the home space with all 4 of your pawns first to win the game.")
</script>
</body>
</html>