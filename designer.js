// Initialize Fabric.js canvas
const assets = new fabric.Canvas('tshirtCanvas', { preserveObjectStacking: true });

let currentView = 'front';
let uploadedImage = null;

// Assuming you already have this:
const canvas = new fabric.Canvas('tshirtCanvas');

// --- Responsive Canvas Scaling ---
function resizeCanvas() {
  const canvasContainer = document.getElementById('tshirtCanvas').parentElement;
  const parentWidth = canvasContainer.offsetWidth;
  
  canvas.setWidth(parentWidth * 0.9);       // 90% of container width
  canvas.setHeight(parentWidth * 0.9 * 1.25); // maintain aspect ratio
  canvas.renderAll();
}

// Run initially and whenever the window resizes
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


// T-shirt mockup images (add real images to assets/)
const tshirtImages = {
  front: 'assets/tshirt-front.png',
  back: 'assets/tshirt-back.png'
};

// Load initial T-shirt background
fabric.Image.fromURL(tshirtImages.front, function(img) {
  img.scaleToWidth(canvas.width);
  img.selectable = false;
  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
});

// Upload design
document.getElementById('uploadImg').addEventListener('change', function(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    fabric.Image.fromURL(event.target.result, function(img) {
      img.set({
        left: canvas.width/2,
        top: canvas.height/2,
        originX: 'center',
        originY: 'center',
        cornerStyle: 'circle',
        transparentCorners: false
      });
      img.scaleToWidth(200);
      canvas.add(img);
      canvas.setActiveObject(img);
      uploadedImage = img;
    });
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Remove uploaded image
document.getElementById('removeDesign').addEventListener('click', function() {
  if(uploadedImage) {
    canvas.remove(uploadedImage);
    uploadedImage = null;
  }
});


// Add text
function addText() {
  const textInput = document.getElementById('textInput').value;
  if(!textInput.trim()) return;
  const fontSize = parseInt(document.getElementById('fontSize').value);
  const fontColor = document.getElementById('fontColor').value;

  const text = new fabric.Text(textInput, {
    left: canvas.width/2,
    top: canvas.height/2,
    fill: fontColor,
    fontSize: fontSize,
    originX: 'center',
    originY: 'center',
    cornerStyle: 'circle',
    transparentCorners: false
  });
  canvas.add(text);
  canvas.setActiveObject(text);
}

// Toggle front/back view
function toggleView() {
  currentView = currentView === 'front' ? 'back' : 'front';
  const imgURL = tshirtImages[currentView];
  fabric.Image.fromURL(imgURL, function(img) {
    img.scaleToWidth(canvas.width);
    img.selectable = false;
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  });
  document.getElementById('viewLabel').innerText = currentView === 'front' ? 'Front View' : 'Back View';
}

// Download mockup
function downloadMockup() {
  const link = document.createElement('a');
  link.download = 'tshirt-mockup.png';
  link.href = canvas.toDataURL({ format: 'png', quality: 0.9 });
  link.click();
}

// Enable object manipulation
canvas.on('object:selected', e => { e.target.hasControls = true; });

// Delete selected object with Delete key
document.addEventListener('keydown', e => {
  if(e.key === 'Delete' || e.key === 'Backspace') {
    const active = canvas.getActiveObject();
    if(active) canvas.remove(active);
  }
});
