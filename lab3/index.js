const fs = require('fs');
const PNG = require('pngjs').PNG;
const prompt = require('prompt-sync')();
const { utf8ToBin, binToUtf8 } = require('./helpers');

const FILENAME = 'pug.png';

console.log('Введите сообщение:');
var word = utf8ToBin(prompt());

console.log(`Длина сообщения: ${word.length}`);
console.log(word);

fs.createReadStream(`./images/${FILENAME}`)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on('parsed', function () {
    var counter = 0;
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        if (counter < word.length) {
          var idx = (this.width * y + x) << 2;
          var pixelString = utf8ToBin(`${this.data[idx]}`);
          var temp = `${pixelString.slice(0, pixelString.length - 1)}${
            word[counter]
          }`;
          this.data[idx] = parseInt(binToUtf8(`${temp}`));
        }
        counter++;
      }
    }

    this.pack().pipe(fs.createWriteStream(`./results/${FILENAME}`));
  });
