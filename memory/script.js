var memoryArray = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E','E', 'F', 'F', 'G', 'G', 'H', 'H', 'I', 'I'];
var memoryValues = [];
var memoryIdCard = [];
var cardsOpened = 0;

Array.prototype.memoryCardShuffle = function() {
  var i = this.length, j, temp;
  while (--i > 0) {
    j = Math.floor(Math.random() * (i+1));
    temp = this[j];
    this[j] = this[i];
    this[i] = temp;
  }
}

function clearGameField() {
  cardsOpened = 0;
  var output = '';
  memoryArray.memoryCardShuffle();
  for (var i = 0; i < memoryArray.length; i++) {
    output += '<div id="tile_'+ i + '" onclick="openCard(this,\''+memoryArray[i]+'\')"></div>';
  }
  document.getElementById('game-field').innerHTML = output;
}

function openCard(card, value) {
  if (card.innerHTML == '' && memoryValues.length < 2) {
    card.style.background = '#fff';
    card.innerHTML = value;
    if (memoryValues.length === 0) {
      memoryValues.push(value);
      memoryIdCard.push(card.id);
    } else if (memoryValues.length === 1) {
      memoryValues.push(value);
      memoryIdCard.push(card.id);
      if (memoryValues[0] === memoryValues[1]) {
        cardsOpened += 2;
        // clear Array
        memoryValues = [];
        memoryIdCard = [];
        if (cardsOpened === memoryArray.length) {
          alert('You win! Restarting The Game...');
          document.getElementById('game-field').innerHTML = '';
          clearGameField();
        }
      } else {
        function closeCard() {
          var card_1 = document.getElementById(memoryIdCard[0]);
          var card_2 = document.getElementById(memoryIdCard[1]);
          card_1.style.background = 'maroon';
          card_1.innerHTML = '';
          card_2.style.background = 'maroon';
          card_2.innerHTML = '';
          memoryValues = [];
          memoryIdCard = [];
        }
        setTimeout(closeCard, 600);
      }
    }
  }
}

clearGameField();
