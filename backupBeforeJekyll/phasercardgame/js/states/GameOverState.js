var App = App || {};

App.GameOverState = {
  init: function() {
    console.log('GameOverState', 'init');
  },
  create: function() {
    var text_gameover = this.add.sprite(this.game.world.width/2, this.game.world.height/2, 'text_gameover');
    text_gameover.anchor.setTo(0.5);
  },
  update: function() {

  }
}
