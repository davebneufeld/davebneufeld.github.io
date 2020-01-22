var App = App || {};

App.CompleteState = {
  init: function(data) {
    this.score = data.score;
  },
  create: function() {
    var text_gameover = this.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'text_gameover');
    text_gameover.anchor.setTo(0.5);

    var text_score = this.add.sprite(this.game.world.width / 2 - 50, this.game.world.height / 2 + 100, 'text_score');
    text_score.anchor.setTo(0.5);

    var text_dots = this.add.sprite(0, 0, 'text_dots').alignTo(text_score, Phaser.RIGHT_CENTER, 0);

    var numbers_score = this.score
      .toString()
      .split('')
      .map(function(item, index){
        return parseInt(item);
      });

    var text_number;
    numbers_score.forEach(function(item, index){
      text_number = this.add.sprite(0, 0, 'text_' + item).alignTo(text_dots, Phaser.RIGHT_CENTER, index * 42);
    }, this);

    this.game.input.onDown.addOnce(this.restart, this);
  },
  update: function() {

  },
  restart: function() {
    this.game.state.start('GameState');
  }
}
