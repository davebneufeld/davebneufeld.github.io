var App = App || {};

App.GameState = {
  init: function() {
    this.CARD_WIDTH = 80;
    this.CARD_HEIGHT = 120;
    this.CARD_SPACING = 10;
    this.FLIP_SPEED = 200;
    this.FLIP_ZOOM = 1.2;
    this.FRAME_DEFAULT = 52;
    this.GRID_ROWS = 4;
    this.GRID_COLUMNS = 3;
    this.MAX_SECONDS = 60;

    this.deck = [10,12,24,36,38,50,10,12,24,36,38,50];
    this.selectedCards = [];
    this.score = 0;
    this.elapsedTime = 0;
    this.clicks = 0;

    this.storage = {};

    this.cardFlip = this.add.audio('card_flip');
  },
  create: function() {
    this.cards = this.add.group();
    this.scores = this.add.group();

    this.gameTimer = this.game.time.events.loop(Phaser.Timer.SECOND, this.tick, this);

    this.shuffle(this.deck);

    this.storage = this.getStorage();

    this.deck = this.storage.deck;
    this.score = this.storage.score;
    this.elapsedTime = this.storage.elapsedTime;
    this.clicks = this.storage.clicks;

    this.createUI();

    this.storage.deck = this.deck;

    this.deal();
    this.removeCards();
  },
  update: function() {

  },
  tick: function() {
    // update elapsed time
    this.elapsedTime++;
    
    // save elapsed time
    this.saveStorage();

    if(this.elapsedTime > this.MAX_SECONDS) {
      this.gameOver();
    }
    else {
      // update clock
      this.updateClock();
    }
  },
  updateClock: function() {
    // get remaining time
    var time = this.secondsToTime(this.elapsedTime);

    // update time display
    //this.timeLabel.text = "Time: " + time.m + ":" + time.s;
  },
  secondsToTime: function(seconds) {
    // round seconds for the following calculations
    var secs = Math.round(seconds);

    // calculate hour
    var hours = Math.floor(secs / (60 * 60));

    // calculate minutes
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    // calculate seconds
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    // set time object
    var obj = {
        "h": "" + hours,
        "m": (minutes < 10) ? "0" + minutes : "" + minutes,
        "s": (seconds < 10) ? "0" + seconds : "" + seconds
    };

    // return time object
    return obj;
  },
  createUI: function() {
    this.text_score_small = this.add.sprite(0, 0, 'text_score_small');
    this.text_dots_small = this.add.sprite(0, 0, 'text_dots_small').alignTo(this.text_score_small, Phaser.RIGHT_CENTER, 0);
    //this.text_score = this.add.sprite(0, 0, 'text_' + this.score + '_small').alignTo(this.text_dots_small, Phaser.RIGHT_CENTER, 0);

    this.updateScore(0);
  },
  shuffle: function(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
  },
  deal: function() {
    var count, i, j, card;

    for(i =0; i < this.deck.length; i++) {
      card = this.add.sprite(
        (this.CARD_WIDTH + this.CARD_SPACING) * (i % 4) + this.CARD_SPACING + this.CARD_WIDTH / 2,
        (this.CARD_HEIGHT + this.CARD_SPACING) * Math.floor(i / 4) + this.CARD_SPACING + this.CARD_HEIGHT / 2,
        'deck'
      );

      card.anchor.set(0.5);

      card.frame = this.FRAME_DEFAULT;
      card.inputEnabled = true;
      card.events.onInputDown.add(this.selectCard, this);

      card.data.index = i;
      card.data.flipped = false;
      card.data.isFlipping = false;
      card.data.pattern = this.deck[i];

      this.cards.add(card);
    }
  },
  removeCards: function() {
    var i, index, card;

    for(i = 0; i < this.storage.removedCards.length; i++) {
      index = this.storage.removedCards[i];
      card = this.cards.children[index];

      card.kill();
    }
  },
  selectCard: function(card) {
    this.selectedCard = card;

    if(this.uiBlocked || this.selectedCard.data.flipped || this.selectedCard.data.isFlipping) return;

    this.clicks++;

    console.log('clicks', this.clicks);

    this.uiBlocked = true;
    this.selectedCard.data.isFlipping = true;

    // turn selected card face up

    // first tween: we raise and flip the card
    var flipTween = this.game.add.tween(this.selectedCard.scale).to({
      x: 0,
      y: this.FLIP_ZOOM
    }, this.FLIP_SPEED / 2, Phaser.Easing.Linear.None);

    // once the card is flipped, we change its frame and call the second tween
    flipTween.onComplete.add(function(){
        this.selectedCard.frame = this.selectedCard.data.pattern;
        backFlipTween.start();
    }, this);

    // second tween: we complete the flip and lower the card
    var backFlipTween = this.game.add.tween(this.selectedCard.scale).to({
        x: 1,
        y: 1
    }, this.FLIP_SPEED / 2, Phaser.Easing.Linear.None);

    // once the card has been placed down on the table, we can flip it again
    backFlipTween.onComplete.add(function(){
        this.selectedCard.data.isFlipping = false;
        this.selectedCard.data.flipped = true;

        this.selectedCards.push(this.selectedCard);

        if(this.selectedCards.length == 2) {
          this.game.time.events.add(Phaser.Timer.SECOND * 1, this.checkPattern, this);
        }
        else {
          this.uiBlocked = false;
        }
    }, this);

    this.cardFlip.play();

    flipTween.start();
  },
  checkPattern: function() {

    if(this.matchPattern(this.selectedCards)) {

      // remove selected cards
      this.selectedCards.forEach(function(card){
        this.storage.removedCards.push(card.data.index);
        card.kill();
      }, this);

      //increment score
      //this.score++;
      this.updateScore(10);

      // check if all cards have been removed
      if(this.cards.countLiving() === 0) {
        this.gameOver();
      }
    }
    else {
      // turn selected cards face down
      this.selectedCards.forEach(function(card){
        // first tween: we raise and flip the card
        var flipTween = this.game.add.tween(card.scale).to({
          x: 0,
          y: this.FLIP_ZOOM
        }, this.FLIP_SPEED / 2, Phaser.Easing.Linear.None);

        // once the card is flipped, we change its frame and call the second tween
        flipTween.onComplete.add(function(){
            card.frame = this.FRAME_DEFAULT;
            backFlipTween.start();
        }, this);

        // second tween: we complete the flip and lower the card
        var backFlipTween = this.game.add.tween(card.scale).to({
            x: 1,
            y: 1,
        }, this.FLIP_SPEED / 2, Phaser.Easing.Linear.None);

        // once the card has been placed down on the table, we can flip it again
        backFlipTween.onComplete.add(function(){
            card.data.isFlipping = false;
            card.data.flipped = false;
        }, this);

        this.cardFlip.play();

        flipTween.start();

      }, this);
    }

    // clear selected cards
    this.selectedCards.length = 0;
    this.uiBlocked = false;
  },
  matchPattern: function(selectedCards) {
    return (selectedCards[0].data.pattern === selectedCards[1].data.pattern);
  },
  gameOver: function() {
    // remove timer
    this.game.time.events.remove(this.gameTimer);

    // clear local storage
    localStorage.clear();

    // start complete state
    this.game.state.start(
      'CompleteState', 
      true, 
      false, 
      { 
        "clicks": this.clicks,
        "score": this.score, 
        "elapsedTime": this.elapsedTime 
      });
  },
  updateScore: function(value) {

    this.scores.removeAll();
    this.score += value;

    var score_numbers = this.score
      .toString()
      .split('')
      .map(function(item, index){
        return parseInt(item);
      });

    var text_number;
    score_numbers.forEach(function(item, index){
      text_number = this.add.sprite(0, 0, 'text_' + item + '_small').alignTo(this.text_dots_small, Phaser.RIGHT_CENTER, index * 25);
      this.scores.add(text_number);
    }, this);
  },
  getStorage: function() {
    var storage = {
      deck: this.deck,
      removedCards: [],
      elapsedTime: 0,
      score: 0,
      clicks: 0
    };

    var tempStorage = localStorage.getItem('storage');

    if(tempStorage !== null && tempStorage !== undefined && tempStorage !== "undefined") {
      storage = JSON.parse(tempStorage);
    }

    return storage;
  },
  saveStorage: function() {
    this.storage.score = this.score;
    this.storage.elapsedTime = this.elapsedTime;
    this.storage.clicks = this.clicks;

    localStorage.setItem('storage', JSON.stringify(this.storage));
  }
};
