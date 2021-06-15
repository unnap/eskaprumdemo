const cvs = document.getElementById('flappyufo'); //Haetaan canvas
const ctx = cvs.getContext('2d'); //Konteksti 2d
//Paikka mihin tulee teksti huonoa loppua varten
const thinkingThoughts = document.getElementById('newApproach');

//Määritellään kuvien nimet
const desktop = new Image();
const titleScreen = new Image();
const extraSolved = new Image();
const fufoSprite = new Image();
const fuGO = new Image();
const fusplosion = new Image();
const bgSky = new Image();
const bgCity = new Image();
const fg = new Image();
const numSheet = new Image();
const tentacleN = new Image();
const tentacleS = new Image();
const fuGameOver = new Image();
const fuContinue = new Image();
const fuk = new Image();
const fuWin = new Image();

//Määritellään äänien nimet
const exeClick = new Audio();
const titleTune = new Audio();
const startSound = new Audio();
const bgMusic = new Audio();
const explosion = new Audio();
const contSound = new Audio();
const flySound = new Audio();
const bleep = new Audio();
const lastBleep = new Audio();
const victorySong = new Audio();
const fuSmash = new Audio();
const shatter = new Audio();

//Kuvien osoitteet
//Nämä kai voisi laittaa new Image('tähän'); kohtaan
//Mutta kaikki tutoriaalit on pistäny ne erikseen
//¯\_(ツ)_/¯
//Jos jää aikaa ja energiaa tutkin onko sillä väliä
desktop.src = 'grafiikka/fu/fudesktop.png';
titleScreen.src = 'grafiikka/fu/futitlecard.png';
extraSolved.src = 'grafiikka/fu/fusmash.png';
fufoSprite.src = 'grafiikka/fu/fusheet.png';
fuGO.src = 'grafiikka/fu/fustgo.png';
fusplosion.src = 'grafiikka/fu/fusplosion.png';
bgSky.src = 'grafiikka/fu/gbbgsky.png';
bgCity.src = 'grafiikka/fu/gbbgcity.png';
fg.src = 'grafiikka/fu/gbfg.png';
numSheet.src = 'grafiikka/fu/numsheet.png';
tentacleN.src = 'grafiikka/fu/gbt1.png';
tentacleS.src = 'grafiikka/fu/gbt2.png';
fuGameOver.src = 'grafiikka/fu/fugo.png';
fuContinue.src = 'grafiikka/fu/fucontinue.png';
fuk.src = 'grafiikka/fu/fukey.png';
fuWin.src = 'grafiikka/fu/fuwin.png';

//Äänten osoitteet
exeClick.src = 'sound/fu/click_003.ogg';
titleTune.src = 'sound/fu/title.mp3';
titleTune.volume = 0.85;
startSound.src = 'sound/fu/start.wav';
startSound.volume = 0.6;
bgMusic.src = 'sound/fu/bgmusic.wav';
bgMusic.loop = true; //Taustamusiikin looppaus
explosion.src = 'sound/fu/explosion.wav';
explosion.volume = 0.5;
contSound.src = 'sound/fu/continue.wav';
contSound.volume = 0.4;
flySound.src = 'sound/fu/fly.wav';
bleep.src = 'sound/fu/bleep.wav';
bleep.volume = 0.6;
lastBleep.src = 'sound/fu/lastbleep.wav';
lastBleep.volume = 0.6;
victorySong.src = 'sound/fu/victory.wav';
fuSmash.src = 'sound/fu/hit.mp3.flac';
shatter.src = 'sound/fu/shatter.wav';

//Määritellään Flappy UFO 2 desktop ikonin hitbox
let fuExe = {width: 42,
             height: 66,
             x: 15,
             y: 14};

//Start- ja Continue-nappien hitboxit
let startBtn = {width: 76,
                height: 40,
                x: 408,
                y: 344};
let continueBtn = {width: 120,
                   height: 44,
                   x: 375,
                   y: 350};

//Pelaaja-hahmo (avaruus)olio
let fufo = {width: 42,
              height: 31, //Yhden framen leveys ja korkeus
              sheetW: 168, //Spritesheet leveys
              animFrame: 0, //Animaatio frame
              cols: 4, //Spritesheet sarakkeiden määrä
              x: 100, //UFOn sijainti leveys-suunnassa
              y: 150, //UFOn alku-sijainti pituus-suunnassa
              sX: 0,
              sY: 0, //Leveys ja pituus sheet-animaatiota varten
              hitboxTopRad: 11, //Ylä-hitboxin ympärysmitta
              hitboxTopX: 0,
              hitboxTopY: 0, //Määritellään ylä-hitboxin sijainti-muuttujat
              hitboxBottomW: 38,
              hitboxBottomH: 13, //Ala-hitboxin leveys ja korkeus
              hitboxBottomX: 0,
              hitboxBottomY: 0, //Määritellään ala-hitboxin sijainti-muuttujat
              speed: 0, //Aloitus-vauhti
              gravity: 0.25, //Painovoima
              jump: -4.6, //Hyppy lento-funktiota varten
              //Päivitys-funktio joka määrittelee UFOn sijainnin ja animaation
              update: function() {
                //y-sijainti ja nopeus Get Ready-näkymässä
                if(gameState.current === gameState.start) {
                  this.y = 150;
                  this.speed = 0;
                }
                //Päivitetään sijainti ja animaatio play-tilassa
                if(gameState.current === gameState.play) {
                  //Jos läpi lennettäviä lonkeroita on vielä jäljellä
                  if(passes>0) {
                    this.speed += this.gravity; //Nopeutta lisätään painovoimalla
                    this.y += this.speed; //Sijainti y-suunnassa määritetään nopeuden mukaan
                    //Määritellään ylä-hitboxin sijainti niin että se tulee ohjaamon päälle
                    this.hitboxTopX = this.x+21;
                    this.hitboxTopY = this.y+11;
                    //Ala-hitboxi tulee ala-osan päälle
                    this.hitboxBottomX = this.x+2;
                    this.hitboxBottomY = this.y+15;
                    //Määritellään animaatio-nopeus
                    //Jos framet on jaolliset 25, vaihdetaan animaatio framee
                    if (frames%25 === 0) {
                      //Lisää animaatio frameen +1
                      //Haetaan modulo-operaattorilla ja sarakkeilla jakojäännös
                      //eli 1%4=1, 2%4=2 ja niin edespäin
                      this.animFrame = ++this.animFrame % this.cols;
                      //Sen kanssa sitten kerrotaan UFOn Leveys
                      //Näin saadaan x mistä aletaan piirtämään kuvaa spritesheetista
                      this.sX = this.animFrame * this.width;
                    }
                    //Jos kaikki lonkerot on ohitettu, lopetetaan UFOn y:n päivitys
                    //Samalla tehdään animaatiosta asteen hitaampi
                  } else {
                    if (frames%40 === 0) {
                      //Sama periaate kuin ylhäällä
                      this.animFrame = ++this.animFrame % this.cols;
                      this.sX = this.animFrame * this.width;
                    }
                  }
                  //Jos tämän y on yhtä suuri tai pienempi kuin canvasin yläreuna
                  //niin pidetään y nollassa
                  //Että pelaaja ei pääse lentämään canvasista pois
                  if (this.y <= 0) {
                    this.y = 0;
                  }
                  //Jos UFOn alareuna koskee foreground-elementtiä
                  if(this.y+this.height > cvs.height-18) {
                    explosion.play(); //Soitetaan räjähdys-äänitehoste
                    tries++; //Lisätään yritys-laskuria yhdellä
                    gameState.current = gameState.end; //Mennään Game Over-tilaan
                  }
                }
              },
              //Lento-funktio
              fly: function() {
                this.speed = this.jump; //Nopeudeksi asetetaan ylempänä määritelty arvo, -4.6
              },
              //Piirto-funktio
              draw: function() {
                //Ensin kerrotaan mitä piirretään, elikkä haetaan UFO spritesheet
                //Sitten määritetään kohdan mistä lähdetään piirtämään x- ja y-arvot
                //Seuraavaksi kerrotaan kuinka leveä&korkea pala sheetistä piirretään
                //Sitten määritellään mihin paikkaan canvasista sprite piirretään
                //Viimeiseksi vielä kerrotaan kuinka suurena kuva piirretään
                ctx.drawImage(fufoSprite, this.sX, this.sY, this.width, this.height,
                              this.x, this.y, this.width, this.height);
              }
            };

//Scrollaavan taustaelementin olio
let bgScroll = {x: 0, //Ei tarvi määrittää kuin x koska y on aina sama
                speed: 1, //Scrollaus nopeus
                //Päivitys-funktio joka määrittää mihin kuva piirretään
                update: function() {
                  //Jos peli on play-tilassa
                  if (gameState.current === gameState.play){
                    this.x -= this.speed; //Vähennetään x nopeudella
                    }
                  //Jos x on sama kuin negatiivinen canvasin leveys
                  if(this.x === -cvs.width) {
                    this.x = 0; //Asetetaan x takaisin nollaan
                  }
                },
                //Piirto-funktio
                draw: function() {
                  //Piirretään samaan aikaan kaksi samaa kuvaa
                  //Ekan x on sama kuin tämän x
                  ctx.drawImage(bgCity, this.x, 0);
                  //Toisen x on tämän x plus canvasin leveys
                  ctx.drawImage(bgCity, this.x+cvs.width, 0);
                }};
//Scrollaava foreground elementti
//Tismalleen sama kuin edellinen olio paitsi nopeus on asteen nopeampi
let fgScroll = {x: 0,
                speed: 2,
                update: function() {
                  if (gameState.current === gameState.play){
                    this.x -= this.speed;
                    }
                  if(this.x === -cvs.width) {
                    this.x = 0;
                  }
                },
                draw: function() {
                  ctx.drawImage(fg, this.x, 364);
                  ctx.drawImage(fg, this.x+cvs.width, 364);
                }};

//Countdown-elementin funktio
//Käyttää myös spritesheet animaatiota jonka aiemmin selitin
//Paitsi että ei tarvi käyttää modulaatiota koska se mitä halutaan piirtää
//perustuu kuinka monta lonkeroa on ohitettu framejen laskemisen sijaan
let fuCountdown = {x: 470,
                    y: 10,
                    sx: 0,
                    sy: 0,
                    width: 40,
                    height: 68, //Spriten oikea leveys ja korkeus
                    //Mutta koska me halutaan piirtää kuvat pienempänä kuin
                    //ne oikeasti on, alla määritellään minkä kokoisina
                    //haluamme kuvat piirtää
                    drawW: 20,
                    drawH: 48,
                    //Päivitys-funktio
                    update: function() {
                      //Kerrotaan ohitukset tämän leveydellä että saadaan
                      //kohta josta haluamme alkaa piirtämään spritesheetista
                      this.sx = passes * this.width;
                      //Kutsutaan tämän piirto-funktiota
                      this.draw();
                    },
                    //Piirto-funktio
                    draw: function() {
                      //Jos yhtään ohitusta ei ole vielä tehty
                      if(passes===10) {
                        //Haetaan spritesheetiltä numero 1
                        ctx.drawImage(numSheet, this.width, this.sy,
                          this.width, this.height,
                          450, this.y, this.drawW, this.drawH);
                        //Haetaan spritesheetiltä numero 0 ja piirretään se ykkösen jälkeen
                        ctx.drawImage(numSheet, 0, this.sy,
                          this.width, this.height,
                          470, this.y, this.drawW, this.drawH);
                        //Muuten jos ohituksia on vielä jäljellä, piirretään vain
                        //yksi numero
                      } else if (passes>0){
                        ctx.drawImage(numSheet, this.sx, this.sy,
                          this.width, this.height,
                          this.x, this.y, this.drawW, this.drawH);
                          //Ja kaikki tämä vaiva koska en saanut Google fontseja
                          //toimimaan Chromessa
                          //Ironista
                          //Firefoxilla se sujui niin vaivatta
                          //Mielummin piirsin omat numerot kuin aloin jahtaamaan
                          //oikeaa vastausta netistä
                          //goddamn.
                          //Tulipa spritesheet animaatio harjoitusta
                        }
                    }
                    };

//Lista lonkeroille
let tentacleList = [];
//Lonkero constructor
class Tentacles {
  constructor() {
    this.x = cvs.width; //Aloitus x on canvasin leveys
    this.maxY = -120; //Maximi y-arvo
    this.width = 35; //Hitbox-leveys
    this.spriteWidth = 55; //Kuvan oikea leveys
    this.height = 297; //Kuvan pituus
    this.top = this.maxY * (Math.random() +1); //Arvotaan randomi y-arvo ylälonkerolle
    //Alalonkeron y perustuu ylälonkeron y-arvoon
    //Kummatkin ovat saman pituisia, niin lasketaan ylälonkeron x plus tämän pituus
    //PLUS 87, joka on se hajurako joka lonkeroiden väliin tulee
    this.bottom = this.top + this.height+87;
    //Lisätään booleani niin että tätä ei laskettaisi kahdesti
    this.counted = false;
  }
  //Piirto-funktio
  draw() {
    ctx.drawImage(tentacleN, this.x, this.top);
    ctx.drawImage(tentacleS, this.x, this.bottom);
  }
  //Päivitys
  update() {
    //Lonkeroiden x määrittyy pelivauhti muuttujan mukaan
    this.x -= gamespeed;
    //Koska hitboxin ja kuvan leveydet ovat eri, asetetaan hitboxin x
    //niin että se olisi mahdollisimman reilusti lonkero-kuvan päällä
    this.hitboxX = this.x+10;
    //Piirto-funktion kutsu
    this.draw();
    //Jos kuva on hävinnyt canvasista piiloon, poistetaan se lonkerolistasta
    if(this.x <= -this.spriteWidth) {
      tentacleList.pop();
    }

    //Jos UFO on päässyt lonkeron ohi ja tätä ei ole vielä laskettu
    if(this.x+this.spriteWidth <= fufo.x && !this.counted) {
      //Vaihdetaan boolean-arvo ettei tätä enää lasketa uusiksi
      this.counted = true;
      //Miinustetaan ohituksista yksi
      passes--;
      //Jos ohituksia on vielä jäljellä
      if (passes>0) {
        //Soitetaan kolikko-ääni
        bleep.play();
      //Jos ei ole enää ohituksia, eli tämä on viimeinen lonkeropari
      } else {
        //Soitetaan vähän korkeampi kolikko-ääni
        lastBleep.play();
        //Jos canvasin alle on aktivoitunut huono loppu-vaihtoehto
        if(thoughts) {
          //Otetaan se pois
          thinkingThoughts.innerHTML = '';
          }
      }
    }

    //YLÄLONKERO HITBOXIT
    //UFOn yläosa
    //Minulla ei ole tarpeeksi voimavaroja että alan selittään yksityiskohtaisesti
    //Ymmärrän tämän vain harmaasti
    //Elikkä tässä jos UFOn ylähitboxi osuu ylälonkeroon
    if(fufo.hitboxTopX + fufo.hitboxTopRad > this.hitboxX &&
      fufo.hitboxTopX - fufo.hitboxTopRad < this.hitboxX+this.width &&
      fufo.hitboxTopY + fufo.hitboxTopRad > this.top &&
      fufo.hitboxTopY - fufo.hitboxTopRad < this.top+this.height) {
        explosion.play(); //Soitetaan räjähdys-ääni
        tries++; //Lisätään yrityksiä yhdellä
        gameState.current = gameState.end; //Siirretään pelitila Game Overiin
      }
      //UFOn alaosa
      //Kaikissa näissä toistuu sama
      //Paitsi UFOn alahitbox on nelikulmainen eikä ympyrä
      if(fufo.hitboxBottomX < this.hitboxX+this.width &&
         fufo.hitboxBottomX + fufo.hitboxBottomW > this.hitboxX &&
         fufo.hitboxBottomY < this.top+this.height &&
         fufo.hitboxBottomY+fufo.hitboxBottomH > this.top) {
           explosion.play();
           tries++;
           gameState.current = gameState.end;
         }

      //ALALONKERO HITBOXIT
      //UFOn yläosa
      if(fufo.hitboxTopX + fufo.hitboxTopRad > this.hitboxX &&
        fufo.hitboxTopX - fufo.hitboxTopRad < this.hitboxX+this.width &&
        fufo.hitboxTopY + fufo.hitboxTopRad > this.bottom &&
        fufo.hitboxTopY - fufo.hitboxTopRad < this.bottom+this.height) {
          explosion.play();
          tries++;
          gameState.current = gameState.end;
        }
        //UFOn alaosa
        if(fufo.hitboxBottomX < this.hitboxX+this.width &&
           fufo.hitboxBottomX + fufo.hitboxBottomW > this.hitboxX &&
           fufo.hitboxBottomY < this.bottom+this.height &&
           fufo.hitboxBottomY+fufo.hitboxBottomH > this.bottom) {
             explosion.play();
             tries++;
             gameState.current = gameState.end;
           }
  }
}

//Megalonkeron olio
//Hänellä on avain
let keyTentacle = {x: cvs.width,
                  y: 21,
                  width: 372,
                  update: function() {
                    //Jos tämä kuva on tullut kokonaisuudessaan esille
                    if (this.x <= cvs.width-this.width) {
                      //Pelitila vaihdetaan ratkaistuksi
                      gameState.current = gameState.solved;
                    //Muuten tämä liikkuu cinemaattista vauhtia eteenpäin
                    } else {
                      this.x -= 1.7;
                    }
                  },
                  draw: function() {
                    ctx.drawImage(fuk, this.x, this.y);
                  }
                };

//Määritellään pelitilat
const gameState = {current: 0, //<--tämä on se jota vaihdellaan
                   desktop: 0, //Default alkutila
                   title: 1, //Title-ruutu
                   start: 2, //Get Ready-tila
                   play: 3, //Pelitila
                   end: 4, //Game Over
                   solved: 5, //Ratkaistu / hyvä loppu
                   extraSolved: 6}; //EXTRA ratkaistu / huono loppu

let gamespeed = 3; //Pelivauhti
let frames = 0; //..framet
let passes = 10; //Kuinka monta ohitusta tarvitaan hyvään loppuun
let tries = 0; //Yritykset
let goOn = false; //GO-viestin animaatiot varten
let gameEnd = false; //Onko peli loppunut
let thoughts = false; //Onko huono loppu-linkki aktivoitu

//EVENT LISTENERIT
//Nämä muuttujat on sitä varten että klikattavat hitboxit pysyy
//oikeilla paikoilla vaikka sivua scrollaa
let rect;
let clickX;
let clickY;

//Tuplaklikkaus tapahtumakuuntelija
cvs.addEventListener('dblclick', function(e) {
  //Jos pelitila on desktop-tilassa
  if(gameState.current === gameState.desktop) {
    //Scrolli-turva systeemit asetettu
    rect = cvs.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;

    //Tuplaklikattava hitboxi
    if(clickX >= fuExe.x && clickX <= fuExe.x+fuExe.width &&
      clickY >= fuExe.y && clickY <= fuExe.y + fuExe.height) {
        drawGame(); //Kutsutaan pelin pääfunktiota ja aloitetaan peli
        ambient.pause(); //Pysäytetään pääpelin musiikki
        titleTune.play(); //Soitetaan lyhyt ja pirteä kappale
        gameState.current = gameState.title; //Pelitila Title screen
        //Pistetään desktop näkymä pääpelin monitorista piiloon
        monitorDesktop.style.display = 'none';
        //Tuodaan FU2 title screen näkymä pääpelin monitorille
        monitorGame.style.display = 'block';
        //Ilmoitetaan peli.js tiedostolle että peli on päällä
        gamePlaying = true;
        //Dialogiboxi päivitys
        dialogue.innerHTML = 'Oh I absolutely have time for a round or two!';
      }
  }
});
//Yksöisklikkaus tapahtumakuuntelija canvasille
cvs.addEventListener('click', function(e) {
  //Switch-case pelitiloille
  switch (gameState.current){
    //Jos desktop
    case gameState.desktop:
    //Scrollisuoja taas
    rect = cvs.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;

    //FU2 kuvakkeen hitboxi työpöydällä taas
    if(clickX >= fuExe.x && clickX <= fuExe.x+fuExe.width &&
      clickY >= fuExe.y && clickY <= fuExe.y + fuExe.height) {
        exeClick.play(); //Soitetaan klikkaus-ääni
      }
    break;

    //Jos ollaan title screenis
    case gameState.title:
      rect = cvs.getBoundingClientRect();
      clickX = e.clientX - rect.left;
      clickY = e.clientY - rect.top;

      //Starttinapin hitboxi
      if(clickX >= startBtn.x && clickX <= startBtn.x+startBtn.width &&
        clickY >= startBtn.y && clickY <= startBtn.y + startBtn.height) {
          titleTune.pause(); //Pysäytetään title musiikki jos se vielä soi
          startSound.play(); //Soitetaan startti-napin ääni
          bgMusic.play(); //Aloitetaan looppaava taustamusiikki
          gameState.current = gameState.start; //Asetetaan pelitila Get Readyyn
        }
    break;

    //Get Ready-tila
    case gameState.start:
        frames = 0; //Resetoidaan framet
        gameState.current = gameState.play; //Vaihdetaan peli play-tilaan
      break;

    //Play-tila
    case gameState.play:
      //Jos on vielä lonkeroita ohitettavana
      if(passes>0) {
        fufo.fly(); //Kutsutaan UFO (avaruus)olion fly-funktiota
        flySound.play(); //Soitetaan pieni äänitehoste
      }
    break;

    //Game Over
    case gameState.end:
      rect = cvs.getBoundingClientRect();
      clickX = e.clientX - rect.left;
      clickY = e.clientY - rect.top;

      //Continue-napin hitboxi
      if(clickX >= continueBtn.x && clickX <= continueBtn.x+continueBtn.width &&
        clickY >= continueBtn.y && clickY <= continueBtn.y + continueBtn.height) {
          gameState.current = gameState.start; //Vaihdetaan tila Get Ready-näkymään
          frames = 0; //Resetoidaan framet
          passes = 10; //Resetoidaan ohitukset
          fufo.animFrame = 0; //Resetoidaan UFOn animaatioframet
          fufo.sX = 0; //Edelleen UFOn animaatioframeresetointia
          goOn = false; //Resetoidaan GO-ilmoitus
          tentacleList = []; //Resetoidaan lonkerolista
          bgScroll.x = 0; //Resetoidaan scrollaava tausta
          fgScroll.x = 0; //Resetoidaan scrollaava foregroundi
          //Resetoidaan iso lonkero
          //Tämä on jäännös versiosta jossa en vielä ottanut pelaajan
          //kontrollia pois viimeisen lonkeron jälkeen.
          //Jätän sen silti tänne. Se ei tee pahaa
          //Ja mitä jos jotain odottamatonta sattuu ja pelaaja kuolee sen
          //jälkeen kun iso lonkero on aloittanut scrollaamisen???
          //Tämä tuo minulle mielenrauhan.
          keyTentacle.x = cvs.width;
          contSound.play(); //Soitetaan äänitehoste
        }
    break;
  }
});

//Lonkerojen kutsu
function spawnTentacles() {
  //Jos framet jaollinen sadalla ja ohituksia jäljellä enemmän kuin yksi
  if (frames%100 === 0 && passes>1) {
    //Luodaan uusi lonkero constructorista lonkerolistaan
    tentacleList.unshift(new Tentacles);
  }
  //Käydään läpi lonkerolista ja päivitetään jokainen lonkero
  for(let i=0;tentacleList.length>i;i++) {
    tentacleList[i].update();
  }
  frames++; //Lisätään framei yhdellä
}

//Huono Loppu funktio
function newApproach() {
  bgMusic.pause(); //Lopetetaan musiikki
  fuSmash.play(); //Soitetaan lyönti-ääni
  shatter.play(); //Soitetaan lasin rikkoutumisääni
  thinkingThoughts.innerHTML = ''; //Tyhjennetään ajatus-kenttä pahoista ajatuksista
  pcSolutions.style.display = 'block'; //Tuodaan näkyviin rikkoutunut PC pääpeliin
  dialogue.innerHTML = '...'; //Päivitetään dialogiboxi
  monitorGame.style.display = 'none'; //Piiloitetaan pääpelin monitorista title ruutu
  monitorBroken.style.display = 'block'; //Tuodaan rikkinäinen ruutu pääpelin monitoriksi
  gameState.current = gameState.extraSolved; //Pelitila on extra ratkaistu
  //Ajastin
  setTimeout(function() {
    unlockSound.play(); //Soitetaan lukon avautumisääni
    eleLockOpen = true; //Aktivoidaan pääpelin yksi voittokriteereistä
    lockElec.style.display = 'none'; //Piiloitetaan elektroninen lukko ovesta
    dialogue.innerHTML = 'I heard something unlock?'; //Päivitetään dialogiboxi
    gamePlaying = false; //Ilmoitetaan peli.js tiedostolle että peli on loppunut
    //Vielä yksi ajastin joka aloittaa pääpelin taustamusiikin uudelleen
    setTimeout(function() {
      if(!isDoorOpened && !keyOnSceen) {
        ambient.play();
      }
    }, 2700);
  }, 1600);
}

//Desktopin piirto-funktio
//peli.html body kutsuu tätä onload
function drawDesktop() {
  //Piirretään desktop näkymä canvasiin
  ctx.drawImage(desktop, 0, 0);
}

//Pelin pääfunktio
function drawGame() {
  //Jos yrityksiä on kymmenen ja pahoja ajatuksia ei ole aktivoitu
  if (tries === 10 && !thoughts) {
    thoughts = true; //Pahat ajatukset
    //Tuodaan pahat ajatukset canvasin alle näkyväksi
    //onclick kutsuu newApproach()-funktiota
    thinkingThoughts.innerHTML =
    '<span onclick="newApproach()" class="interact" id="solutions">Perhaps I should try another approach...?</span>';
  }

  //Pelitila Title Screen
  if (gameState.current === gameState.title) {
    ctx.clearRect(0, 0, cvs.width, cvs.height); //Tyhjennetään canvas
    ctx.drawImage(titleScreen, 0, 0); //Piirretään titlecard canvasiin
  }

  //Pelitila Get Ready
  if (gameState.current === gameState.start) {
    ctx.clearRect(0, 0, cvs.width, cvs.height); //Canvasin tyhjennys
    ctx.drawImage(bgSky, 0, 0); //Piirretään taustalle taivas
    bgScroll.update();
    bgScroll.draw(); //Taustascrolli päivitys ja piirto
    fgScroll.update();
    fgScroll.draw(); //Foregroundscrolli päivitys ja piirto
    //UFOn päivitys ja piirto
    //En pistänyt fufo.drawia fufo.updaten sisään koska ne tuntuu
    //toimivan paremmin erillään?
    fufo.update();
    fufo.draw();
    fuCountdown.update(); //Tuodaan numerot oikeaan yläkulmaan

    //Jos GO on epätosi
    if(!goOn) {
      //ja framet jaollinen 55
      if(frames%55 === 0) {
        goOn = true; //GO on tosi
      }
    //Jos GO on tosi
    } else {
      ctx.drawImage(fuGO, cvs.width/2-72.5, 50); //Piirretään GO-viesti
      //framet jaollinen 55
      if(frames%55 === 0) {
        goOn = false; //GO on epätosi
      }
    }
    frames++; //Framet kasvatetaan yhdellä
  }

  //Play-tila
  if (gameState.current === gameState.play) {
    ctx.clearRect(0, 0, cvs.width, cvs.height); //Canvasin tyhjennys
    ctx.drawImage(bgSky, 0, 0); //Taivas
    bgScroll.update();
    bgScroll.draw(); //Taustascroll
    fufo.update(); //UFO päivitys
    spawnTentacles(); //Kutsutaan lonkeroita
    fuCountdown.update(); //Tuodaan numerot oikeaan yläkulmaan
    //Jos kaikki lonkerot on ohitettu ja lonkerolistalla ei ole lonkeron lonkeroa
    if (passes===0 && tentacleList.length === 0) {
      keyTentacle.update();
      keyTentacle.draw(); //Tuodaan iso lonkero
    }
    fgScroll.update();
    fgScroll.draw(); //Foregroundscroll
    fufo.draw(); //Piirretään UFO
  }

  //Game Over
  if (gameState.current === gameState.end) {
    ctx.drawImage(fusplosion, fufo.x, fufo.y-19); //Piirretään räjähdys-efekti UFOn päälle
    ctx.drawImage(fuGameOver, cvs.width/2-167.5, 50); //Piirretään Game Over-viesti
    //Piirretään Continue-nappi ja asetetaan sille uusi leveys ja korkeus
    //Alkuperäinen koko oli liian iso ja ruma
    ctx.drawImage(fuContinue, continueBtn.x, continueBtn.y,
                  continueBtn.width, continueBtn.height);
  }

  //Ratkaistu
  if (gameState.current === gameState.solved) {
    bgMusic.pause(); //Pysäytetään taustamusiikki
    victorySong.play(); //Soitetaan voittofanfaari
    gameEnd = true; //Asetetaan peli loppuneeksi jotta drawGame() ei enää looppaisi
    //Ajastin
    setTimeout(function() {
      ctx.drawImage(fuWin, 0, 0); //Piirretään canvasiin voittoviesti
      //Toinen ajastin
      setTimeout(function() {
        unlockSound.play(); //Lukon avaus ääni
        eleLockOpen = true; //Aktivoidaan pääpelin yksi voittokriteereistä
        lockElec.style.display = 'none'; //Piiloitetaan elektroninen lukko pääpelistä
        monitorGame.style.display = 'none'; //Piiloitetaan pääpelin monitorista title-ruutu
        monitorWin.style.display = 'block'; //Tuodaan pääpelin monitorille voitto-ruutu
        //Päivitetään dialogiboxi
        dialogue.innerHTML =
        'I heard something unlock<br><br>Who designed these locks?';
        gamePlaying = false; //Ilmoitetaan peli.js tiedostolle että peli on loppunut
        //Ajasin jonka jälkeen aloitetaan pelin taustamusiikki uudelleen
        setTimeout(function() {
          if(!isDoorOpened && !keyOnSceen) {
            ambient.play();
          }
        }, 1900);
      }, 1500);
    }, 2550);
  }

  //Jos peli on extra-ratkaistu
  if (gameState.current === gameState.extraSolved) {
    ctx.drawImage(extraSolved, 0, 0); //Piirretään rikkinäinen näyttö canvasiin
    gameEnd = true; //Flagataan peli loppuneeksi
  }
    //Jos peliä ei ole flagattu loppuneeksi
    if(!gameEnd) {
    //drawGame()-funktion looppaus
    requestAnimationFrame(drawGame);
  }
}
