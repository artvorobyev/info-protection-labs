const fs = require('fs');
const PNG = require('pngjs').PNG;
const prompt = require('prompt-sync')();
const { utf8ToBin, binToUtf8 } = require('./helpers');

const FILENAME = 'pug.png';

console.log('Введите длину сообщения:');
var length = parseInt(prompt());

const stream = fs.createReadStream(`./results/${FILENAME}`);
var png = new PNG({
  filterType: 4,
});
stream.pipe(png);

var end = new Promise(function (resolve, reject) {
  png.on('parsed', function () {
    var counter = 0;
    var result = '';

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        if (counter < length) {
          var idx = (this.width * y + x) << 2;
          var pixelString = utf8ToBin(`${this.data[idx]}`);
          var temp = `${pixelString.slice(
            pixelString.length - 1,
            pixelString.length
          )}`;
          result += temp;
        }

        counter++;
      }
    }

    resolve(result);
  });
  stream.on('error', reject);
});

(async function () {
  const result = await end;
  console.log('Результат:');
  console.log(result);
  console.log(binToUtf8(result));
})();
