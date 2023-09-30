// app.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/calculate', (req, res) => {
  const { subjects, credits, grades, totalCredits } = req.body;

  const gradeValues = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'E': 1,
    'F': 0,
  };

  const isValidInput = subjects && credits && grades &&
    subjects.length === credits.length && subjects.length === grades.length;

  if (!isValidInput) {
    res.render('error', { message: 'Invalid input. Please check your grades and credits.' });
    return;
  }

  let totalPoints = 0;
  let totalCourseCredits = 0;

  for (let i = 0; i < subjects.length; i++) {
    const credit = parseFloat(credits[i]);
    const grade = grades[i].toUpperCase();

    if (!isNaN(credit) && gradeValues.hasOwnProperty(grade)) {
      totalPoints += credit * gradeValues[grade];
      totalCourseCredits += credit;
    }
  }

  if (totalCourseCredits <= 0) {
    res.render('error', { message: 'Total course credits must be greater than zero.' });
    return;
  }

  if (parseFloat(totalCredits) !== totalCourseCredits) {
    res.render('error', { message: 'Total credits entered do not match the sum of course credits.' });
    return;
  }

  const cgpa = totalPoints / totalCourseCredits;

  res.render('result', { cgpa: cgpa.toFixed(2) });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});