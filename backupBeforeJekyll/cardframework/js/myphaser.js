var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('tapete', 'assets/tapete.png');
    game.load.image('1bastos', 'assets/1bastos.png');
    game.load.image('1copas', 'assets/1copas.png');
    game.load.image('1oros', 'assets/1oros.png');
    game.load.image('1espadas', 'assets/1espada.png');
    game.load.image('cardContainer', 'assets/cardcontainer.png');
    game.load.image('target', 'assets/target.png');
    game.load.image('cardback', 'assets/cardback.png');
    game.load.image('mbanner', 'assets/messagebanner.png');
    game.load.image('hudpoints', 'assets/hudpoints.png');
    game.load.image('particle', 'assets/particle.png');

    game.load.image('confetiverde', 'assets/confetiverde.png');
    game.load.image('confetirojo', 'assets/confetirojo.png');
    game.load.image('confetiazul', 'assets/confetiazul.png');
    game.load.image('confetiamarillo', 'assets/confetiamarillo.png');


}
var t = null;
var cardC = null;
var hplayer = null;
function create() {
  game.stage.backgroundColor = "#4488AA";
	tapete = game.add.sprite(0, 0, 'tapete');

  cardC = new cardContainer('cardContainer');

  t = new target('target',game.world.centerX,game.world.centerY+90);


  c3 = new card('1copas',100,{"target":t, "id": "1copas"});
  c2 = new card('1bastos',200,{"target":t, "id":"1bastos"});
  c4 = new card('1oros',300,{"target":t, "id":"1oros"});

  cardC.addCard(c3);
  cardC.addCard(c2);
  cardC.addCard(c4);

  var csource = new cardSource('cardback',game.world.centerX-300,game.world.centerY,'1espadas',cardC);
  csource.enable();

  hplayer = new hudplayer(100, 50, 'hudpoints','particle',false);
  hplayer.setPoints(0);
  hplayer.setName("Alvaros");

  var enemy = new hudplayer(game.world.width -100, 50, 'hudpoints','particle',true);
  enemy.setPoints(0);
  enemy.setName("Contrincante");

  //new label(0,0,"Robar carta",csource);
  //1.-Iniciamos una partida
  //Generamos una baraja:
  var baraja = new localSpanishBriscaDeck();
  baraja.genDeck();

  new transitionTween("Nueva partida",'mbanner');
  new winTween('text',['confetiverde','confetirojo','confetiazul','confetiamarillo']);

}


function update() {

}



/**
* Se trata de un contenedor de n cartas, la mano del jugador
*
**/
var cardContainer = function(img){
    this.sprite = game.add.sprite(game.world.centerX,game.world.height - 50,img);
    this.sprite.anchor.set(0.5);
    this.cardArr = [];
    this.numC = 0; //Número de cartas del contenedor
    this.cardWidth = 0;

    this.addCard = function(card){
      console.log("Adding card ... Handid:");
      console.log(card["CustomProperties"]["id"]);
      this.cardWidth += card.width;
      card.y = this.sprite.y;
      card.handId = this.numC;
      this.cardArr.push(card);
      this.numC +=1;
      this.renderCards();
    }//End add card

    this.removeCard = function(handId){
      for (var i = 0; i < this.cardArr.length; i++) {
        if(this.cardArr[i]["CustomProperties"]["id"] == handId){
          this.cardArr.splice(i, 1);
          break;
        }
      }

      console.log("Mano: ");
      for (var i = 0; i < this.cardArr.length; i++) {
        console.log("Carta: " + this.cardArr[i]["CustomProperties"]["id"]);
      }

      this.renderCards();
    }

    this.renderCards = function(){
      var offsett = game.width - (this.sprite.x + this.sprite.width/2);
      var widthtocenter = this.sprite.width/2 + offsett;
      var offcards = widthtocenter - this.cardWidth/2;
      var padding = 10;
      //console.log("width: " + offsett);
      //console.log("amcho contenedor: " + this.sprite.width + " ancho cartas: " +  this.cardWidth + " offset: " + offcards);
      for (var i = 0; i < this.cardArr.length; i++) {
        this.cardArr[i].x = offcards + (this.cardWidth/2 + padding) * i;
      }

    }//End render card

}

/**
*Crea una carta a partir de una imagen suministrada
*
**/
var card= function(img,x,pJ){
  var scfac = 0.5;
  this.pJ = pJ;
  el = game.add.sprite(game.world.width/2 - x + 100,game.world.height- 200,img);
  el["CustomProperties"] = pJ;
  el.anchor.set(0.5);
  el.scale.setTo(scfac, scfac);
  el.inputEnabled = true;
  el.events.onInputOver.add(function(obj){
    game.add.tween(obj.scale).to( { x: .6, y: .6 }, 180, Phaser.Easing.Linear.None, true);
    //game.add.tween(obj).to( { y: obj.y - 20}, 300, Phaser.Easing.Linear.None, true);
  }, this);
  el.events.onInputOut.add(function(obj){
    game.add.tween(obj.scale).to( { x: .5, y: .5 }, 180, Phaser.Easing.Linear.None, true);
    //game.add.tween(obj).to( { y: obj.y+20}, 300, Phaser.Easing.Linear.None, true);
  },this);
  el.events.onInputDown.add(function(obj){
      t = this.pJ.target;
      if(this.pJ.target.empty){
        game.add.tween(obj).to( { y: t.sprite.y, x:t.sprite.x }, 500, Phaser.Easing.Linear.None, true);
        console.log("Eliminando carta con id: " + this.pJ["id"]);
        cardC.removeCard(this.pJ["id"]);
        console.log("Actualizando puntos ...");
        hplayer.IncPoints(3);
        //this.pJ.target.empty = false;
      }

  }, this);


  return el;
}


var target = function(img,x,y){
  var scfac = 0.5;
  this.empty = true;
  this.sprite = game.add.sprite(x,y,img);
  this.sprite.anchor.set(0.5);
  this.sprite.scale.setTo(0.5,0.5);
}

var cardSource = function(img,x,y,dispcard,cardC){
  var scfac = 0.5;
  this.enabled = false;
  this.dispcard = dispcard == null ? dispcard : null;

  disp = game.add.sprite(x,y,dispcard);
  disp.anchor.setTo(0.5, 0.5);
  disp.scale.setTo(0.5,0.5);
  disp.x += disp.width/2;
  disp.angle = 90;

  //Sombra:
  shadow = game.add.sprite(x + 5, y, img);
  shadow.anchor.set(0.5);
  shadow.scale.setTo(0.6,0.5);
  shadow.tint = 0x000000;
  shadow.alpha = 0.5;

  cardsrc = game.add.sprite(x,y,img);
  cardsrc.anchor.set(0.5);
  cardsrc.scale.setTo(0.5,0.5);
  cardsrc.inputEnabled = true;

  //FUNCIONES
  this.enable = function(){this.enabled = true;}
  this.disable = function(){this.enabled = false;}
  //Eventos
  cardsrc.events.onInputOver.add(function(obj){
    game.add.tween(obj.scale).to( { x: .6, y: .6 }, 180, Phaser.Easing.Linear.None, true);
    //game.add.tween(obj).to( { y: obj.y - 20}, 300, Phaser.Easing.Linear.None, true);
  }, this);
  cardsrc.events.onInputOut.add(function(obj){
    game.add.tween(obj.scale).to( { x: .5, y: .5 }, 180, Phaser.Easing.Linear.None, true);
    //game.add.tween(obj).to( { y: obj.y+20}, 300, Phaser.Easing.Linear.None, true);
  },this);
  cardsrc.events.onInputDown.add(function(obj){
      if(this.enabled){
          new transitionTween("Robando carta ...",'mbanner');
          tmpCard = new card('1bastos',200,{"target":t});
          cardC.addCard(tmpCard);
          this.enabled = false;
      }//End enabled
  }, this);

}


var label = function(x,y,text,target){
  var style = { font: "20px Arial", fill: "black", wordWrap: true, align: "center", background:"black"};

  if(target != null) text = game.add.text(target.sprite.x + x, target.sprite.y + y,text, style);
  else text = game.add.text(x, y,text, style);

  text = game.add.text(target.sprite.x + x, target.sprite.y + y,text, style);
  text.anchor.set(0.5);
  //console.log(text);
  return text;
}


var hudplayer = function(x,y,img,particle,flip){
  this.name = "Default";
  this.points = 0;
  this.puser =null;
  this.particle = particle != null ?  particle : null;
  var hud =  game.add.sprite(x,y,img);
  hud.anchor.set(0.5);
  hud.scale.setTo(0.5, 0.5);
  if(flip != null)
  if(flip) hud.scale.x *= -1;

  this.dispParticles = function(offset){
    if(this.particle != null){
         emitter = game.add.emitter(x-offset, y, 100);
         emitter.makeParticles(particle);
         emitter.gravity = 200;
         emitter.start(true, 2000, null, 10);
    }
  }//End disp particles
  //Player name
  this.setName = function(name){
    if(name != null) this.name = name;
    var stylen = { font: "18px Helvetica", fill: "white", wordWrap: true, align: "center", background:"white"};

    if(flip != null)
    if(!flip) nuser = game.add.text(x + 20,y,this.name,stylen);
    else nuser = game.add.text(x - 30,y,this.name,stylen);

    nuser.anchor.set(0.5);
  }

  this.updatePoints = function(val){
    this.points = val;
    this.puser.setText(this.points.toString());
    this.dispParticles(54);
  }

  this.IncPoints = function(val){
    this.points += val;
    this.puser.setText(this.points.toString());
    this.dispParticles(54);
  }

  this.setPoints = function(newValue){
    //Player points
    if(newValue != null) this.points = newValue;
    var stylep = { font: "30px Helvetica", fill: "white", wordWrap: true, align: "center", background:"white"};
    if(flip != null)
    if(!flip){
        this.dispParticles(54);
        this.puser = game.add.text(x-54,y,this.points.toString(),stylep);
    }
    else{
        this.dispParticles(-54);
        this.puser = game.add.text(x+58,y,this.points.toString(),stylep);
    }
    this.puser.anchor.set(0.5);
    this.puser.scale.setTo(0.1, 0.1);
    game.add.tween(this.puser.scale).to( {x:1,y:1 }, 200 , Phaser.Easing.Linear.None, true);

  }//End set points

}//End hud player


var winTween = function(text,confetiArr){
  emitter = game.add.emitter(game.world.centerX, -20, 100);
  for (var i = 0; i < confetiArr.length; i++) {
    emitter.makeParticles(confetiArr[i]);
    emitter.minParticleSpeed.setTo(-500, 30);
    emitter.maxParticleSpeed.setTo(500, 200);
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.8;
    emitter.gravity = 250;
    emitter.start(true, 2000, null, 600);
  }

}

var transitionTween = function(text,bg){
  var time = 3000;
  mb =  game.add.sprite(0,game.world.centerY,bg);
  mb.y -= mb.height/2;
  var style = { font: "25px Helvetica", fill: "white", wordWrap: false, align: "center", background:"white"};
  text = game.add.text(-10, game.world.centerY,text,style);
  text.y -= text.height/2;
  game.add.tween(text).to( { x:game.world.width }, time, Phaser.Easing.Linear.None, true);
  game.add.tween(mb).to( { alpha:0 }, time , Phaser.Easing.Linear.None, true);


  setTimeout(function(){
    mb.destroy();
    text.destroy();
  }, time);
}
