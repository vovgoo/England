let currentRussianWord = "";
let currentEnglishWord = "";
let correctAnswers = 0;
let incorrectAnswers = 0;
let record = localStorage.getItem('record');
let theme = localStorage.getItem('theme');

// Проверка и сохранения темы

if (theme !== null) {
  switch (theme){
    case '0':
      setTheme("default");
      break;
    case '1':
      setTheme("dark");
      break;
    case '2':
      setTheme("purple");
      break;
  }
} else {
  theme = 0;
  localStorage.setItem('theme', theme);
  setTheme("default");
}

// Проверка и сохранения рекорда

if (record !== null) {
  document.getElementById("record").textContent = record;
} else {
  record = 0;
}

let number_for_record = 0;
const inputText = document.getElementById("userInput");

// Сторонние функции

// Очистка
function NullResult(){
  correctAnswers = 0;
  incorrectAnswers = 0;

  document.getElementById("correctCount").textContent = correctAnswers;
  document.getElementById("incorrectCount").textContent = incorrectAnswers;

  loadRandomWord(); 
  updateInputField(); 
  resultDiv.innerHTML = ``;
}

// Случайные слова

function loadRandomWord() {
fetch("output_file.txt")
  .then(response => response.text())
  .then(data => {
    const words = data.trim().split(/\r?\n/);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const firstSpaceIndex = randomWord.indexOf(" ");
    if (firstSpaceIndex !== -1) {
      currentEnglishWord = randomWord.slice(0, firstSpaceIndex);
      currentRussianWord = randomWord.slice(firstSpaceIndex + 1);
      const outputDiv = document.getElementById("output");
      outputDiv.innerHTML = `<p><strong>${currentEnglishWord} - ${currentRussianWord}</strong></p>`;
    }
  })
  .catch(error => console.error("Error reading the file:", error));
}

// Анимация в зависимости от ответа в текстовом поле
function changeBorderColor(color) {
  const animationDuration = 500; // 0.5 секунды
  inputText.style.transition = `border-color ${animationDuration}ms ease`;
  inputText.style.borderColor = `${color}`;

  // После завершения анимации устанавливаем обратно зеленый цвет обводки.
  setTimeout(() => {
      inputText.style.borderColor = 'var(--userinput-color)';

      // Возвращаем обработчик события click после завершения анимации.
      inputText.addEventListener('click', changeBorderColor);
  }, animationDuration);
}

// Отображение ошибок
function misstext(text) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<p style="color: red; font-size: 16px;"><b>Неправильно! Правильное слово: ${text}.</b></p>`;

  // Добавляем класс "hidden" через небольшую задержку для запуска анимации
  setTimeout(() => {
    resultDiv.classList.add("hidden");
  }, 50);

  // Удаляем содержимое элемента через время, большее, чем длительность анимации
  setTimeout(() => {
    resultDiv.innerHTML = ``;
    resultDiv.classList.remove("hidden"); // Удаляем класс "hidden", чтобы анимация могла повториться
  }, 1500); // Длительность анимации задается здесь (0.5 секунды)
}

document.getElementById("userInput").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    checkUserInput();
  }
});

function blurPage() {
  var screenWidth = window.innerWidth;
  var mainElement = document.querySelector("main");
  var headerElement = document.querySelector("header");
  var footerElement = document.querySelector("footer");
  

  if (screenWidth > 768) {
    mainElement.classList.add("blur-effect");
  } else {
    mainElement.classList.add("blur-effect");
    headerElement.classList.add("blur-effect");
    footerElement.classList.add("blur-effect");
  }

  var inputText = document.getElementById("userInput");
  inputText.disabled = true;
}

// Function to remove the blur effect
function unblurPage() {
  var mainElement = document.querySelector("main");
  var headerElement = document.querySelector("header");
  var footerElement = document.querySelector("footer");

  mainElement.classList.remove("blur-effect");
  headerElement.classList.remove("blur-effect");
  footerElement.classList.remove("blur-effect");

  var inputText = document.getElementById("userInput");
  inputText.disabled = false;
  inputText.focus();
}

function showPopupModal() {
  var modal = document.getElementById("popupModal");
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("popupModal");
  modal.style.display = "none";
  unblurPage();
}



function checkUserInput() {
  const userInput = document.getElementById("userInput").value.trim();
  if (userInput.toLowerCase() === currentEnglishWord.toLowerCase()) {
    changeBorderColor(`rgb(0,255,0)`);
    number_for_record++;
    if(number_for_record > record){
      record = number_for_record;
      document.getElementById("record").textContent = record;
      localStorage.setItem('record', record);
    }
    correctAnswers++;
  } else {
    changeBorderColor(`red`);
    if(number_for_record == record && record !== 0){
      blurPage();
      showPopupModal();
      number_for_record = 0;
    }
    misstext(currentEnglishWord)
    incorrectAnswers++;
  }

  // Обновляем отображение количества ответов
  document.getElementById("correctCount").textContent = correctAnswers;
  document.getElementById("incorrectCount").textContent = incorrectAnswers;

  loadRandomWord(); // Загрузка нового слова
  updateInputField(); // Очистка поля ввода
}

function updateInputField() {
  document.getElementById("userInput").value = "";
}

document.getElementById("NullBtn").addEventListener("click", () => {
  NullResult();
});
  

// Добавляем обработчик события 'focus'
inputText.addEventListener('focus', () => {
  // Когда input получает фокус, проверяем, если он пустой
  if (inputText.value === '') {
    // Если поле пустое, то очищаем значение атрибута placeholder
    inputText.removeAttribute('placeholder');
  }
});

// Добавляем обработчик события 'blur'
inputText.addEventListener('blur', () => {
  // Когда input теряет фокус, проверяем, если он остался пустым
  if (inputText.value === '') {
    // Если поле пустое, то восстанавливаем значение атрибута placeholder
    inputText.setAttribute('placeholder', 'Введите текст');
  }
});

// Изменение темы

function setTheme(themeName) {
  const root = document.documentElement;
  root.className = `theme-${themeName}`;

  var image = document.getElementById('logo');  
  var link = document.getElementById('favicon');

  var defaultbtn = document.getElementById('default-btn');
  var darkbtn = document.getElementById('dark-btn');
  var purplebtn = document.getElementById('purple-btn');

  defaultbtn.classList.remove("button-border");
  darkbtn.classList.remove("button-border");
  purplebtn.classList.remove("button-border");

  switch(themeName){
    case "default":
      defaultbtn.classList.add("button-border");
      image.src = "img/logo.png";
      link.href = "img/favicon_default.ico";
      localStorage.setItem('theme', 0);
      break;
    case "dark":
      darkbtn.classList.add("button-border");
      image.src = "img/logo_dark.png";
      link.href = "img/favicon_black.ico";
      localStorage.setItem('theme', 1);
      break;
    case "purple":
      purplebtn.classList.add("button-border"); 
      image.src = "img/logo_purple.png";
      link.href = "img/favicon_purple.ico";
      localStorage.setItem('theme', 2);
      break; 
  }

  
}

// Вызываем функцию для генерации слова при старте сайта
loadRandomWord();
