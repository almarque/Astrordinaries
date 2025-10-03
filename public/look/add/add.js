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
const input = document.getElementById("upload");

if (localStorage.getItem('imgs') === null) {
    localStorage.setItem('imgs', 0)
}
/*
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
*/
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

  input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      // Redimensionar para largura máxima de 1000px
      const maxWidth = 1000;
      const scale = Math.min(maxWidth / img.width, 1);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.85); // qualidade 85%

      // Salvar no localStorage
      try {
        localStorage.setItem("uploadedImage", resizedBase64);
        window.location.href = "../use/use.html";
      } catch (err) {
        alert("Imagem muito grande. Tente uma menor.");
      }
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});