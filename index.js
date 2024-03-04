//файл index.js
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import ejs from 'ejs';
import {caesarCipher, handleKey} from "./functions.js"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/caesar', (req, res) => {
  res.render('caesar.ejs');
});

app.get('/findKey', (req, res) => {
  res.render('findKey.ejs');
});

app.get('/vigenere', (req, res) => {
  res.render('vigenere.ejs');
});

// Обробник POST-запиту для шифрування тексту
app.post('/encrypt', (req, res) => {
  const inputText = req.body.text; // Отримуємо вхідний текст
  let key = parseInt(req.body.key, 10); // Отримуємо ключ і перетворюємо його в ціле число
  const language = req.body.language || 'english'; // Отримуємо мову (за замовчуванням - англійська)
  const alphabet = (language === 'ukrainian') ? 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя' : 'abcdefghijklmnopqrstuvwxyz'; // Вибираємо алфавіт відповідно до обраної мови
  const alphabetLength = alphabet.length; // Отримуємо довжину алфавіту
  
  key = handleKey(key, alphabetLength);

  // Шифруємо вхідний текст та повертаємо результат
  const encryptedText = caesarCipher(inputText, key, alphabet);
  res.json({ result: encryptedText });
});

// Обробник POST-запиту для дешифрування тексту
app.post('/decrypt', (req, res) => {
  const inputText = req.body.text; // Отримуємо вхідний текст
  let key = parseInt(req.body.key, 10); // Отримуємо ключ і перетворюємо його в ціле число
  const language = req.body.language || 'english'; // Отримуємо мову (за замовчуванням - англійська)
  const alphabet = (language === 'ukrainian') ? 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя' : 'abcdefghijklmnopqrstuvwxyz'; // Вибираємо алфавіт відповідно до обраної мови
  const alphabetLength = alphabet.length; // Отримуємо довжину алфавіту

  key = handleKey(key, alphabetLength); 

  // Дешифруємо вхідний текст та повертаємо результат
  const decryptedText = caesarCipher(inputText, (alphabetLength - (Math.abs(key) % alphabetLength) + alphabetLength) % alphabetLength, alphabet);
  res.json({ result: decryptedText });
});

app.post('/findKey', (req, res) => {
  const encryptedText = req.body.encryptedText;
  const decryptedText = findKeyAndDecrypt(encryptedText);

  res.json({ result: decryptedText });
});

app.post('/decryptVigenere', (req, res) => {
  console.log(req.body.ciphertext);
  const ciphertext = req.body.ciphertext.toLowerCase().replace(/ /g, '');
  const ukralphabet = "_абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
  const keyLength = parseInt(req.body.keyLength);

  // Initialize array to store potential key characters
  const keyArray = new Array(keyLength);

  // Split ciphertext into blocks
  const blocks = [];
  for (let i = 0; i < keyLength; i++) {
    let block = "";
    for (let j = i; j < ciphertext.length; j += keyLength) {
      block += ciphertext[j];
    }
    blocks.push(block);
  }

  // Find the most frequent letter in each block and add it to the key array
  for (let i = 0; i < keyLength; i++) {
    const block = blocks[i];
    const letterCount = new Array(ukralphabet.length).fill(0);

    // Count occurrences of each letter in the block
    for (let j = 0; j < block.length; j++) {
      const letter = block[j];
      const index = ukralphabet.indexOf(letter);
      if (index !== -1) {
        letterCount[index]++;
      }
    }

    // Find the most frequent letter
    let maxCount = 0;
    let mostFrequentLetter = null;
    for (let j = 0; j < ukralphabet.length; j++) {
      if (letterCount[j] > maxCount) {
        maxCount = letterCount[j];
        mostFrequentLetter = ukralphabet[j];
      }
    }

    // Add the most frequent letter to the key array
    keyArray[i] = mostFrequentLetter;
  }

  // Output key array as a string
  const key = keyArray.join("");

  // Decrypt Vigenere cipher
  function decryptVigenere(ciphertext, key) {
    let plaintext = "";
    for (let i = 0; i < ciphertext.length; i++) {
      const ciphertextChar = ciphertext[i];
      const keyChar = key[i % key.length];
      const ciphertextIndex = ukralphabet.indexOf(ciphertextChar);
      const keyIndex = ukralphabet.indexOf(keyChar);
      let plainCharIndex = (ciphertextIndex - keyIndex + ukralphabet.length) % ukralphabet.length;
      plaintext += ukralphabet[plainCharIndex];
    }
    return plaintext;
  }

  const plaintext = decryptVigenere(ciphertext, key);
  var modifiedPlainText = plaintext.replace(/_/g, " ");
  res.json({ key: key, plaintext: modifiedPlainText });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// А, Б, В, Г, Ґ, Д, Е, Є, Ж, З, И, І, Ї, Й, К, Л, М, Н, О, П, Р, С, Т, У, Ф, Х, Ц, Ч, Ш, Щ, Ь, Ю, Я