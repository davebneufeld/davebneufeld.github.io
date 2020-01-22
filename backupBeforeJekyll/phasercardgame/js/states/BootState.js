var App = App || {};

App.BootState = {
  init: function() {
    console.log('BootState', 'init');

    //loading screen will have a white background
    this.game.stage.backgroundColor = '#000';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },
  preload: function() {

  },
  create: function() {
    this.game.state.start('PreloadState');
  }
};
