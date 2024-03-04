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


// Функція для розділення криптограми на блоки за можливою довжиною ключа
export function splitTextIntoBlocks(ciphertext, keyLength) {
  const blocks = [];
  for (let i = 0; i < keyLength; i++) {
      blocks.push('');
  }
  for (let i = 0; i < ciphertext.length; i++) {
      const index = i % keyLength;
      blocks[index] += ciphertext[i];
  }
  return blocks;
}

// Функція для знаходження літери ключа за частотою літер
export function findMostFrequentLetter(block) {
  const frequencies = {};
  for (let i = 0; i < block.length; i++) {
      const char = block[i];
      if (frequencies[char]) {
          frequencies[char]++;
      } else {
          frequencies[char] = 1;
      }
  }
  let maxFrequency = 0;
  let mostFrequentLetter;
  for (const char in frequencies) {
      if (frequencies[char] > maxFrequency) {
          maxFrequency = frequencies[char];
          mostFrequentLetter = char;
      }
  }
  return mostFrequentLetter;
}

export function vigenereDecipher(ciphertext, keyword) {
  const alphabet = 'абвгдеєжзиіїйклмнопрстуфхцчшщьюяґ';
  let plaintext = '';
  for (let i = 0; i < ciphertext.length; i++) {
      const ciphertextChar = ciphertext[i];
      const keywordChar = keyword[i % keyword.length];
      const shift = alphabet.indexOf(keywordChar);
      const position = (alphabet.indexOf(ciphertextChar) - shift + alphabet.length) % alphabet.length;
      plaintext += alphabet[position];
  }
  return plaintext;
}