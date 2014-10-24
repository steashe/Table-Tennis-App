/// <reference path="leagueController.js" />
/// <reference path="player.js" />
gameController = {
    ScoreSheet: {
        /// <field name="player1" type="Player">Player 1</field>       
        player1: '',
        /// <field name="player2" type="Player">Player 2</field>
        player2: '',
        /// <field name="player1Score" type="Number">Player 1's score</field>
        player1Score: 0,
        /// <field name="player2Score" type="Number">Player 2's score</field>  
        player2Score: 0,
        /// <field name="server" type="Boolean">Counter for number of points</field>  
        player1Serving: false,
    },

    init: function () {
        this.setup();
    },

    setup: function () {
        $('#p1increment').click(function () {
            gameController.incrementScore('p1');
        });

        $('#p1decrement').click(function () {
            gameController.decrementScore('p1');
        });

        $('#p2increment').click(function () {
            gameController.incrementScore('p2');
        });

        $('#p2decrement').click(function () {
            gameController.decrementScore('p2');
        });

        $('#newGame').click(function () {
            gameController.newGame();
        });

        $('#lockIn').click(function () {
            gameController.lockInPlayers();
        });

        $('#result').click(function () {
            gameController.submitGameScore();
        });
    },

    checkGameOver: function () {
        /// <summary>check to see if someone has won </summary>

        //get the scores from the variables at the top
        var p1Score = this.ScoreSheet.player1Score;
        var p2Score = this.ScoreSheet.player2Score;

        //check to see if conditions for win are met
        if (((p1Score >= 11) && ((p1Score - p2Score) >= 2)) || ((p2Score >= 11) && ((p2Score - p1Score) >= 2))) {

            //highlight submit button and enable it
            $('#result').css('background-color', 'yellow').removeAttr('disabled');

            //display winner
            var winner;

            if (gameController.ScoreSheet.player1Score > gameController.ScoreSheet.player2Score) {
                winner = gameController.ScoreSheet.player1;
            } else {
                winner = gameController.ScoreSheet.player2;
            }

            alert('Congratulations ' + winner + '. You won');

            //change visibilities
            $('#p1increment').css('visibility', 'hidden');
            $('#p2increment').css('visibility', 'hidden');
            $('#result').css('visibility', 'visible');
        } else {
            $('#p1increment').css('visibility', 'visible');
            $('#p2increment').css('visibility', 'visible');
            $('#result').css('visibility', 'hidden');
        }
    },

    decrementScore: function (player) {
        /// <summary>decrement the score of the player </summary>
        /// <param name="player" type="String">player string</param>

        //if equal to p1 and greater than 0
        if (player === 'p1' && this.ScoreSheet.player1Score > 0) {

            //-1 to variable at the top
            this.ScoreSheet.player1Score--;

            //assign it to the score sheet
            $('#player1Score').attr('value', this.ScoreSheet.player1Score);
        } else if (this.ScoreSheet.player2Score > 0) {
            this.ScoreSheet.player2Score--;
            $('#player2Score').attr('value', this.ScoreSheet.player2Score);
        }

        //hide minus buttons if at 0
        if (this.ScoreSheet.player1Score === 0) {
            $('#p1decrement').css('visibility', 'hidden');
        }

        if (this.ScoreSheet.player2Score === 0) {
            $('#p2decrement').css('visibility', 'hidden');
        }

        this.checkGameOver();

        //update server if needed
        var total = this.ScoreSheet.player2Score + this.ScoreSheet.player1Score;

        if (total % 2 != 0 || total >= 19) {
            this.ScoreSheet.player1Serving = !this.ScoreSheet.player1Serving;
            this.updateServer(this.ScoreSheet.player1Serving);
        }
    },

    incrementScore: function (player) {
        /// <summary>increment the score of the player </summary>
        /// <param name="player" type="String">player string</param>

        //if equal to p1
        if (player === 'p1') {

            //+1 to variable at the top 
            this.ScoreSheet.player1Score++;
            //assign it to the score sheet
            $('#player1Score').attr('value', this.ScoreSheet.player1Score);
            $('#p1decrement').css('visibility', 'visible');
        } else {
            this.ScoreSheet.player2Score++;
            $('#player2Score').attr('value', this.ScoreSheet.player2Score);
            $('#p2decrement').css('visibility', 'visible');
        }

        //check to see if the game has ended
        this.checkGameOver();

        //update server if needed
        var total = this.ScoreSheet.player2Score + this.ScoreSheet.player1Score;

        if (total % 2 == 0 || total > 19) {
            this.ScoreSheet.player1Serving = !this.ScoreSheet.player1Serving;
            this.updateServer();
        }
    },

    lockInPlayers: function () {
        /// <summary>lock in the selected players </summary>

        //get the strings from the dropdowns
        var p1 = $('#player1 :selected').text();
        var p2 = $('#player2 :selected').text();

        //prevent playing default
        if (p1 === 'Choose player...' || p2 === 'Choose player...') {
            alert('You haven\'t selected two players');
            return true;
        }

        //if equal alert to state it
        if (p1 === p2) {
            alert('You can\'t play yourself, please choose another player');
            return true;
        }

        //get the server
        var server = $('input[name=server]:checked').val();

        //if chosen display or hide the correct tag
        if (server != null) {
            if (server === '0') {
                $('#p1serve').css('visibility', 'visible');
                $('#p2serve').css('visibility', 'hidden');
                //true for player 1
                this.ScoreSheet.player1Serving = true;
            } else {
                $('#p2serve').css('visibility', 'visible');
                $('#p1serve').css('visibility', 'hidden');
                //false for player 2
                this.ScoreSheet.player1Serving = false;
            }
        } else {
            alert('Choose a server to start the game');
            return false;
        }

        gameController.ScoreSheet.player1 = p1;
        gameController.ScoreSheet.player2 = p2;

        //disable the dropdowns/button
        $('.players').attr('disabled', 'disabled');
        $('#removePlayer').attr('disabled', 'disabled');

        $('#lockIn').css('display', 'none');
        $('label').css('visibility', 'hidden');
        $(':radio').css('visibility', 'hidden');

        //make visible the increment/decrement/newGame buttons
        $('#newGame').css('display', 'block');
        $('#p2increment').css('visibility', 'visible');
        $('#p1increment').css('visibility', 'visible');

    },

    newGame: function () {
        /// <summary>start a new game </summary>

        //reset all variables
        this.ScoreSheet.player1Score = 0;
        this.ScoreSheet.player2Score = 0;
        this.ScoreSheet.player1 = '';
        this.ScoreSheet.player2 = '';
        this.ScoreSheet.player1Serving = false;
        $('#player1Score').attr('value', this.ScoreSheet.player1Score);
        $('#player2Score').attr('value', this.ScoreSheet.player2Score);
        $('#player1').attr('value', this.ScoreSheet.player1);
        $('#player2').attr('value', this.ScoreSheet.player2);

        //show/hide button
        $('#lockIn').css('display', 'block');

        $(':radio').css('visibility', 'visible');
        $('label').css('visibility', 'visible');

        $('#newGame').css('display', 'none');

        $('.changeScore').css('visibility', 'hidden');
        $('.server').css('visibility', 'hidden');

        //enable dropdowns
        $('.players').removeAttr('disabled');
        $("#player2")[0].selectedIndex = 0;
        $("#player1")[0].selectedIndex = 0;

        $('#removePlayer').removeAttr('disabled');
    },

    submitGameScore: function () {
        /// <summary>submit the game score </summary>

        //get the player names
        var player1 = $('#player1 :selected').text();
        var player2 = $('#player2 :selected').text();

        //search the array
        for (var player in leagueController.League.leagueList) {

            //if object that matches is found
            if (leagueController.League.leagueList[player].name === player1) {

                //set variable to that object
                player1 = leagueController.League.leagueList[player];
            }
        }

        for (var player in leagueController.League.leagueList) {
            if (leagueController.League.leagueList[player].name === player2) {
                player2 = leagueController.League.leagueList[player];
            }
        }

        //get a Boolean for who won
        var win = this.ScoreSheet.player1Score > this.ScoreSheet.player2Score;

        //work out difference in player ratings
        var ratingDiff = Math.abs(player1.points - player2.points);

        //work out the score difference
        var margin = Math.abs(this.ScoreSheet.player1Score - this.ScoreSheet.player2Score);

        //update the rankings of each player
        player1.updateRankingPoints(win, margin, ratingDiff);
        player2.updateRankingPoints(!win, margin, ratingDiff);

        //refresh the standings
        leagueController.refreshStandings();

        //get jQuery selectors
        var p1 = '#' + player1.name + ' td';
        var p2 = '#' + player2.name + ' td';

        //call the animate function
        leagueController.animatePlayersInLeague(p1, p2, win);

        //disable things to prevent a change and re-submit
        $('#result').css('visibility', 'hidden');
        $('.changeScore').css('visibility', 'hidden');
        $('.server').css('visibility', 'hidden');
        $('#removePlayer').removeAttr('disabled');
        $('.players').attr('disabled', 'disabled');
    },

    updatePlayerSelector: function (list) {
        /// <summary>update the dropdown boxes </summary>
        /// <param name="list" type="Array">array of players</param>

        //remove all options from dropdowns, to avoid duplicates
        $('.players option[value!="-1"]').remove();

        //add each player from the list to the dropdowns
        for (var player in list) {
            var playerOption = '<option>' + list[player].name + '</option>';
            $('#player1').append(playerOption);
            $('#player2').append(playerOption);
        }
    },

    updateServer: function () {
        /// <summary>change who's serve it is </summary>
        if (!this.ScoreSheet.player1Serving) {
            $('#p2serve').css('visibility', 'visible');
            $('#p1serve').css('visibility', 'hidden');
        } else {
            $('#p1serve').css('visibility', 'visible');
            $('#p2serve').css('visibility', 'hidden');
        }
    }
};