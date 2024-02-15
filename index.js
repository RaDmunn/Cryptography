//файл index.js

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import ejs from 'ejs';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.set('view engine', 'ejs')
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/findKey', (req, res) => {
  res.render('findKey.ejs');
});

function caesarCipher(text, shift, alphabet) {  
  return text.split('').map(char => {
    // Перевіряємо, чи символ є буквою алфавіту (латиниця чи кирилиця)
    if (/[a-zA-Zа-яА-ЯіІїЇґҐєЄ]/.test(char)) {
      const isUpperCase = char.toUpperCase() === char; // Визначаємо, чи символ є у верхньому регістрі
      const index = alphabet.indexOf(char.toLowerCase()); // Знаходимо індекс символу у алфавіті (у нижньому регістрі)

      if (index !== -1) { // Якщо символ знаходиться в алфавіті
        let newIndex = (index + shift) % alphabet.length; // Знаходимо новий індекс з урахуванням зсуву
        if (newIndex < 0) {
          newIndex += alphabet.length; // Обробка випадку від'ємного зсуву
        }
        const newChar = alphabet[newIndex]; // Отримуємо новий символ
        return isUpperCase ? newChar.toUpperCase() : newChar; // Зберігаємо відповідний регістр нового символу
      } else {
        return char; // Якщо символ не знайдено в алфавіті, повертаємо без змін
      }
    } else {
      return char; // Повертаємо символ без змін, якщо він не є буквою
    }
  }).join('');
}

// Обробник POST-запиту для шифрування тексту
app.post('/encrypt', (req, res) => {
  const inputText = req.body.text; // Отримуємо вхідний текст
  let key = parseInt(req.body.key, 10); // Отримуємо ключ і перетворюємо його в ціле число
  const language = req.body.language || 'english'; // Отримуємо мову (за замовчуванням - англійська)
  const alphabet = (language === 'ukrainian') ? 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя' : 'abcdefghijklmnopqrstuvwxyz'; // Вибираємо алфавіт відповідно до обраної мови
  const alphabetLength = alphabet.length; // Отримуємо довжину алфавіту
  
  // Обробка випадку, коли ключ виходить за межі допустимих значень
  if (key < -alphabetLength || key > alphabetLength) {
    key = key % alphabetLength;
  }
  if (key < 0) {
    key = key + alphabetLength;
  }

  // Обробка випадку, коли ключ дорівнює нулю
  if (key === 0) {
    key = 1;
  }
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

  // Обробка випадку, коли ключ виходить за межі допустимих значень
  if (key < -alphabetLength || key > alphabetLength) {
    key = key % alphabetLength;
  }
  if (key < 0) {
    key = key + alphabetLength;
  }

  // Обробка випадку, коли ключ дорівнює нулю
  if (key === 0) {
    key = 1;
  } 

  // Дешифруємо вхідний текст та повертаємо результат
  const decryptedText = caesarCipher(inputText, (alphabetLength - (Math.abs(key) % alphabetLength) + alphabetLength) % alphabetLength, alphabet);
  res.json({ result: decryptedText });
});

app.post('/findKey', (req, res) => {
  const encryptedText = req.body.encryptedText;
  const decryptedText = findKeyAndDecrypt(encryptedText);

  res.json({ result: decryptedText });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// А, Б, В, Г, Ґ, Д, Е, Є, Ж, З, И, І, Ї, Й, К, Л, М, Н, О, П, Р, С, Т, У, Ф, Х, Ц, Ч, Ш, Щ, Ь, Ю, Я