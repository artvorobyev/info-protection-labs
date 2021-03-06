const { RSAKey, linebrk } = require('./rsa');

var key = new RSAKey();

var message = 'Hello world';
console.log('Message:');
console.log(message);

// Generate a key
key.generate(1024, '10001');
console.log('Key:\n');
console.log('n:' + key.n.toString(16));
console.log('e:' + key.e.toString(16));
console.log('d:' + key.d.toString(16));
console.log('\n');

// Encrypt
var encrypted = key.encrypt(message);
console.log('Encrypted:\n' + linebrk(encrypted, 64) + '\n');

// Decrypt
var decrypted = key.decrypt(encrypted);
console.log('Decrypted:' + linebrk(decrypted, 64) + '\n');
