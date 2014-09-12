/// <reference path="gameController.js" />
/// <reference path="player.js" />
leagueController = {
    Data: {
        newPlayer: ''
    },

    League: {
        //array to store players
        leagueList: []
    },

    init: function () {
        this.setup();
    },

    setup: function () {
        //adding event handlers
        $('#addPlayer').click(function () {
            leagueController.addPlayer();
        });

        $('#removePlayer').click(function () {
            leagueController.removePlayer();
        });
    },

    addPlayer: function () {
        /// <summary>add a player to the league </summary>

        //grab player name
        var pname = prompt('Enter player name');

        //if user cancels, end method
        if (pname === null) {
            return false;
            //or if they just enter white spaces 
        } else if (!(/\S/.test(pname))) {
            alert('Please enter a valid name');
            return false;
        }

        //trim any white space from around name
        pname = pname.toLowerCase();
        pname = pname.trim();

        //search for all < and > and remove them
        //pname = pname.replace(/</g, '').replace(/>/g, '');

        //if name contains < or > stop
        if (pname.indexOf('<') != -1 || pname.indexOf('>') != -1) {
            alert('You cannot use "<" or ">"');
            return false;
        }

        //prevent two people having same name
        for (var user in this.League.leagueList) {
            if (pname === this.League.leagueList[user].name) {
                alert('name already in use');
                return false;
            }
        }

        //create new player object
        var player = new Player(pname);

        //add player to array
        this.League.leagueList.push(player);

        //update dropdown boxes
        gameController.updatePlayerSelector(this.League.leagueList);

        //refresh standings
        this.refreshStandings();
    },

    animatePlayersInLeague: function (selector1, selector2, winner) {
        /// <summary>animate the players that played in the league </summary>
        /// <param name="selector1" type="String">jQuery selector</param>
        /// <param name="selector2" type="String">jQuery selector</param>
        /// <param name="winner" type="Boolean">winner Boolean</param>

        //get the original background colour
        var color1 = $(selector1).css('background-color');
        var color2 = $(selector2).css('background-color');

        //if true
        if (winner) {
            //set the background colour
            $(selector1).animate({
                backgroundColor: '#0F0'
            }, 1500).animate({
                backgroundColor: color1
            }, 1500);

            $(selector2).animate({
                backgroundColor: '#F00'
            }, 1500).animate({
                backgroundColor: color2
            }, 1500);

        } else {
            $(selector1).animate({
                backgroundColor: '#F00'
            }, 1500).animate({
                backgroundColor: color1
            }, 1500);

            $(selector2).animate({
                backgroundColor: '#0F0'
            }, 1500).animate({
                backgroundColor: color2
            }, 1500);
        }
    },

    refreshStandings: function () {
        /// <summary>refresh the league standings </summary>

        //sort players by points
        this.League.leagueList.sort(function (a, b) {
            return b.points - a.points;
        });

        //reset table
        $('table tbody').html('');

        //print them to table
        for (var player in this.League.leagueList) {
            $('tbody').append('<tr id="' + this.League.leagueList[player].name + '" >' +
                                        '<td>' + this.League.leagueList[player].name + '</td>' +
                                        '<td>' + this.League.leagueList[player].gamesPlayed + '</td>' +
                                        '<td>' + this.League.leagueList[player].winPercentage + '</td>' +
                                        '<td>' + this.League.leagueList[player].points + '</td>' +
                                      '</tr>');
        }

        //add some styles
        $('tr:odd').addClass('highlight');
        $('tr:even').addClass('altHighlight');
    },

    removePlayer: function () {
        /// <summary>remove a player from the league </summary>

        //grab players name
        var remove = prompt('Enter player name to be removed');

        //if user clicks cancel
        if (remove === null || remove === '') {
            return false;
        }

        //grab array length before removal
        var length = this.League.leagueList.length;

        //search through array to find them
        for (var i = 0; i < this.League.leagueList.length; i++) {
            //if they're found, delete them
            if (remove === this.League.leagueList[i].name) {
                this.League.leagueList.splice(i, 1);
                //refresh the league table
                this.refreshStandings();
                alert(remove + ' has successfully been removed');
                break;
            }
        }

        //if current array is still same length as before then nothing has been removed
        if (length === this.League.leagueList.length) {
            alert('There is no one using the name ' + remove);
        }

        //update the dropdown boxes
        gameController.updatePlayerSelector(this.League.leagueList);
    }
}