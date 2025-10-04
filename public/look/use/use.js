const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ddd = document.getElementById('ddd')
const btnCarimbo = document.getElementById("btnGalaxy")
const btnEplanet = document.getElementById("btnEplanet")
const btnStar = document.getElementById("btnStar")
const btnNebula = document.getElementById("btnNebula")
const btnBhole = document.getElementById("btnBhole")
const btnReset = document.getElementById('reset');
const btnAnotar = document.getElementById('anotar');
const btnBorracha = document.getElementById('borracha');
const inputUpload = document.getElementById('upload');
const zoomSlider = document.getElementById('zoomRange');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomValue = document.getElementById('zoomValue');
const MIN_IMG_WIDTH = 1000;
const MIN_IMG_HEIGHT = 1000;

let stampTypeAtual = null;
let image = new Image();
let zoom = 1;
let zoomStep = 0.1;
let zoomMin = 1;
let zoomMax = 100;
let zoomCenter = null;
let scale = 1;
let imageId = "";
let mousePos = null;
let rotationAngle = 0;
let isDrawing = false;
let isErasing = false;
let drawing = false;
let currentLine = [];
let annotations = [];
let cropX = 0, cropY = 0, cropW = 0, cropH = 0;
let isStamping = false;
let carimbos = []; 
let ecarimbos = []
let scarimbos = []
let bcarimbos = []
let ncarimbos = []
let galaxyImg = new Image()
galaxyImg.src = '../../assets/galaxy.png'
let eplanetImg = new Image()
eplanetImg.src = '../../assets/eplanet.png'
let starImg = new Image()
starImg.src = '../../assets/star.png'
let bholeImg = new Image()
bholeImg.src = '../../assets/bhole.png'
let nebulaImg = new Image()
nebulaImg.src = '../../assets/nebula.png'
let isMeasuring = false;
let measureStart = null;
let measureEnd = null;
let measurePreviewEnd = null;
let isTyping = false;
let textos = [];

btnEplanet.addEventListener('click', () => {
  isStamping = !isStamping;
  isMeasuring = false
  isDrawing = false;
  isErasing = false;
  stampTypeAtual = isStamping ? "eplanet" : null;

  btnEplanet.style.width = isStamping ? '80px' : '70px';
  btnStar.style.width = '70px'
  btnBhole.style.width = '70px'
  btnNebula.style.width = '70px'
  btnCarimbo.style.width = '70px'
  btnAnotar.style.width = '70px';
  btnBorracha.style.width = '70px';
  btnMeasure.style.width = '70px'
});

btnStar.addEventListener('click', () => {
  isStamping = !isStamping;
  isMeasuring = false
  isDrawing = false;
  isErasing = false;
  stampTypeAtual = isStamping ? "star" : null;

  btnEplanet.style.width = '70px'
  btnStar.style.width = isStamping ? '80px' : '70px';
  btnBhole.style.width = '70px'
  btnNebula.style.width = '70px'
  btnCarimbo.style.width = '70px'
  btnAnotar.style.width = '70px';
  btnBorracha.style.width = '70px';
  btnMeasure.style.width = '70px'
});

btnNebula.addEventListener('click', () => {
  isStamping = !isStamping;
  isMeasuring = false
  isDrawing = false;
  isErasing = false;
  stampTypeAtual = isStamping ? "nebula" : null;

  btnEplanet.style.width = '70px'
  btnStar.style.width = '70px'
  btnBhole.style.width = '70px'
  btnNebula.style.width = isStamping ? '80px' : '70px';
  btnCarimbo.style.width = '70px'
  btnAnotar.style.width = '70px';
  btnBorracha.style.width = '70px';
  btnMeasure.style.width = '70px'
});

btnBhole.addEventListener('click', () => {
  isStamping = !isStamping;
  isMeasuring = false
  isDrawing = false;
  isErasing = false;
  stampTypeAtual = isStamping ? "bhole" : null;

  btnBhole.style.width = isStamping ? '80px' : '70px';
  btnAnotar.style.width = '70px';
  btnBorracha.style.width = '70px';
  btnEplanet.style.width = '70px'
  btnStar.style.width = '70px'
  btnNebula.style.width = '70px'
  btnCarimbo.style.width = '70px'
  btnAnotar.style.width = '70px';
  btnBorracha.style.width = '70px';
  btnMeasure.style.width = '70px'
});

btnCarimbo.addEventListener('click', () => {
  isStamping = !isStamping;
  isMeasuring = false
  isDrawing = false;
  isErasing = false;
  stampTypeAtual = isStamping ? "galaxy" : null;

  btnCarimbo.style.width = isStamping ? '80px' : '70px';
  btnEplanet.style.width = '70px'
  btnStar.style.width = '70px'
  btnBhole.style.width = '70px'
  btnNebula.style.width = '70px'
  btnAnotar.style.width = '70px';
  btnBorracha.style.width = '70px';
  btnMeasure.style.width = '70px'
});

btnAnotar.addEventListener('click', () => {
  if (isDrawing) {
    isDrawing = false;
    btnAnotar.style.width = '70px';
  } else {
    isDrawing = true;
    isErasing = false;
    isMeasuring = false
    btnAnotar.style.width = '80px'
    btnBorracha.style.width = '70px';
  }
  canvas.style.cursor = isDrawing ? 'pointer' : 'crosshair';
});

btnBorracha.addEventListener('click', () => {
  if (isErasing) {
    isErasing = false;
    btnBorracha.style.width = '70px';
  } else {
    isErasing = true;
    isDrawing = false;
    isMeasuring = false
    btnBorracha.style.width = '80px';
    btnAnotar.style.width = '70px';
  }
});

btnReset.addEventListener('click', () => {
  zoom = 1;
  zoomCenter = null;
  zoomSlider.value = 0
  draw();
});

inputUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    image.onload = () => {
      console.log("Imagem carregada:", image.width, "x", image.height);

      if (image.width < MIN_IMG_WIDTH || image.height < MIN_IMG_HEIGHT) {
        console.log("⚠️ Imagem muito pequena. Mostrando aviso...");

        canvas.width = 600;
        canvas.height = 200;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Imagem muito pequena.", canvas.width / 2, 80);
        ctx.fillText("Envie outra imagem.", canvas.width / 2, 120);

        return;
      }

      const imgW = image.width;
      const imgH = image.height;
      const maxW = window.innerWidth * 0.9;
      const maxH = window.innerHeight * 0.7;

      imageId = file.name;
      zoom = 1;
      zoomCenter = null;
      scale = Math.min(maxW / imgW, maxH / imgH, 1);
      canvas.width = imgW * scale;
      canvas.height = imgH * scale;

      localStorage.setItem("uploadedImage", event.target.result);
      loadAnnotations();
      draw();
    };

    image.src = event.target.result;
  };

  reader.readAsDataURL(file);
  document.getElementById("header").style.height = "15%"
  document.getElementById("header").style.transition = "1s"
  setTimeout(() => {
    canvas.style.border = "2px solid #ffffff"
    canvas.style.display = "block"
    document.getElementById("butns").style.display = 'flex'
    document.getElementById("control").style.display = "flex"
  }, 1000);
});

canvas.addEventListener('mouseleave', () => {
  mousePos = null;
  draw();
});

canvas.addEventListener('mousedown', (e) => {
  if (isDrawing) {
    drawing = true;
    const { x, y } = getImageCoordinates(e);
    currentLine = [{ x, y }];
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!image.src) return;

  mousePos = getImageCoordinates(e);

  if (isDrawing && drawing) {
    const { x, y } = mousePos;
    currentLine.push({ x, y });
    draw();
    return;
  }

  if (isErasing) {
    const { x, y } = mousePos;
    eraseAt(x, y);
    draw();
    return;
  }

  if (isMeasuring && measureStart && !measureEnd) {
  measurePreviewEnd = getImageCoordinates(e);
}

  if (isStamping || isTyping) {
    return;
  }
});

canvas.addEventListener('mouseup', () => {
  if (isDrawing && currentLine.length > 0) {
    annotations.push(currentLine);
    currentLine = [];
    saveAnnotations();
    draw();
  }
  drawing = false;
});

canvas.addEventListener('click', (e) => {
  if (!image.src || isDrawing || isErasing) return;

  const { x, y } = getImageCoordinates(e);

  if (isStamping) {
    switch (stampTypeAtual) {
      case "galaxy":
        carimbos.push({ x, y });
        saveCarimbos();
        break;
      case "eplanet":
        ecarimbos.push({ x, y });
        saveECarimbos();
        break;
      case "star":
        scarimbos.push({ x, y });
        saveSCarimbos();
        break;
      case "nebula":
        ncarimbos.push({ x, y });
        saveNCarimbos();
        break;
      case "bhole":
        bcarimbos.push({ x, y });
        saveBCarimbos();
        break;
    }

    draw();
  } else if (isTyping) {
  const rect = canvas.getBoundingClientRect();
  const dx = ((x - cropX) / cropW) * canvas.width;
  const dy = ((y - cropY) / cropH) * canvas.height;

  const input = document.getElementById("textInput");

  input.style.left = `${rect.left + dx}px`;
  input.style.top = `${rect.top + dy}px`;
  input.style.display = "block";
  input.value = "";
  input.focus();

  input.onkeydown = function (ev) {
    if (ev.key === "Enter") {
      const conteudo = input.value.trim();
      if (conteudo) {
        textos.push({ x, y, conteudo });
        saveTextos();
        draw();
      }
      input.style.display = "none";
    } else if (ev.key === "Escape") {
      input.style.display = "none";
    }
  };
} else if (isMeasuring) {
  if (!measureStart) {
    measureStart = { x, y };
    measureEnd = null;
    measurePreviewEnd = null;
    draw()
  } else if (!measureEnd) {
    measureEnd = { x, y };
    measurePreviewEnd = null; 
    draw()
  } else {
    measureStart = { x, y };
    measureEnd = null;
    measurePreviewEnd = null;
    draw()
  }
} else {
  zoomCenter = { x, y };
    draw();
}
});

zoomInBtn.addEventListener('click', () => {
  zoom = Math.min(zoom + 0.1, parseFloat(zoomSlider.max));
  zoomSlider.value = zoom;
  draw();
});

zoomOutBtn.addEventListener('click', () => {
  zoom = Math.max(zoom - 0.1, parseFloat(zoomSlider.min));
  zoomSlider.value = zoom;
  draw();
});

zoomSlider.addEventListener('input', () => {
  const t = parseFloat(zoomSlider.value); 
  const normalized = t / 100; 

  const curved = Math.pow(normalized, 2); 
  zoom = zoomMin + (zoomMax - zoomMin) * curved;

  draw();
});

function getImageCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const nx = mouseX / rect.width;
  const ny = mouseY / rect.height;

  const imgX = cropX + nx * cropW;
  const imgY = cropY + ny * cropH;

  return { x: imgX, y: imgY };
}

function eraseAt(x, y) {
  const radius = 10 / zoom;
  annotations = annotations.filter(line => {
    return !line.some(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx * dx + dy * dy) < radius;
    });
  });
  saveAnnotations();
}

function saveAnnotations() {
  localStorage.setItem("annotations_" + imageId, JSON.stringify(annotations));
}

function loadAnnotations() {
  const data = localStorage.getItem("annotations_" + imageId);
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.every(line => Array.isArray(line))) {
      annotations = parsed;
    } else {
      annotations = [];
    }
  } catch (e) {
    annotations = [];
  }
}

function saveCarimbos() {
  localStorage.setItem("carimbos_" + imageId, JSON.stringify(carimbos));
}

function loadCarimbos() {
  const data = localStorage.getItem("carimbos_" + imageId);
  try {
    carimbos = JSON.parse(data) || [];
  } catch {
    carimbos = [];
  }
}

function saveECarimbos() {
  localStorage.setItem("ecarimbos_" + imageId, JSON.stringify(ecarimbos));
}

function loadECarimbos() {
  const data = localStorage.getItem("ecarimbos_" + imageId);
  try {
    ecarimbos = JSON.parse(data) || [];
  } catch {
    ecarimbos = [];
  }
}

function saveSCarimbos() {
  localStorage.setItem("scarimbos_" + imageId, JSON.stringify(scarimbos));
}

function loadSCarimbos() {
  const data = localStorage.getItem("scarimbos_" + imageId);
  try {
    scarimbos = JSON.parse(data) || [];
  } catch {
    scarimbos = [];
  }
}

function saveNCarimbos() {
  localStorage.setItem("ncarimbos_" + imageId, JSON.stringify(ncarimbos));
}

function loadNCarimbos() {
  const data = localStorage.getItem("ncarimbos_" + imageId);
  try {
    ncarimbos = JSON.parse(data) || [];
  } catch {
    ncarimbos = [];
  }
}

function saveBCarimbos() {
  localStorage.setItem("bcarimbos_" + imageId, JSON.stringify(bcarimbos));
}

function loadBCarimbos() {
  const data = localStorage.getItem("bcarimbos_" + imageId);
  try {
    bcarimbos = JSON.parse(data) || [];
  } catch {
    bcarimbos = [];
  }
}

function draw(previewEnd = null) {
  if (!image) return;

  const iw = image.width;
  const ih = image.height;
  const cw = canvas.width;
  const ch = canvas.height;

  cropW = iw / zoom;
  cropH = ih / zoom;

  if (zoomCenter) {
    cropX = zoomCenter.x - cropW / 2;
    cropY = zoomCenter.y - cropH / 2;

    cropX = Math.max(0, Math.min(cropX, iw - cropW));
    cropY = Math.max(0, Math.min(cropY, ih - cropH));
  } else {
    cropX = 0;
    cropY = 0;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, cw, ch);

  ctx.strokeStyle = '#ffffffff';
  ctx.lineWidth = 2;

  annotations.forEach(line => {
    ctx.beginPath();
    line.forEach((p, i) => {
      const dx = ((p.x - cropX) / cropW) * canvas.width;
      const dy = ((p.y - cropY) / cropH) * canvas.height;
      if (i === 0) ctx.moveTo(dx, dy);
      else ctx.lineTo(dx, dy);
    });
    ctx.stroke();
  });

  if (isDrawing && currentLine.length > 0) {
    ctx.beginPath();
    currentLine.forEach((p, i) => {
      const dx = ((p.x - cropX) / cropW) * canvas.width;
      const dy = ((p.y - cropY) / cropH) * canvas.height;
      if (i === 0) ctx.moveTo(dx, dy);
      else ctx.lineTo(dx, dy);
    });
    ctx.stroke();
  }

  if (zoomCenter && !isDrawing && !isErasing && !isMeasuring && !isStamping) {

  const dx = ((zoomCenter.x - cropX) / cropW) * canvas.width;
  const dy = ((zoomCenter.y - cropY) / cropH) * canvas.height;

  ctx.save();

  ctx.fillStyle = "white"; // cor do texto
    ctx.font = "14px Iceland"; // fonte e tamanho
    ctx.textAlign = "left"; // alinhamento à esquerda
    ctx.textBaseline = "top"; // alinhamento ao topo
    ctx.fillText(`x: ${zoomCenter.x.toFixed(1)}, y: ${zoomCenter.y.toFixed(1)}`, 10, 10);

  ctx.translate(dx, dy);
  ctx.rotate(rotationAngle);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-6, -6);
  ctx.lineTo(6, 6);
  ctx.moveTo(-6, 6);
  ctx.lineTo(6, -6);
  ctx.stroke();

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, -6);
  ctx.lineTo(6, 6);
  ctx.moveTo(-6, 6);
  ctx.lineTo(6, -6);
  ctx.stroke();

  ctx.restore();
}

  if (isErasing && mousePos) {
  const dx = ((mousePos.x - cropX) / cropW) * canvas.width;
  const dy = ((mousePos.y - cropY) / cropH) * canvas.height;
  const radius = 10;

  ctx.beginPath();
  ctx.arc(dx, dy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.stroke();
}

carimbos.forEach(c => {
  const dx = ((c.x - cropX) / cropW) * canvas.width;
  const dy = ((c.y - cropY) / cropH) * canvas.height;

  ctx.save();
  ctx.translate(dx - 10, dy - 10);

  ctx.filter = "invert(23%) sepia(52%) saturate(2916%) hue-rotate(254deg) brightness(83%) contrast(109%)";
  ctx.drawImage(galaxyImg, 0, 0, 20, 20);
  ctx.filter = "none";

  ctx.restore();
});

ecarimbos.forEach(c => {
  const dx = ((c.x - cropX) / cropW) * canvas.width;
  const dy = ((c.y - cropY) / cropH) * canvas.height;

  ctx.save();
  ctx.translate(dx - 10, dy - 10);

  ctx.filter = "invert(35%) sepia(32%) saturate(632%) hue-rotate(346deg) brightness(98%) contrast(90%)";
  ctx.drawImage(eplanetImg, 0, 0, 20, 20);
  ctx.filter = "none";

  ctx.restore();
});

scarimbos.forEach(c => {
  const dx = ((c.x - cropX) / cropW) * canvas.width;
  const dy = ((c.y - cropY) / cropH) * canvas.height;

  ctx.save();
  ctx.translate(dx - 10, dy - 10);

  ctx.filter = "invert(85%) sepia(5%) saturate(3596%) hue-rotate(350deg) brightness(106%) contrast(88%)";
  ctx.drawImage(starImg, 0, 0, 20, 20);
  ctx.filter = "none";

  ctx.restore();
});

ncarimbos.forEach(c => {
  const dx = ((c.x - cropX) / cropW) * canvas.width;
  const dy = ((c.y - cropY) / cropH) * canvas.height;

  ctx.save();
  ctx.translate(dx - 10, dy - 10);

  ctx.drawImage(nebulaImg, 0, 0, 20, 20);

  ctx.restore();
});

bcarimbos.forEach(c => {
  const dx = ((c.x - cropX) / cropW) * canvas.width;
  const dy = ((c.y - cropY) / cropH) * canvas.height;

  ctx.save();
  ctx.translate(dx - 10, dy - 10);

  ctx.filter = "invert(52%) sepia(30%) saturate(1095%) hue-rotate(336deg) brightness(92%) contrast(103%)";
  ctx.drawImage(bholeImg, 0, 0, 20, 20);
  ctx.filter = "none";

  ctx.restore();
});

if (isMeasuring && measureStart && (measureEnd || measurePreviewEnd)) {
  const end = measureEnd || measurePreviewEnd;

    const x1 = ((measureStart.x - cropX) / cropW) * canvas.width;
    const y1 = ((measureStart.y - cropY) / cropH) * canvas.height;
    const x2 = ((end.x - cropX) / cropW) * canvas.width;
    const y2 = ((end.y - cropY) / cropH) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#d42f2f";
    ctx.lineWidth = 2;
    ctx.stroke();

    const dx = end.x - measureStart.x;
    const dy = end.y - measureStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy).toFixed(1); 

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.fillStyle = "white";
    ctx.font = "14px Iceland";
    ctx.fillText(`${dist}px`, midX + 5, midY - 5);
  }

  textos.forEach(t => {
  const dx = ((t.x - cropX) / cropW) * canvas.width;
  const dy = ((t.y - cropY) / cropH) * canvas.height;

  ctx.fillStyle = "white";
  ctx.font = "16px Iceland";
  ctx.fillText(t.conteudo, dx, dy);
});


} // fim do draw

function animate() {
  rotationAngle += 0.05; 
  draw();
  requestAnimationFrame(animate);
}

animate();

zoomSlider.addEventListener("input", function () {
  const val = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = `linear-gradient(to right, #d42f2f ${val}%, #361616 ${val}%)`;
});

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

const guia = document.getElementById("popbtns");

let offsetX, offsetY, isDragging = false;

guia.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - guia.offsetLeft;
  offsetY = e.clientY - guia.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    guia.style.left = `${e.clientX - offsetX}px`;
    guia.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

ddd.addEventListener("click", () => {
  if (guia.style.display === "none") {
    guia.style.display = "flex"
  } else {
    guia.style.display = "none"
  }
})

const btnMeasure = document.getElementById("regua");

btnMeasure.addEventListener("click", () => {
  isMeasuring = !isMeasuring;
  isDrawing = false;
  isErasing = false;
  isStamping = false;
  btnMeasure.style.width = isMeasuring ? '80px' : '70px';
});

const btnTexto = document.getElementById("text");

btnTexto.addEventListener("click", () => {
  isTyping = !isTyping;
  isDrawing = false;
  isErasing = false;
  isStamping = false;
  isMeasuring = false;

  btnTexto.style.width = isTyping ? '80px' : '70px';
});

function saveTextos() {
  localStorage.setItem("textos_" + imageId, JSON.stringify(textos));
}

function loadTextos() {
  const data = localStorage.getItem("textos_" + imageId);
  try {
    textos = JSON.parse(data) || [];
  } catch {
    textos = [];
  }
}

const btnExport = document.getElementById("btnExport");

btnExport.addEventListener("click", () => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = image.width; 
  exportCanvas.height = image.height;
  const exportCtx = exportCanvas.getContext("2d");

  exportCtx.drawImage(image, 0, 0);

  carimbos.forEach(c => exportCtx.drawImage(galaxyImg, c.x - 10, c.y - 10, 20, 20));
  ecarimbos.forEach(c => exportCtx.drawImage(eplanetImg, c.x - 10, c.y - 10, 20, 20));
  scarimbos.forEach(c => exportCtx.drawImage(starImg, c.x - 10, c.y - 10, 20, 20));
  ncarimbos.forEach(c => exportCtx.drawImage(nebulaImg, c.x - 10, c.y - 10, 20, 20));
  bcarimbos.forEach(c => exportCtx.drawImage(bholeImg, c.x - 10, c.y - 10, 20, 20));
  textos.forEach(t => {
    exportCtx.fillStyle = "white";
    exportCtx.font = "20px sans-serif";
    exportCtx.fillText(t.conteudo, t.x, t.y);
  });

  const dataURL = exportCanvas.toDataURL("image/png"); 
  const link = document.createElement("a");
  link.download = "imagem-editada.png";
  link.href = dataURL;
  link.click();
});

document.getElementById("btnTarget").addEventListener("click", () => {
  const popT = document.getElementById("poptarget")
  if (popT.style.display === "flex") {
    popT.style.display = "none"
  } else {
    popT.style.display = "flex"
  }
})