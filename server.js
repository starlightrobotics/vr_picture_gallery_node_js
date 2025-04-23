// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const imageSizeModule = require('image-size');
const sizeOf = imageSizeModule.default || imageSizeModule;  // ← fallback for both CJS & ESM installs


const app = express();

const IMAGES_FOLDER = path.join(__dirname, 'images');
const PUBLIC_FOLDER = path.join(__dirname, 'public');

// Serve static files from /public and /images
app.use(express.static(PUBLIC_FOLDER));
app.use('/images', express.static(IMAGES_FOLDER));
app.get('/gallery-data', (req, res) => {
    fs.readdir(IMAGES_FOLDER, (err, files) => {
      if (err) return res.status(500).send('Error reading folder');
  
      const images = files
        .filter(f => /\.(jpe?g|png|gif)$/i.test(f))
        .map(file => {
          const fullPath = path.join(IMAGES_FOLDER, file);
          const buffer   = fs.readFileSync(fullPath);      // ← get a Buffer
          const dims     = sizeOf(buffer);                  // ← pass Buffer in
          return {
            filename: file,
            aspectRatio: (dims.width / dims.height).toFixed(2),
          };
        });
  
      res.json(images);
    });
  });
  

// Optional: serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_FOLDER, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
