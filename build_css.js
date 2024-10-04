const fs = require('fs');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const inputFile = 'static/css/styles.css';
const outputFile = 'static/css/output.css';

fs.readFile(inputFile, (err, css) => {
  if (err) throw err;

  postcss([
    tailwindcss('./tailwind.config.js'),
    autoprefixer,
  ])
    .process(css, { from: inputFile, to: outputFile })
    .then(result => {
      fs.writeFile(outputFile, result.css, err => {
        if (err) throw err;
        console.log('CSS built successfully');
      });
    })
    .catch(error => {
      console.error('Error processing CSS:', error);
    });
});