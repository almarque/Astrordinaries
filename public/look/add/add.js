const screen1 = document.getElementById("screen1")
const logo1 = document.getElementById("logo1")
const btns1 = document.getElementById("btns1")
const look1 = document.getElementById("Look1")
const learn1 = document.getElementById("Learn1")
const tracin =  document.getElementById("tracin")
const primordial = document.getElementById("primordial")
const warn = document.getElementById("warn")
const x1 = document.getElementById("x1")
const x2 = document.getElementById("x2")
const pop1 = document.getElementById("pop1")
const pop2 = document.getElementById("pop2")
const backPop = document.getElementById("backPop")
const lib  = document.getElementById("lib")
const upl = document.getElementById("upl")
const gla = document.getElementById("gla")

if (localStorage.getItem('imgs') === null) {
    localStorage.setItem('imgs', 0)
}

let ratio = window.innerWidth / window.innerHeight

if (ratio <= 1) {
    primordial.style.display = "none"
    warn.style.display = "flex"
    console.log("ratio <= 1")
} else {
    primordial.style.height = `${window.innerHeight}px`
}

function checkRatio() {
    let ratio = screen.width / screen.height
    if (ratio <= 1) {
        primordial.style.display = "none"
        warn.style.display = "flex"
    } else {
        primordial.style.display = "flex"
        warn.style.display = "none"
        primordial.style.height = `${window.innerHeight}px`
    }
}

window.addEventListener("load", checkRatio)
window.addEventListener("resize", checkRatio)
window.addEventListener('orientationchange', checkRatio)

x1.addEventListener('click', function () {
    pop1.style.opacity = "0"
    backPop.style.opacity = "0"
    setTimeout(() => {
        pop1.style.display = "none"
        backPop.style.display = "none"
    }, 500);
})

x2.addEventListener('click', function () {
    pop2.style.opacity = "0"
    backPop.style.opacity = "0"
    setTimeout(() => {
        pop2.style.display = "none"
        backPop.style.display = "none"
    }, 500);
})

lib.addEventListener("click", function() {
    pop1.style.display = "flex"
    backPop.style.display = "block"
    setTimeout(() => {
        pop1.style.opacity = "1"
        backPop.style.opacity = "1"
    }, 100);
})

upl.addEventListener("click", () => {
    pop2.style.display = "flex"
    backPop.style.display = "block"
    setTimeout(() => {
        pop2.style.opacity = "1"
        backPop.style.opacity = "1"
    }, 100);
})

gla.addEventListener("click", () => {
    window.location.href = "../use/use.html"
})
document.getElementById("gla2").addEventListener("click", () => {
    let imgsValue = parseInt(localStorage.getItem('imgs'), 10)
    if (imgsValue > 0) {
        window.location.href = "../look.html"
    }
})

const activeLibs = JSON.parse(localStorage.getItem('libs_active') || '[]');

  // Pega todos os botões
  const buttons = document.querySelectorAll('.lib-btn');

  buttons.forEach(button => {
    const lib = button.dataset.lib;

    // Aplica estilo ativo se estiver salvo
    if (activeLibs.includes(lib)) {
      button.classList.add('active');

    }

    // Toggle no clique
    button.addEventListener('click', () => {
      const index = activeLibs.indexOf(lib);

      if (index !== -1) {
        activeLibs.splice(index, 1); // remove
        button.classList.remove('active');
        let current = parseInt(localStorage.getItem('imgs')) || 0;
        localStorage.setItem('imgs', current - 1);
      } else {
        activeLibs.push(lib); // adiciona
        button.classList.add('active');
        let current = parseInt(localStorage.getItem('imgs')) || 0;
        localStorage.setItem('imgs', current + 1);
      }

      localStorage.setItem('libs_active', JSON.stringify(activeLibs));
    });
  });
