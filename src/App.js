import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from '@mui/material';

function App() {
  const [totalCreditHours, setTotalCreditHours] = useState('');
  const [totalGradePoints, setTotalGradePoints] = useState('');
  const [cgpa, setCgpa] = useState(null);

  const handleCalculateCGPA = () => {
    // Convert inputs to numbers
    const creditHours = parseFloat(totalCreditHours);
    const gradePoints = parseFloat(totalGradePoints);

    // Basic validation
    if (
      isNaN(creditHours) ||
      isNaN(gradePoints) ||
      creditHours <= 0
    ) {
      setCgpa(null);
      return;
    }

    // Calculate CGPA
    const calculatedCgpa = gradePoints / creditHours;
    setCgpa(calculatedCgpa.toFixed(2)); // 2 decimal places
  };

  const handleReset = () => {
    setTotalCreditHours('');
    setTotalGradePoints('');
    setCgpa(null);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Card variant="outlined" sx={{ padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            CGPA Calculator
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Total Credit Hours"
              variant="outlined"
              type="number"
              value={totalCreditHours}
              onChange={(e) => setTotalCreditHours(e.target.value)}
              fullWidth
            />
            <TextField
              label="Total Grade Points"
              variant="outlined"
              type="number"
              value={totalGradePoints}
              onChange={(e) => setTotalGradePoints(e.target.value)}
              fullWidth
            />
            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={handleCalculateCGPA}
              >
                Calculate
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>

            {cgpa && (
              <Typography variant="h6" color="primary">
                Your CGPA is: {cgpa}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
