/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/

/*eslint-env browser*/

var scores, roundScore, activePlayer, gamePlaying;

initGame();

document.querySelector('.btn-roll').addEventListener('click', function() {
    if(gamePlaying) { 
        //1. Generate Random Number
        var dice0 = Math.floor(Math.random() * 6) + 1;
        var dice1 = Math.floor(Math.random() * 6) + 1;
        //2.Display the Result on Dice
        var diceDOM0 = document.querySelector('#dice-0');
        diceDOM0.style.display = 'block';
        diceDOM0.src = 'dice-' + dice0 +'.png';
        
        var diceDOM1 = document.querySelector('#dice-1');
        diceDOM1.style.display = 'block';
        diceDOM1.src = 'dice-' + dice1 +'.png';
        
        //3. two 6 in a row
//        if (dice === 6 && lastDice ===6){
//            //1.show score
//            diceDOM.style.display = 'block';
//            diceDOM.src = 'dice-' + dice + '.png';
//            //2.empty total score
//            scores[activePlayer] = 0;
//            document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
//            //3.switch player
//            nextPlayer();
//        }
        //4.Update the Round Score If not 1
        if (dice0 !== 1 && dice1 !==1){
            //1.Add score
            roundScore += dice0;
            roundScore += dice1;
            document.querySelector('#current-' +activePlayer).textContent = roundScore;
        }
        else{

            //2.empty round score, update the UI
            roundScore = 0;
            document.getElementById('current-'+ activePlayer).textContent ='0';
            document.querySelector('#dice-0').style.display = 'none';
            document.querySelector('#dice-1').style.display = 'none';
            //3.switch player
            nextPlayer();
        }
//        lastDice = dice;
    }
});



document.querySelector('.btn-hold').addEventListener('click',function(){
    var winningsocre = document.getElementById('winning').value;
    if(gamePlaying){
        //Add roundscore to total score
        scores[activePlayer] += roundScore;

        //update the UI, then empty round score
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        document.querySelector('#dice-0').style.display = 'none';
        document.querySelector('#dice-1').style.display = 'none';
        roundScore = 0;
        
        //check if this palyer win the game
        if (scores[activePlayer] >= winningsocre){
            document.querySelector('#name-' + activePlayer).textContent = 'WINNER!';
            document.querySelector('#dice-0').style.display = 'none';
            document.querySelector('#dice-1').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            alert('Player'+(activePlayer+1) + ' win the game!');
            gamePlaying = false;
        }
        //switch player
        nextPlayer();
    }
})


function nextPlayer(){
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
}


document.querySelector('.btn-new').addEventListener('click',initGame);

function initGame(){
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;
    document.getElementById('winning').value = null;
    document.querySelector('#dice-0').style.display = 'none';
    document.querySelector('#dice-1').style.display = 'none';
    
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    document.querySelector('#name-0').textContent = 'Player 1';
    document.querySelector('#name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');

}