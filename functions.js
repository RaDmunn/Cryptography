export function handleKey(processedKey, alphabetLength) {
  // Обробка випадку, коли ключ виходить за межі допустимих значень
  if (processedKey < -alphabetLength || processedKey > alphabetLength) {
    key = key % alphabetLength;
  }
  if (processedKey < 0) {
    processedKey = processedKey + alphabetLength;
  }

  // Обробка випадку, коли ключ дорівнює нулю
  if (processedKey === 0) {
    processedKey = 1;
  }

  return processedKey;
}

export function caesarCipher(text, shift, alphabet) {
  return text
    .split("")
    .map((char) => {
      // Перевіряємо, чи символ є буквою алфавіту (латиниця чи кирилиця)
      if (/[a-zA-Zа-яА-ЯіІїЇґҐєЄ]/.test(char)) {
        const isUpperCase = char.toUpperCase() === char; // Визначаємо, чи символ є у верхньому регістрі
        const index = alphabet.indexOf(char.toLowerCase()); // Знаходимо індекс символу у алфавіті (у нижньому регістрі)

        if (index !== -1) {
          // Якщо символ знаходиться в алфавіті
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
    })
    .join("");
}

// Функція для розділення зашифрованого тексту на блоки
export function splitTextIntoBlocks(ciphertext, keyLength) {
  const blocks = [];
  // Проходимося по всім символам ключа
  for (let i = 0; i < keyLength; i++) {
    let block = "";
    // Для кожного символа ключа отримуємо символи з відповідних позицій у шифртексті
    for (let j = i; j < ciphertext.length; j += keyLength) {
      block += ciphertext[j];
    }
    // Додаємо сформований блок до масиву блоків
    blocks.push(block);
  }
  return blocks;
}

// Функція для знаходження найчастіше зустрічаючої літери в кожному блоку
export function findMostFrequentLetters(blocks, ukralphabet) {
  const keyArray = new Array(blocks.length);
  // Проходимося по всім блокам
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const letterCount = new Array(ukralphabet.length).fill(0);

    // Для кожного блоку підраховуємо кількість кожної літери в алфавіті
    for (let j = 0; j < block.length; j++) {
      const letter = block[j];
      const index = ukralphabet.indexOf(letter);
      if (index !== -1) {
        letterCount[index]++;
      }
    }

    // Знаходимо найчастіше зустрічаючу літеру у кожному блоку
    let maxCount = 0;
    let mostFrequentLetter = null;
    for (let j = 0; j < ukralphabet.length; j++) {
      if (letterCount[j] > maxCount) {
        maxCount = letterCount[j];
        mostFrequentLetter = ukralphabet[j];
      }
    }

    // Додаємо знайдену літеру до масиву ключів
    keyArray[i] = mostFrequentLetter;
  }
  return keyArray;
}

// Функція для розшифрування шифру Віженера
export function decryptVigenere(ciphertext, key, ukralphabet) {
  let plaintext = "";
  // Проходимося по всім символам шифртексту
  for (let i = 0; i < ciphertext.length; i++) {
    const ciphertextChar = ciphertext[i];
    // Отримуємо символ ключа відповідної позиції
    const keyChar = key[i % key.length];
    // Знаходимо індекси символів у відповідному алфавіті
    const ciphertextIndex = ukralphabet.indexOf(ciphertextChar);
    const keyIndex = ukralphabet.indexOf(keyChar);
    // Знаходимо індекс розшифрованого символу і додаємо його до розшифрованого тексту
    let plainCharIndex =
      (ciphertextIndex - keyIndex + ukralphabet.length) % ukralphabet.length;
    plaintext += ukralphabet[plainCharIndex];
  }
  return plaintext;
}

// Функція для знаходження довжини ключа
export function findKeyLength(ciphertext) {
  // Вираховуємо відстані між повтореннями
  const distances = [];
  for (let i = 0; i < ciphertext.length - 5; ++i) {
    for (let j = i + 1; j < ciphertext.length - 4; ++j) {
      const distance = j - i;
      // Перевіряємо, чи є співпадіння підрядних фрагментів
      if (ciphertext.substring(i, i + 5) === ciphertext.substring(j, j + 5)) {
        distances.push(distance);
      }
    }
  }
  // Знаходження найбільшого спільного дільника відстаней
  let gcd = distances[0];
  for (let i = 1; i < distances.length; ++i) {
    gcd = calculateGCD(gcd, distances[i]);
  }

  return gcd;
}

// Функція для знаходження найбільшого спільного дільника
function calculateGCD(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function findKeyLengthFriedman(ciphertext) {
  // Мінімальна та максимальна довжина ключа
  const minKeyLength = 1;
  const maxKeyLength = 5;

  // Теоретичні індекси збігу для різних довжин ключа
  const theoreticalIndexes = {
    1: 0.0544,
    2: 0.044,
    3: 0.0405,
    4: 0.039,
    5: 0.0385,
  };

  // Обчислюємо практичні індекси збігу для різних довжин ключа
  const practicalIndexes = {};
  for (let i = minKeyLength; i <= maxKeyLength; i++) {
    let totalIndex = 0;
    let segmentCount = 0;

    // Розділяємо текст на сегменти довжиною i
    for (let j = 0; j < i; j++) {
      let segment = "";
      for (let k = j; k < ciphertext.length; k += i) {
        segment += ciphertext[k];
      }
      // Обчислюємо практичний індекс збігу для сегмента
      totalIndex += PracticalIndexOfCoincidence(segment);
      segmentCount++;
    }

    const practicalIndex = totalIndex / segmentCount;
    practicalIndexes[i] = practicalIndex;
  }

  // Знаходимо довжину ключа на основі практичних індексів
  const possibleKeyLengths = [];
  for (const [keyLength, practicalIndex] of Object.entries(practicalIndexes)) {
    if (practicalIndex >= theoreticalIndexes[keyLength]) {
      possibleKeyLengths.push(parseInt(keyLength));
    }
  }

  // Виводимо можливі довжини ключа
  console.log("Можливі довжини ключа:");
  for (const keyLength of possibleKeyLengths) {
    console.log(keyLength);
  }

  return possibleKeyLengths;
}

// Функція практичного індексу збігу, яка використовується у функції findKeyLengthFriedman
function PracticalIndexOfCoincidence(text) {
  const alphabet = "_абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
  const alphabetLength = alphabet.length;
  const frequencies = new Array(alphabetLength).fill(0);
  let totalCharacters = 0;

  // Підраховуємо частоти кожного символу
  for (const char of text) {
    const index = alphabet.indexOf(char);
    if (index !== -1) {
      frequencies[index]++;
      totalCharacters++;
    }
  }

  // Обчислюємо практичний індекс збігу
  let sum = 0;
  for (const frequency of frequencies) {
    sum += frequency * (frequency - 1);
  }

  const practicalIndex = sum / (totalCharacters * (totalCharacters - 1));
  return practicalIndex;
}

// Константи і матриці перестановок
const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
const P8 = [6, 3, 7, 4, 8, 5, 10, 9];
const IP = [2, 6, 3, 1, 4, 8, 5, 7];
const IP_rev = [4, 1, 3, 5, 7, 2, 8, 6];
const EP = [4, 1, 2, 3, 2, 3, 4, 1];
const P4 = [2, 4, 3, 1];
const S0 = [
  ["01", "00", "11", "10"],
  ["11", "10", "01", "00"],
  ["00", "10", "01", "11"],
  ["11", "01", "11", "10"],
];
const S1 = [
  ["00", "01", "10", "11"],
  ["10", "00", "01", "11"],
  ["11", "00", "01", "00"],
  ["10", "01", "00", "11"],
];

// Функція для перетворення числа в двійковий рядок фіксованої довжини
function parseToBinary(parsedInt, bit) {
  let result = parsedInt.toString(2); // Перетворення числа в двійковий рядок
  return result.padStart(bit, "0").slice(-bit); // Доповнення нулями зліва та обрізка до потрібної довжини
}

// Функція для виконання перестановки
function permutation(positions, bit) {
  let result = "";
  positions.forEach((pos) => {
    result += bit[pos - 1]; // Виконуємо перестановку, враховуючи індексацію з нуля
  });
  return result;
}

// Функція для циклічного зсуву вліво
function leftSwap(str, shift) {
  let left = str.slice(0, 5); // Ліва частина
  let right = str.slice(5); // Права частина

  // Циклічний зсув вліво
  left = left.slice(shift) + left.slice(0, shift);
  right = right.slice(shift) + right.slice(0, shift);

  return left + right; // Зліплюємо результат
}

// Генерація підключів
function subkeysGeneration(key) {
  let P10_permuted = permutation(P10, key);
  let left_swap_one = leftSwap(P10_permuted, 1);
  let K1 = permutation(P8, left_swap_one);
  let left_swap_two = leftSwap(left_swap_one, 2);
  let K2 = permutation(P8, left_swap_two);

  return [K1, K2]; // Повертаємо згенеровані підключі
}

// Функція для виконання операції XOR
function parseXOR(binaryString, permutate, length) {
  let byte_xor = parseInt(binaryString, 2) ^ parseInt(permutate, 2); // Виконуємо операцію XOR
  let result = byte_xor.toString(2); // Перетворюємо результат в двійковий рядок
  return result.padStart(length, "0").slice(-length); // Доповнення нулями зліва та обрізка до потрібної довжини
}

// Функція для перетворення двійкового рядка в відповідне значення з S-блоку
function parseElemFromMatrix(byteXor) {
  let s0 = byteXor.slice(0, 4); // Перші 4 біти
  let s1 = byteXor.slice(4); // Решта 4 біти

  let row0 = s0[0] + s0[3]; // Вибираємо номер рядка
  let col0 = s0.slice(1, 3); // Вибираємо номер стовпця
  let row1 = s1[0] + s1[3]; // Вибираємо номер рядка
  let col1 = s1.slice(1, 3); // Вибираємо номер стовпця

  let row0Int = parseInt(row0, 2); // Перетворюємо рядок в число
  let col0Int = parseInt(col0, 2); // Перетворюємо стовпець в число
  let row1Int = parseInt(row1, 2); // Перетворюємо рядок в число
  let col1Int = parseInt(col1, 2); // Перетворюємо стовпець в число

  let result = S0[row0Int][col0Int] + S1[row1Int][col1Int]; // Отримуємо значення з S-блоку
  return result; // Повертаємо результат
}

// Функція для виконання шифрування
function encryption(charText, K1, K2) {
  let IP_permuted = permutation(IP, charText); // Перестановка початкового блоку

  let right = IP_permuted.slice(4); // Права половина
  let EP_permuted = permutation(EP, right); // Розширення правої половини
  let XOR = parseXOR(EP_permuted, K1, 8); // Виконуємо операцію XOR
  let S = parseElemFromMatrix(XOR); // Отримуємо значення з S-блоку
  let P4_permuted = permutation(P4, S); // Перестановка результатів S-блоку

  let left = IP_permuted.slice(0, 4); // Ліва половина
  let XOR1 = parseXOR(left, P4_permuted, 4); // Виконуємо операцію XOR
  let SW = right + XOR1; // Перестановка

  right = SW.slice(4); // Права половина
  let EP2_permuted = permutation(EP, right); // Розширення правої половини
  let XOR2 = parseXOR(EP2_permuted, K2, 8); // Виконуємо операцію XOR
  let S2 = parseElemFromMatrix(XOR2); // Отримуємо значення з S-блоку
  P4_permuted = permutation(P4, S2); // Перестановка результатів S-блоку

  let leftSW = SW.slice(0, 4); // Ліва половина після перестановки
  let XOR3 = parseXOR(leftSW, P4_permuted, 4); // Виконуємо операцію XOR
  let R2 = XOR3 + right; // Формуємо праву половину
  let result = permutation(IP_rev, R2); // Інверсна перестановка

  return result; // Повертаємо зашифрований блок
}

// Функція для перетворення шістнадцяткового рядка в двійковий
function parseHexToBinary(hex) {
  let n = parseInt(hex, 16); // Перетворюємо рядок в число
  return n.toString(2).padStart(8, "0"); // Перетворюємо число в двійковий рядок і доповнюємо нулями зліва до 8 біт
}

// Головна функція для шифрування та дешифрування
export function encryptDecrypt(message, keyStr) {
  let key = parseInt(keyStr); // Парсимо ключ у ціле число
  let binaryKey = parseToBinary(key, 10); // Перетворюємо ключ в двійковий рядок
  console.log("YOUR BINARY ENCODED KEY: " + binaryKey); // Виводимо двійковий рядок ключа

  let keys = subkeysGeneration(binaryKey); // Генеруємо підключі
  console.log("K1, K2 SWAP: " + keys[0] + " " + keys[1]); // Виводимо згенеровані підключі

  // Перетворюємо повідомлення в двійковий рядок
  let binaryText = "";
  for (let i = 0; i < message.length; i++) {
    let binaryChar = parseToBinary(message.charCodeAt(i), 8); // Перетворюємо символ в двійковий рядок
    binaryText += binaryChar; // Додаємо двійковий рядок символу до загального двійкового рядку повідомлення
  }

  // Шифруємо кожний блок по 8 біт
  let encryptedBinaryText = "";
  for (let i = 0; i < binaryText.length; i += 8) {
    let block = binaryText.slice(i, i + 8); // Виділяємо блок по 8 біт
    let encryptedBlock = encryption(block, keys[0], keys[1]); // Шифруємо блок
    encryptedBinaryText += encryptedBlock; // Додаємо зашифрований блок до загального зашифрованого рядка
  }

  console.log("ENCRYPTED BINARY TEXT: " + encryptedBinaryText); // Виводимо зашифрований двійковий рядок

  // Перетворюємо двійковий рядок в шістнадцятковий для відображення
  let cipherText = "";
  for (let i = 0; i < encryptedBinaryText.length; i += 8) {
    let block = encryptedBinaryText.slice(i, i + 8); // Виділяємо блок по 8 біт
    cipherText += parseInt(block, 2).toString(16); // Перетворюємо блок в шістнадцяткове значення і додаємо до загального рядка
  }
  console.log("CIPHERTEXT: " + cipherText); // Виводимо шістнадцяткове зашифроване повідомлення

  // Дешифруємо кожний блок по 8 біт
  let decryptedBinaryText = "";
  for (let i = 0; i < encryptedBinaryText.length; i += 8) {
    let block = encryptedBinaryText.slice(i, i + 8); // Виділяємо блок по 8 біт
    let decryptedBlock = encryption(block, keys[1], keys[0]); // Дешифруємо блок
    decryptedBinaryText += decryptedBlock; // Додаємо дешифрований блок до загального дешифрованого рядка
  }

  console.log("DECRYPTED BINARY TEXT: " + decryptedBinaryText); // Виводимо дешифрований двійковий рядок

  // Перетворюємо двійковий рядок назад в символьний рядок ASCII
  let decryptedText = "";
  for (let i = 0; i < decryptedBinaryText.length; i += 8) {
    let block = decryptedBinaryText.slice(i, i + 8); // Виділяємо блок по 8 біт
    decryptedText += String.fromCharCode(parseInt(block, 2)); // Перетворюємо блок в символ і додаємо до загального рядка
  }

  console.log("DECRYPTED TEXT: " + decryptedText); // Виводимо дешифроване повідомлення
  return {
    binaryKey,
    encryptedBinaryText,
    cipherText,
    decryptedBinaryText,
    decryptedText,
  }; // Повертаємо результати
}

