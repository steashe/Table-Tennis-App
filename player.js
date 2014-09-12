//class Player 

// Properties //
Player.prototype.name = '';
Player.prototype.points = '';
Player.prototype.gamesPlayed = '';
Player.prototype.won = '';
Player.prototype.winPercentage = '';


// Constructor
function Player(name) {
    /// <field name="name" type="String">player name</field> 
    this.name = name;
    /// <field name="points" type="Number">player points</field>
    this.points = 1400;
    /// <field name="gamesPlayed" type="Number">amount of games played</field>
    this.gamesPlayed = 0;
    /// <field name="won" type="Number">amount of games won</field>
    this.won = 0;
    /// <field name="winPercentage" type="Number">win percentage</field>
    this.winPercentage = 0;   
}

// Methods //
Player.prototype.updateRankingPoints = function (didWin, winMargin, ratingDiff) {
    /// <summary>update the players ranking points </summary>
    /// <param name="didWin" type="Boolean">Did the player win?</param>
    /// <param name="winMargin" type="Integer">Game score difference</param>
    /// <param name="ratingDiff" type="Integer">Difference in ratings between players</param>

    var pointsChange;
    var gameWeight = 20;

    //int depending on score
    var pointsDifferenceIndex;

    //result, 1(win) or 0(loss)              
    var result = didWin ? 1 : 0;            
    var expResult;

    if (winMargin === 2) {
        pointsDifferenceIndex = 3 / 2;
    } else {
        pointsDifferenceIndex = (11 + winMargin) / 8;
    }

    expResult = 1 / ((Math.pow(10, (-ratingDiff / 400))) + 1);

    pointsChange = (gameWeight * pointsDifferenceIndex) * (result - expResult);
    pointsChange = parseInt(pointsChange.toFixed(2));

    this.points += pointsChange;
    this.gamesPlayed++;

    //calculate %
    if(result === 1) {
        this.won++;
    }
    
    var percentage = (this.won / this.gamesPlayed) * 100;
    this.winPercentage = parseInt(percentage.toFixed(3));    
}
