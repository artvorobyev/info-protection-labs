// const prompt = require('prompt-sync')();
const {
  BinarySearchTree,
  BinarySearchTreeNode,
} = require('@datastructures-js/binary-search-tree');

const word = 'beep boop beer!';
const wordArray = word.split(/(.{1})/).filter((i) => !!i);
let array = wordArray
  .reduce((acc, curr) => {
    if (!acc.find((i) => i.letter === curr)) {
      return [
        ...acc,
        {
          letter: curr,
          freequency: wordArray.filter((i) => i === curr).length,
        },
      ];
    }

    return acc;
  }, [])
  .sort((a, b) => {
    return a.freequency - b.freequency;
  });

console.log(array);

while (array.length !== 1) {
  const first = array.shift();
  const second = array.shift();

  const bst = new BinarySearchTree();
  const root = bst.insert('root');
  const leftNode =
    typeof first.letter === 'string'
      ? new BinarySearchTreeNode(first.letter)
      : first.letter.root();
  const rightNode =
    typeof second.letter === 'string'
      ? new BinarySearchTreeNode(second.letter)
      : second.letter.root();

  root.setRight(rightNode);
  root.setLeft(leftNode);

  leftNode.setParent(root);
  rightNode.setParent(root);

  const item = {
    letter: bst,
    freequency: first.freequency + second.freequency,
  };
  array.unshift(item);
  array.sort((a, b) => a.freequency - b.freequency);
}

const tree = array[0].letter;

function traverse(node, prefix = '') {
  let response = {};
  if (node.isLeaf()) {
    response[node.getKey()] = prefix;
  } else {
    response = {
      ...response,
      ...traverse(node.getLeft(), `${prefix}0`),
      ...traverse(node.getRight(), `${prefix}1`),
    };
  }
  return response;
}

const codes = traverse(tree.root());

console.log(codes);

console.log('\nЗАПАКОВКА:');

console.log(word);

const result = wordArray.map((letter) => codes[letter]).join('');

console.log(result);

console.log('\nРАСПАКОВКА:');
console.log(result);

let compareLength = 1;
let unpack = '';
let resultCopy = result;

while (resultCopy.length) {
  const buffer = resultCopy.substring(0, compareLength);
  const letter = Object.keys(codes).find((key) => codes[key] === buffer);

  if (letter) {
    unpack = `${unpack}${letter}`;
    resultCopy = resultCopy.substring(compareLength, resultCopy.length);
    compareLength = 1;
  } else {
    compareLength++;
  }
}

console.log(unpack);
