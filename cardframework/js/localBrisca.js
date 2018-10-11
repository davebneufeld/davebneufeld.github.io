/**
*=================================================================
*=============== JUGAR A LA BRISCA EN LOCAL =======================
*=================================================================
*/
var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//===== VARIABLES GLOBALES
var t = null;
var cardC = null;
var hplayer = null;
var csource = null;

var baraja = null; //Baraja que se empleará en la partida.
var turno = 'j1'; //Marca de que jugador es el turno j1 -> jugador 1 j2 -> jugador 2;


function preload() {
    game.load.image('tapete', 'assets/tapete.png');
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

    //-> -1 Creamos la baraja y cargamos las imagenes
    baraja = new localSpanishBriscaDeck();
    baraja.genDeck();
    for (var i = 0; i < baraja.deck.length; i++) game.load.image(baraja.deck[i]["id"], 'assets/'+baraja.deck[i]["img"]);


}

function create() {
  //======> ELEMENTOS DE LA PARTIDA
  //-> 0.- Instanciamos los elementos graficos de la PARTIDA
  game.stage.backgroundColor = "#4488AA";
	tapete = game.add.sprite(0, 0, 'tapete'); //Tapete fonto
  cardC = new cardContainer('cardContainer'); //Contenedor/mano de las cartas
  t = new target('target',game.world.centerX,game.world.centerY+90); //Target donde se instancian las cartas que lanza el jugador

  //-> 1.- Generamos la baraja que se empleará en la partida
  csource = new cardSource('cardback',game.world.centerX-300,game.world.centerY,baraja.lastCard["id"],cardC); //Carta a la que vamos en la brisca y fuente de cartas
  csource.enable();

  new transitionTween("Nueva partida",'mbanner'); //Banner inicio partida
  new winTween('text',['confetiverde','confetirojo','confetiazul','confetiamarillo']); //Confeti de inicio

  //-> 2.- Inicializamos a los jugadores:
  hplayer = new hudplayer(100, 50, 'hudpoints','particle',false);
  hplayer.setPoints(0);
  hplayer.setName("Alvaros");

  var enemy = new hudplayer(game.world.width -100, 50, 'hudpoints','particle',true);
  enemy.setPoints(0);
  enemy.setName("Contrincante");


}

function update() {

}

/**
*======================================================
*===================== PARTIDA =======================
*======================================================
*/

var localSpanishBriscaDeck = function(){
    this.palos = ["oros","bastos","copas","espadas"]; //Palos que van a jugar
    this.cartas = [1,2,3,4,5,6,7,10,11,12]; //Cartas que van a jugar
    this.palo = ""; //Marca que palo es el que manda en la partida
    this.deck = [];
    this.lastCard;
    this.shuffle =[];
    this.deckC = 0;
    this.genDeck = function(){
      for (var i = 0; i < this.palos.length; i++) {
        for (var k = 0; k < this.cartas.length; k++) {
          var img = this.cartas[k] + this.palos[i];
          var atk = 0;
          if(this.cartas[k] == 1) atk = 14;
          else if(this.cartas[k] == 3) atk = 13;
          else atk = this.cartas[k];
          var cartaStruct = {"id":img ,"palo":this.palos[i], "valor":this.cartas[k], "img":img+".png", "atk":atk};

          this.deck.push(cartaStruct);
        }//End loop cartas
      }//End loop palos
      this.genShuffle();
      return this.deck;
    }//End gen deck

    this.genShuffle = function(){
      l = this.deck.length;
      var arr = [];
      while(arr.length < l){
          var randomnumber = Math.floor(Math.random()*l) + 1;
          if(arr.indexOf(randomnumber) > -1) continue;
          arr[arr.length] = randomnumber;
      }
      this.shuffle = arr;
      //Seleccionamos el palo con el que se jugará la PARTIDA
      var lastCardd = this.shuffle[this.shuffle.length - 1];
      this.palo = this.deck[lastCardd]["palo"];
      this.lastCard = this.deck[lastCardd];
    }

    this.getCard = function(){
      if(this.cardsToLeave() - 1 >= 0){
        var cardNum = this.shuffle[this.deckC];
        this.deckC ++;
        return this.deck[cardNum];
      }else return false;
    }

    this.getNCards = function(n){
      if(this.cardsToLeave() - n >= 0){
          tmpArr = [];
          for (var i = 0; i < n; i++) {
            tmpArr.push(this.getCard());
          }
          return tmpArr;
      }else return false;
    }//End get n cards

    this.cardsToLeave = function(){
      return this.deck.length - this.deckC;
    }

}//End deck

/**
*Comparador de cartas para decidir quien gana una ronda, segun
*las reglas de la brisca
*/
var briscaComparator = function(){
  this.compare = function(cardP1,cardP2,palo){

  }//End compare
}

/**
*======================================================
*===================== INTERFAZ =======================
*======================================================
*/
/**
* Se trata de un contenedor de n cartas, la mano del jugador
*
**/
var cardContainer = function(img){
    this.sprite = game.add.sprite(game.world.centerX,game.world.height - 50,img);
    this.sprite.anchor.set(0.5);
    this.cardArr = [];
    this.unitCardWidth =0;
    this.numC = 0; //Número de cartas del contenedor
    this.cardWidth = 0;

    this.addCard = function(card){
      console.log("Adding card ... Handid:");
      console.log(card["CustomProperties"]["id"]);

      this.unitCardWidth = card.width;
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
          this.cardWidth -= this.unitCardWidth;
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
      var widthtocenter = game.world.centerX;
      var padding = 80;
      var varpa = padding;
      //console.log("width: " + offsett);
      //console.log("amcho contenedor: " + this.sprite.width + " ancho cartas: " +  this.cardWidth + " offset: " + offcards);
      var def = 1;
      var count = 1;
      for (var i = 0; i < this.cardArr.length; i++) {
        def = i % 2 == 1 ? -1:1;
        if(i==0){
          this.cardArr[i].x = widthtocenter;
        }else{
          console.log("padding: " + padding);
          this.cardArr[i].x = widthtocenter + varpa * def;
          if(count == 2){
            varpa += padding;
            count = 0;
          }
          count += 1;
        }//End else 0
      }//Endfor
    }//End render card


}

/**
*Crea una carta a partir de una imagen suministrada
*
**/
var card= function(img,x,pJ){
  var scfac = 0.5;
  this.pJ = pJ;
  el = game.add.sprite(-100,-100,img);
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

  this.robaCartaTween = function(selx,sely){
    shadow2 = game.add.sprite(cardsrc.x, cardsrc.y, img);
    shadow2.anchor.set(0.5);
    shadow2.scale.setTo(0.55,0.55);
    shadow2.tint = 0x000000;
    shadow2.alpha = 0.5;
    game.add.tween(shadow2).to( { x: selx, y: sely }, 900, Phaser.Easing.Linear.None, true);
    game.add.tween(shadow2).to( { angle:180 }, 1000, Phaser.Easing.Linear.None, true);
    cardrepar = game.add.sprite(cardsrc.x,cardsrc.y,img);
    cardrepar.anchor.set(0.5);
    cardrepar.scale.setTo(0.5,0.5);
    game.add.tween(cardrepar).to( { x: selx, y: sely }, 1000, Phaser.Easing.Linear.None, true);
    game.add.tween(cardrepar).to( { angle:180 }, 1000, Phaser.Easing.Linear.None, true);
    return [shadow2,cardrepar];
  }

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
          var car = baraja.getCard();
          new transitionTween("Robando carta ...",'mbanner');
          tmpCard = new card(car["id"],200,{"target":t});
          var ret = this.robaCartaTween(cardC.sprite.x,game.world.height + cardC.sprite.height/2);
          setTimeout(function(){
              cardC.addCard(tmpCard);
              ret[0].destroy();
              ret[1].destroy();
          }, 1200);

          //this.enabled = false;
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
