//файл index.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import ejs from "ejs";
import {
  encryptDecrypt,
  caesarCipher,
  handleKey,
  splitTextIntoBlocks,
  findMostFrequentLetters,
  decryptVigenere,
  findKeyLength,
  findKeyLengthFriedman,
} from "./functions.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/caesar", (req, res) => {
  res.render("caesar.ejs");
});

app.get("/findKey", (req, res) => {
  res.render("findKey.ejs");
});

app.get("/vigenere", (req, res) => {
  res.render("vigenere.ejs");
});

app.get("/sdes", (req, res) => {
  res.render("sdes.ejs");
});

// Обробник POST-запиту для шифрування тексту
app.post("/encrypt", (req, res) => {
  const inputText = req.body.text; // Отримуємо вхідний текст
  let key = parseInt(req.body.key, 10); // Отримуємо ключ і перетворюємо його в ціле число
  const language = req.body.language || "english"; // Отримуємо мову (за замовчуванням - англійська)
  const alphabet =
    language === "ukrainian"
      ? "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя"
      : "abcdefghijklmnopqrstuvwxyz"; // Вибираємо алфавіт відповідно до обраної мови
  const alphabetLength = alphabet.length; // Отримуємо довжину алфавіту

  key = handleKey(key, alphabetLength);

  // Шифруємо вхідний текст та повертаємо результат
  const encryptedText = caesarCipher(inputText, key, alphabet);
  res.json({ result: encryptedText });
});

// Обробник POST-запиту для дешифрування тексту
app.post("/decrypt", (req, res) => {
  const inputText = req.body.text; // Отримуємо вхідний текст
  let key = parseInt(req.body.key, 10); // Отримуємо ключ і перетворюємо його в ціле число
  const language = req.body.language || "english"; // Отримуємо мову (за замовчуванням - англійська)
  const alphabet =
    language === "ukrainian"
      ? "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя"
      : "abcdefghijklmnopqrstuvwxyz"; // Вибираємо алфавіт відповідно до обраної мови
  const alphabetLength = alphabet.length; // Отримуємо довжину алфавіту

  key = handleKey(key, alphabetLength);

  // Дешифруємо вхідний текст та повертаємо результат
  const decryptedText = caesarCipher(
    inputText,
    (alphabetLength - (Math.abs(key) % alphabetLength) + alphabetLength) %
      alphabetLength,
    alphabet
  );
  res.json({ result: decryptedText });
});

app.post("/findKey", (req, res) => {
  const encryptedText = req.body.encryptedText;
  const decryptedText = findKeyAndDecrypt(encryptedText);

  res.json({ result: decryptedText });
});

app.post("/decryptVigenere", (req, res) => {
  console.log(1);
  // Отримуємо шифртекст з тіла запиту, перетворюємо в нижній регістр і видаляємо пробіли
  const ciphertext = req.body.ciphertext.toLowerCase().replace(/ /g, "");
  // Визначаємо український алфавіт для роботи з текстом
  const ukralphabet = "_абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
  // Отримуємо метод для знаходження ключа
  const methodTFK = req.body.methodTFK;
  console.log(methodTFK);

  if (methodTFK === "knownKey") {
    // Якщо відомий ключ, виконуємо розшифрування з відомим ключем
    const key = req.body.knownKey;
    const plaintext = decryptVigenere(ciphertext, key, ukralphabet);
    const modifiedPlainText = plaintext.replace(/_/g, " ");
    res.json({ foundKey: key, plaintext: modifiedPlainText });
  } else if (methodTFK === "knownKeyLength") {
    // Якщо відома довжина ключа, виконуємо розшифрування з використанням методу найчастіше зустрічаючої літери
    const keyLength = parseInt(req.body.keyLength);
    const blocks = splitTextIntoBlocks(ciphertext, keyLength);
    const keyArray = findMostFrequentLetters(blocks, ukralphabet);
    const key = keyArray.join("");
    const plaintext = decryptVigenere(ciphertext, key, ukralphabet);
    const modifiedPlainText = plaintext.replace(/_/g, " ");
    res.json({ foundKey: key, plaintext: modifiedPlainText });
  } else if (methodTFK === "unknownKeyKasiski") {
    // Якщо невідомий ключ, але відома можлива довжина ключа, використовуємо метод Касіскі
    const keyLength = findKeyLength(ciphertext);
    console.log(typeof keyLength);
    const blocks = splitTextIntoBlocks(ciphertext, keyLength);
    const keyArray = findMostFrequentLetters(blocks, ukralphabet);
    const key = keyArray.join("");
    const plaintext = decryptVigenere(ciphertext, key, ukralphabet);
    const modifiedPlainText = plaintext.replace(/_/g, " ");
    res.json({ foundKey: key, plaintext: modifiedPlainText });
  } else if (methodTFK === "unknownKeyFriedman") {
    // Якщо невідомий ключ, але відома можлива довжина ключа, використовуємо метод Фрідмана
    const keyLength = Number(findKeyLengthFriedman(ciphertext));
    console.log(typeof keyLength);
    const blocks = splitTextIntoBlocks(ciphertext, keyLength);
    const keyArray = findMostFrequentLetters(blocks, ukralphabet);
    const key = keyArray.join("");
    console.log("key: " + key);
    const plaintext = decryptVigenere(ciphertext, key, ukralphabet);
    const modifiedPlainText = plaintext.replace(/_/g, " ");
    res.json({ foundKey: key, plaintext: modifiedPlainText });
  }
});

app.post("/encryptDecrypt", (req, res) => {
  const { message, key } = req.body;
  const {
    binaryKey,
    encryptedBinaryText,
    cipherText,
    decryptedBinaryText,
    decryptedText,
  } = encryptDecrypt(message, key);
  console.log(binaryKey);
  res.json({
    binaryKey: binaryKey,
    encryptedBinaryText: encryptedBinaryText,
    cipherText: cipherText,
    decryptedBinaryText: decryptedBinaryText,
    decryptedText: decryptedText,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// А, Б, В, Г, Ґ, Д, Е, Є, Ж, З, И, І, Ї, Й, К, Л, М, Н, О, П, Р, С, Т, У, Ф, Х, Ц, Ч, Ш, Щ, Ь, Ю, Я
