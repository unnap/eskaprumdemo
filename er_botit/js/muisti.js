const kortit = [
              {pari: 'A', kuva: 'grafiikka/mp/k01.jpg'},
              {pari: 'A', kuva: 'grafiikka/mp/k01.jpg'},
              {pari: 'B', kuva: 'grafiikka/mp/k02.jpg'},
              {pari: 'B', kuva: 'grafiikka/mp/k02.jpg'},
              {pari: 'C', kuva: 'grafiikka/mp/k03.jpg'},
              {pari: 'C', kuva: 'grafiikka/mp/k03.jpg'},
              {pari: 'D', kuva: 'grafiikka/mp/k04.jpg'},
              {pari: 'D', kuva: 'grafiikka/mp/k04.jpg'},
              {pari: 'E', kuva: 'grafiikka/mp/k05.jpg'},
              {pari: 'E', kuva: 'grafiikka/mp/k05.jpg'},
              {pari: 'F', kuva: 'grafiikka/mp/k06.jpg'},
              {pari: 'F', kuva: 'grafiikka/mp/k06.jpg'},
              {pari: 'G', kuva: 'grafiikka/mp/k07.jpg'},
              {pari: 'G', kuva: 'grafiikka/mp/k07.jpg'},
              {pari: 'H', kuva: 'grafiikka/mp/k08.jpg'},
              {pari: 'H', kuva: 'grafiikka/mp/k08.jpg'},
              {pari: 'I', kuva: 'grafiikka/mp/k09.jpg'},
              {pari: 'I', kuva: 'grafiikka/mp/k09.jpg'},
              {pari: 'J', kuva: 'grafiikka/mp/k10.jpg'},
              {pari: 'J', kuva: 'grafiikka/mp/k10.jpg'},
              {pari: 'K', kuva: 'grafiikka/mp/k11.jpg'},
              {pari: 'K', kuva: 'grafiikka/mp/k11.jpg'},
              {pari: 'L', kuva: 'grafiikka/mp/k12.jpg'},
              {pari: 'L', kuva: 'grafiikka/mp/k12.jpg'}
                                              ];
const lauta = document.getElementById('muistipeli');
const korttiFade = document.getElementsByClassName('kortti');
const boxDiag = document.getElementById('boxDiag');

const cardClick = new Audio('sound/SFX_Powerup_47.wav');
      cardClick.volume = 0.3;
      cardClick.playbackRate = 0.7;
const notPair = new Audio('sound/SFX_Powerup_44.wav');
      notPair.volume = 0.4
      notPair.playbackRate = 0.7;
const boxUnlock = new Audio('sound/DoorLock.wav');

let pakka = [];
let valitut = [];
let parit = [];
let tulos = '';


luoPakka();
function luoPakka() {

  //Tehdään pakka kortti arraysta
  for(let i=0;i<24;i++) {
    pakka.push(kortit[i]);
  }

  //Pakan sekoitus käyttäen Fisher-Yates shufflea
  let temp;
  for(let i=pakka.length-1;i>0;i--) {
    let rando = Math.floor(Math.random()*(i+1));
    temp = pakka[i];
    pakka[i] = pakka[rando];
    pakka[rando] = temp;
  }

  //Kutsutaan kortit näytölle
  luoLauta();
}


function luoLauta() {

  //Korttien luonti laudalle
  for(let i=0;i<pakka.length;i++) {
    let kortti = document.createElement('img'); //Kortti-elementin luonti
    kortti.setAttribute('src', 'grafiikka/mp/card_back.jpg'); //Asetetaan kuvaksi kortin selkä
    kortti.classList.add('kortti'); //Lisätään kortille classi
    kortti.dataset.pari = pakka[i].pari; //Lisätään kortin dataan pari-tieto
    kortti.id = i; //Kortin uniikki id
    kortti.addEventListener('click', kaanna); //Lisätään korttiin kääntö funktio
    lauta.appendChild(kortti); //Viimeiseksi lyödään kortti laudalle
  }
}


function kaanna() {
  let valittu = this.id;

  cardClick.play();

  //Haetaan kortin tunnistustiedot ja työnnetään valitut-listaan
  valitut.push(this.dataset.pari);
  valitut.push(this.id);

  //Kortin kääntö
  this.setAttribute('src', pakka[valittu].kuva);

  //Estetään kortin uudelleen valinta
  document.getElementById(valittu).removeEventListener('click', kaanna)

  //Tarkistaa jos on käännetty kaksi korttia
  if (valitut.length === 4) {

      //Jos on pari
      if (valitut[0] === valitut[2]) {

        //Siirretään parit listaan
        parit.push(valitut[1]);
        parit.push(valitut[3]);
        document.getElementById(valitut[1]).classList.add('fadeCard');
        document.getElementById(valitut[3]).classList.add('fadeCard');
        //Vaihdetaan parin ID:t ettei myöhemmät loopit enää koske niihin
        document.getElementById(valitut[1]).id += 'match';
        document.getElementById(valitut[3]).id += 'match';

        //Tyhjennetään valitut kortit pois
        valitut = [];

        //Jos kaikille on löytynyt pari
        if (parit.length === pakka.length) {

          //Tulostetaan voitto-viesti ja tulos näkyviin
          boxUnlock.play();
          boxDiag.innerHTML = 'Hey, I think I can take the lid off now!';
          lidOffDiag = true;

          //Ajastimen pysäytys
          //clearInterval(aika);
        }
      } else { //Jos EI ollut pari
        notPair.play();

        //Kääntämättömien korttien esto
        //Olisi varmaan ollut helpompi tapa tehdä tämä
        //Mutta tähän päädyin sen aikaisilla taidoilla
        for(let i=0;i<pakka.length;i++) {
          if (document.getElementById(i) !== null) { //tarkastaa että kyseinen ID on olemassa
          document.getElementById(i).removeEventListener('click', kaanna);  //Kääntö-funktion poisto
          }
        }

        /*Aloittaa ajastimen joka vapauttaa kääntämättömät kortit
        ja kääntää valitut kortit nurin kuluneen ajan jälkeen*/
        setTimeout(function() {

          //Korttien kääntö nurin
          document.getElementById(valitut[3]).setAttribute('src', 'grafiikka/mp/card_back.jpg');
          document.getElementById(valitut[1]).setAttribute('src', 'grafiikka/mp/card_back.jpg');

          //Poistetaan kortit valitut-listalta
          valitut = [];

          //Sallii taas kääntämättömät kortit
          for(let i=0;i<pakka.length;i++) {
            if (document.getElementById(i) !== null) { //ID:n olemassaolon tarkastus
            document.getElementById(i).addEventListener('click', kaanna); //Lisätään kääntö-funktio takaisin
            }
          }
        }, 700); //Aika minkä jälkeen tuo kaikki tapahtuu
      }
  }
}

function openBoxLid() {
  takeItem.play();
  box.style.display = 'none';
  boxOpen.style.display = 'block';
  boxLid.style.display = 'block';
  dialogue.innerHTML = 'Would you look at that';
  key.style.display = 'block';
  ambient.pause();
  keyFanfare.play();
  lidOffDiag = false;
  keyOnSceen = true;
  boxDiag.innerHTML = 'Where does mom GET all this stuff?'
  //Seuraavassa loopissa poistetaan animaatio class ja lisätään class jossa
  //korttien läpinäkyvyys on sama kuin animaation lopussa
  //Koska jos modalin avaa uudelleen, animaatiot alkaa uudelleen
  for(let f=0; f<pakka.length; f++) {
    korttiFade[f].classList.remove('fadeCard');
    korttiFade[f].classList.add('fadedCard');
  }
}
