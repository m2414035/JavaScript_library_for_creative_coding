let table;
let numRows;
let correctAnswer;

function preload() {
  table = loadTable('trans.csv', 'csv', 'header');
}

function setup() {
  noCanvas(); // не нужен
  numRows = table.getRowCount();

  document.getElementById('next-button').addEventListener('click', generateQuestion);
  generateQuestion();
}

function generateQuestion() {
  const message = document.getElementById('message');
  const answers = document.getElementById('answers');
  const questionWord = document.getElementById('question-word');
  const nextButton = document.getElementById('next-button');

  message.textContent = '';
  answers.innerHTML = '';
  nextButton.style.display = 'none';

  let validRows = [];
  for (let i = 0; i < numRows; i++) {
    let eng = table.getString(i, 2);
    let rus = table.getString(i, 3);
    if (eng && rus) validRows.push({ eng, rus });
  }

  let rnd = int(random(validRows.length));
  let selected = validRows[rnd];
  correctAnswer = selected;

  questionWord.textContent = selected.eng;

  let wrongAnswers = [];
  while (wrongAnswers.length < 2) {
    let wrong = validRows[int(random(validRows.length))].rus;
    if (wrong !== selected.rus && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }

  let options = shuffle([selected.rus, ...wrongAnswers]);

  options.forEach(opt => {
    let btn = createButton(opt);
    btn.parent('answers');
    btn.mousePressed(() => checkAnswer(btn, opt));
  });
}

function checkAnswer(button, selected) {
  const buttons = document.querySelectorAll('#answers button');
  const message = document.getElementById('message');
  const nextButton = document.getElementById('next-button');

  buttons.forEach(b => b.attribute('disabled', ''));

  if (selected === correctAnswer.rus) {
    button.style('background-color', '#4CAF50');
    message.textContent = 'Correct!';
  } else {
    button.style('background-color', '#F44336');
    message.innerHTML = `Wrong! Correct translation: <span style="color:#4CAF50">${correctAnswer.rus}</span>`;
  }

  nextButton.style.display = 'inline-block';
}
