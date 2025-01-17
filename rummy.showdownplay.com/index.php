<?php include 'session_check.php'; ?>


<!DOCTYPE html>
<html>
    
<!-- Mirrored from showcase.codethislab.com/games/rummy/ by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 19 Nov 2021 12:41:12 GMT -->
<head>
        <title>RUMMY</title>
        <link rel="stylesheet" href="css/reset.css" type="text/css">
        <link rel="stylesheet" href="css/main.css" type="text/css">
        <link rel="stylesheet" href="css/ios_fullscreen.css" type="text/css">
        <link rel='shortcut icon' type='image/x-icon' href='favicon.ico' />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui" />
	<meta name="msapplication-tap-highlight" content="no"/>

        <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="js/easeljs-NEXT.min.js"></script>
        <script type="text/javascript" src="js/howler.min.js"></script>
        <script type="text/javascript" src="js/main.js"></script>

    </head>
    <body ondragstart="return false;" ondrop="return false;" >
	<div style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%"></div>
          <script>
            $(document).ready(function(){
                     var oMain = new CMain({    
                                                num_cards_for_2_players:10,  //NUMBER OF CARD TO DEAL FOR EACH PLAYER WHEN THERE ARE 2 PLAYERS. DEFAULT IS 10.MIN VALUE IS 4. MAXIMUM VALUE IS 13.
                                                num_cards_for_3_players:7,  //NUMBER OF CARD TO DEAL FOR EACH PLAYER WHEN THERE ARE 3 PLAYERS. DEFAULT IS 10.MIN VALUE IS 4. MAXIMUM VALUE IS 13.
                                                num_cards_for_4_players:7,  //NUMBER OF CARD TO DEAL FOR EACH PLAYER WHEN THERE ARE 4 PLAYERS. DEFAULT IS 10.MIN VALUE IS 4. MAXIMUM VALUE IS 13.
                                                
                                                min_point_for_opening:0,   //WHEN USER WANT TO START MELDING CARDS ON THE TABLE, THE SUM OF THE COMBOS MUST BE THIS VALUE OR MORE
                                                joker_available:false,      //SET IF JOKER ARE AVAILABLE IN THE STARTING DECK OR NOT.
                                                ace_high:true,             //SET THIS VALUE = TRUE TO ALLOW THE STRAIGHT: QUEEN, KING, ACE (Q K A).
                                                going_rummy_rule:true,     //SET 'GOING RUMMY' RULE ACTIVE/DISACTIVE. IF ACTIVE, A PLAYER THAT LAYS OFF ALL THEIR ENTIRE HAND IN A SINGLE TURN,
                                                                           //GET A DOUBLED SCORE FROM THE OTHER PLAYERS
                                                
                                                score_to_reach_for_2_players:  100, //SCORE TO REACH IF THERE ARE 2 PLAYERS
                                                score_to_reach_for_3_players:  150, //SCORE TO REACH IF THERE ARE 3 PLAYERS
                                                score_to_reach_for_4_players:  200, //SCORE TO REACH IF THERE ARE 4 PLAYERS
                                                
                                                score_ace: 1,            //SCORE ASSIGNED FOR ACE CARD WHEN ROUND IS OVER
                                                score_joker: 15,         //SCORE ASSIGNED FOR JOKER CARD WHEN ROUND IS OVER
                                                
                                                fullscreen:true,     //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
                                                audio_enable_on_startup:false  //ENABLE/DISABLE AUDIO WHEN GAME STARTS 
                                                
                                           });
                                           
                                           
                    $(oMain).on("start_session", function(evt) {
                        if(getParamValue('ctl-arcade') === "true"){
                             parent.__ctlArcadeStartSession();
                        }
                        //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("end_session", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeEndSession();
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("save_score", function(evt,iScore) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeSaveScore({score:iScore});
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("show_interlevel_ad", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShowInterlevelAD();
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });
                    
                    $(oMain).on("share_event", function(evt, iScore) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShareEvent({   img: TEXT_SHARE_IMAGE,
                                                                title: TEXT_SHARE_TITLE,
                                                                msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
                                                                msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1});

                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    if(isIOS()){
                        setTimeout(function(){sizeHandler();},200); 
                    }else{ 
                        sizeHandler(); 
                    }
        });

        </script>
        <div class="check-fonts">
            <p class="check-font-1">futura_t_otregular</p>
        </div> 
        
        <canvas id="canvas" class='ani_hack' width="1920" height="1920"> </canvas>
        <div id="block_game" style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%; display:none"></div>

    </body>

<!-- Mirrored from showcase.codethislab.com/games/rummy/ by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 19 Nov 2021 12:41:14 GMT -->
</html>
