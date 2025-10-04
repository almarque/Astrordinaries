const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const titulo = document.getElementById('titulo');
const explicacao = document.getElementById('explicacao');
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

btnAnotar.addEventListener('click', () => {
  if (isDrawing) {
    isDrawing = false;
    btnAnotar.style.width = '70px';
  } else {
    isDrawing = true;
    isErasing = false;
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
  }, 1000);
});

function loadApodImage() {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.media_type !== 'image') {
        titulo.textContent = "Hoje não há imagem (é um vídeo).";
        return;
      }

      image.crossOrigin = "anonymous";
      image.onload = () => {
        imageId = (data.hdurl || data.url).split('?')[0];
        zoom = 1;
        zoomCenter = null;
        loadAnnotations();

        const imgW = image.width;
        const imgH = image.height;
        const maxW = window.innerWidth * 0.9;
        const maxH = window.innerHeight * 0.7;

        scale = Math.min(maxW / imgW, maxH / imgH, 1);
        canvas.width = imgW * scale;
        canvas.height = imgH * scale;

        draw();
      };

      const url = data.hdurl || data.url;
      image.src = "https://corsproxy.io/?" + encodeURIComponent(url);

      titulo.textContent = data.title;
      explicacao.textContent = data.explanation;
    })
    .catch(err => {
      titulo.textContent = "Erro ao carregar imagem do dia.";
      console.error(err);
    });
}

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
  mousePos = getImageCoordinates(e);

  if (isDrawing && drawing) {
    const { x, y } = mousePos;
    currentLine.push({ x, y });
    draw();
  } else if (isErasing) {
    const { x, y } = mousePos;
    eraseAt(x, y);
    draw();
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
  zoomCenter = { x, y };
  draw();
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
  zoom = parseFloat(zoomSlider.value);
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

function draw() {
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

  if (zoomCenter && !isDrawing && !isErasing) {
  const dx = ((zoomCenter.x - cropX) / cropW) * canvas.width;
  const dy = ((zoomCenter.y - cropY) / cropH) * canvas.height;

  ctx.save();
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
}

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
