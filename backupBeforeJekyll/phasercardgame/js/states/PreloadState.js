var App = App || {};

App.PreloadState = {
  init: function() {
    console.log('PreloadState', 'init');
  },
  preload: function() {
    this.load.spritesheet('deck', 'assets/images/deck.png', 80, 120, 53);

    this.load.image('text_0', 'assets/images/hud/text_0.png');
    this.load.image('text_1', 'assets/images/hud/text_1.png');
    this.load.image('text_2', 'assets/images/hud/text_2.png');
    this.load.image('text_3', 'assets/images/hud/text_3.png');
    this.load.image('text_4', 'assets/images/hud/text_4.png');
    this.load.image('text_5', 'assets/images/hud/text_5.png');
    this.load.image('text_6', 'assets/images/hud/text_6.png');
    this.load.image('text_7', 'assets/images/hud/text_7.png');
    this.load.image('text_8', 'assets/images/hud/text_8.png');
    this.load.image('text_9', 'assets/images/hud/text_9.png');

    this.load.image('text_0_small', 'assets/images/hud/text_0_small.png');
    this.load.image('text_1_small', 'assets/images/hud/text_1_small.png');
    this.load.image('text_2_small', 'assets/images/hud/text_2_small.png');
    this.load.image('text_3_small', 'assets/images/hud/text_3_small.png');
    this.load.image('text_4_small', 'assets/images/hud/text_4_small.png');
    this.load.image('text_5_small', 'assets/images/hud/text_5_small.png');
    this.load.image('text_6_small', 'assets/images/hud/text_6_small.png');
    this.load.image('text_7_small', 'assets/images/hud/text_7_small.png');
    this.load.image('text_8_small', 'assets/images/hud/text_8_small.png');
    this.load.image('text_9_small', 'assets/images/hud/text_9_small.png');

    this.load.image('text_dots', 'assets/images/hud/text_dots.png');
    this.load.image('text_dots_small', 'assets/images/hud/text_dots_small.png');
    this.load.image('text_gameover', 'assets/images/hud/text_gameover.png');
    this.load.image('text_go', 'assets/images/hud/text_go.png');
    this.load.image('text_ready', 'assets/images/hud/text_ready.png');
    this.load.image('text_score', 'assets/images/hud/text_score.png');
    this.load.image('text_score_small', 'assets/images/hud/text_score_small.png');
    this.load.image('text_timeup', 'assets/images/hud/text_timeup.png');

    this.load.audio('card_flip', ['assets/audio/240776__f4ngy__card-flip.mp3', 'assets/audio/240776__f4ngy__card-flip.ogg'])
  },
  create: function() {
    this.game.state.start('GameState');
    //this.game.state.start('CompleteState', true, false, 50);
  }
};
