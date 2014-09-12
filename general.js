/// <reference path="leagueController.js" />
/// <reference path="gameController.js" />

$(document).ready(function () {
    leagueController.init();
    gameController.init();
});

var currentView = '';

$(window).resize(function () {
    var width = $(window).width();

    if (width <= 320) {
        if (currentView !== 'iphone 3') {
            console.log('Entering iphone 3 view');
            currentView = 'iphone 3';
        }

        $('h1').html('Table Tennis');
        $('#gamesPlayed').html('played');
        $('#win').html('%');
    } else if (width <= 640) {
        if (currentView !== 'iphone 4/5') {
            console.log('Entering iphone 4/5 view');
            currentView = 'iphone 4/5';
        }

        $('h1').html('Table Tennis');
        $('#win').html('Win %');
    } else if (width <= 768) {
        if (currentView !== 'ipad') {
            console.log('Entering ipad view');
            currentView = 'ipad';
        }

        $('h1').html('Table Tennis Scoreboard');
        $('#win').html('Win %');
    } else {
        if (currentView !== 'pc') {
            console.log('Entering pc view');
            currentView = 'pc';
        }

        $('h1').html('Table Tennis Scoreboard');
        $('#win').html('Win %');
    }
});