export function handleKey(processedKey, alphabetLength){
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
    let plainCharIndex = (ciphertextIndex - keyIndex + ukralphabet.length) % ukralphabet.length;
    plaintext += ukralphabet[plainCharIndex];
  }
  return plaintext;
}

// Функція для знаходження довжини ключа
export function findKeyLength(ciphertext) {
  // Вираховуємо відстані між повтореннями
  const distances = [];
  for (let i = 0; i < ciphertext.length - 5; ++i) {
      for (let j = i + 1; j < ciphertext.length - 4; ++j) { // змінено -2 на -4
          const distance = j - i;
          // Перевіряємо, чи є співпадіння підрядних фрагментів
          if (ciphertext.substring(i, i + 5) === ciphertext.substring(j, j + 5)) { // змінено 3 на 5
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

  const minKeyLength = 1;
  const maxKeyLength = 5;

  const theoreticalIndexes = {
    1: 0.0544,
    2: 0.044,
    3: 0.0405,
    4: 0.0390,
    5: 0.0385
  };

  // Calculate practical indexes for different key lengths
  const practicalIndexes = {};
  for (let i = minKeyLength; i <= maxKeyLength; i++) {
    let totalIndex = 0;
    let segmentCount = 0;

    // Split the text into segments of length i
    for (let j = 0; j < i; j++) {
      let segment = "";
      for (let k = j; k < ciphertext.length; k += i) {
        segment += ciphertext[k];
      }
      // Calculate practical index for the segment
      totalIndex += PracticalIndexOfCoincidence(segment);
      segmentCount++;
    }

    const practicalIndex = totalIndex / segmentCount;
    practicalIndexes[i] = practicalIndex;
  }

  // Find key length based on practical indexes
  const possibleKeyLengths = [];
  for (const [keyLength, practicalIndex] of Object.entries(practicalIndexes)) {
    if (practicalIndex >= theoreticalIndexes[keyLength]) {
      possibleKeyLengths.push(parseInt(keyLength));
    }
  }

  // Output key lengths
  console.log("Possible key lengths:");
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

  // Count frequencies of each character
  for (const char of text) {
    const index = alphabet.indexOf(char);
    if (index !== -1) {
      frequencies[index]++;
      totalCharacters++;
    }
  }

  // Calculate practical index of coincidence
  let sum = 0;
  for (const frequency of frequencies) {
    sum += frequency * (frequency - 1);
  }

  const practicalIndex = sum / (totalCharacters * (totalCharacters - 1));
  return practicalIndex;
}