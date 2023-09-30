// app.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Define the grade-point values for each grade (capital letters)
const gradePoints = {
  'A': 10,
  'B': 8,
  'C': 6,
  'D': 4,
  'E': 2,
  'F': 0,
};

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/calculate', (req, res) => {
  const { subjects, credits, grades, totalCredits } = req.body;

  // Check if inputs are valid
  if (!Array.isArray(subjects) || !Array.isArray(credits) || !Array.isArray(grades) ||
      subjects.length !== credits.length || subjects.length !== grades.length) {
    res.render('error', { message: 'Invalid input format. Please check your subjects, grades, and credits.' });
    return;
  }

  let totalCourseCredits = 0;
  let totalGradePoints = 0;

  for (let i = 0; i < subjects.length; i++) {
    const credit = parseFloat(credits[i]);
    let grade = grades[i]; // Keep the original case of the input grade

    // Convert the grade to uppercase (consistency for matching)
    grade = grade.toUpperCase();

    if (!isNaN(credit) && credit > 0 && gradePoints.hasOwnProperty(grade)) {
      totalGradePoints += gradePoints[grade]; // Sum the grade points
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

  const cgpa = totalGradePoints / totalCourseCredits;

  res.render('result', { cgpa: cgpa.toFixed(2) });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

