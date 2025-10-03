const screen1 = document.getElementById("screen1")
const logo1 = document.getElementById("logo1")
const btns1 = document.getElementById("btns1")
const look1 = document.getElementById("Look1")
const learn1 = document.getElementById("Learn1")
const tracin =  document.getElementById("tracin")
const primordial = document.getElementById("primordial")
const warn = document.getElementById("warn")

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
        console.log("checado, warn")
    } else {
        primordial.style.display = "flex"
        warn.style.display = "none"
        primordial.style.height = `${window.innerHeight}px`
        console.log("checado, primordial")
    }
}

window.addEventListener("load", checkRatio)
window.addEventListener("resize", checkRatio)
window.addEventListener('orientationchange', checkRatio)
*/
setTimeout(function() {
    logo1.style.width = '20%'
    btns1.style.marginTop = '100px'
    look1.style.fontSize = "3em"
    learn1.style.fontSize = "3em"
    tracin.style.height = "40px"
}, 5000)

look1.addEventListener("click", function() {
    let imgsValue = parseInt(localStorage.getItem('imgs'), 10)
    if (imgsValue === 0) {
        window.location.href = "./look/add/add.html"
    } else {
        window.location.href = "./look/use/use.html"
    }
})

console.log(localStorage)