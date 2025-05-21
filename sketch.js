let table;
let numRows;
let correctAnswer;

function preload() {
  table = loadTable('trans.csv', 'csv', 'header');
}

function setup() {
  noCanvas(); // canvas не нужен
  numRows = table.getRowCount();

  document.getElementById('next-button').addEventListener('click', generateQuestion);
  generateQuestion();
}

function generateQuestion() {
  const question = document.getElementById('question-word');
  const answersDiv = document.getElementById('answers');
  const message = document.getElementById('message');
  const nextButton = document.getElementById('next-button');

  message.textContent = '';
  answersDiv.innerHTML = '';
  nextButton.style.display = 'none';

  // Собираем все строки с валидными словами
  let validRows = [];
  for (let i = 0; i < numRows; i++) {
    let eng = table.getString(i, 2);
    let rus = table.getString(i, 3);
    if (eng && rus) {
      validRows.push({ eng, rus });
    }
  }

  // Выбираем случайный вопрос
  let rndIndex = int(random(validRows.length));
  let selected = validRows[rndIndex];
  correctAnswer = selected;

  question.textContent = selected.eng;

  // Выбираем 2 случайных неправильных ответа
  let wrongAnswers = [];
  while (wrongAnswers.length < 2) {
    let candidate = validRows[int(random(validRows.length))].rus;
    if (candidate !== selected.rus && !wrongAnswers.includes(candidate)) {
      wrongAnswers.push(candidate);
    }
  }

  // Смешиваем правильный и неправильные
  let options = shuffle([selected.rus, ...wrongAnswers]);

  options.forEach(opt => {
    let btn = createButton(opt);
    btn.parent(answersDiv);
    btn.mousePressed(() => checkAnswer(btn, opt));
  });
}

function checkAnswer(button, selected) {
  const allButtons = document.querySelectorAll('#answers button');
  const message = document.getElementById('message');
  const nextButton = document.getElementById('next-button');

  allButtons.forEach(b => b.attribute('disabled', ''));

  if (selected === correctAnswer.rus) {
    button.style('background-color', '#4CAF50');
    message.textContent = 'Correct!';
  } else {
    button.style('background-color', '#F44336');
    message.innerHTML = `Wrong! Correct answer: <span style="color:#4CAF50">${correctAnswer.rus}</span>`;
  }

  nextButton.style.display = 'inline-block';
}
