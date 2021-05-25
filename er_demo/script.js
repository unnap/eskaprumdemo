const modal = document.getElementsByClassName('modal');
const viesti = document.getElementById('viesti');
const ovilukko = document.getElementById('ovilukko');
/*const pc = document.getElementById('pchitbox');
const kirja1 = document.getElementById('kirja1hitbox');
const kirja2 = document.getElementById('kirja2hitbox');
const kirja3 = document.getElementById('kirja3hitbox');
const kirja4 = document.getElementById('kirja4hitbox');
const ovi = document.getElementById('ovihitbox');
const kahva = document.getElementById('kahvahitbox');
const kasvi = document.getElementById('kasvihitbox');
const pot = document.getElementById('pothitbox');
const kello = document.getElementById('kellohitbox');*/
const lok = document.getElementById('lok');
const skul = document.getElementById('skul');
const ufo = document.getElementById('ufo');
const x = document.getElementsByClassName('close');
let tavaraluettelo = [];

function popup(x) {
  modal[x].style.display = 'block';
}

window.onclick = function(event) {
  for(let i=0;i<modal.length;i++) {
    if (event.target == modal[i]) {
      modal[i].style.display = 'none';
    }
  }
}

function sulje(button) {
  button.parentNode.parentNode.style.display = 'none';
}

function take() {
  skul.remove();
  tavaraluettelo.push('skul');
  console.log(tavaraluettelo);
  modal[10].style.display = 'none';
}

function pester() {
  ufo.classList.toggle('pester');
  modal[11].style.display = 'none';
}

function unlock() {
  if (tavaraluettelo.length==0) {
    modal[9].style.display = 'none';
    viesti.innerHTML = 'TARVIT AVAIMEN';
  } else {
    modal[9].style.display = 'none';
    viesti.innerHTML = 'PÄÄSIT ULOS!!!!!!!';
    ovilukko.innerHTML = 'Ovi ei ole enään lukossa';
    lok.remove();
    ufo.classList.add('dance');
  }
}
