import React, { useState } from 'react';
import { Button, Box, Typography, Paper, FormControl, FormControlLabel, Radio, RadioGroup, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { grey, common } from '@mui/material/colors';
import { styled } from '@mui/system';
import TestIntroduction from './TestIntroduction';
import TestSubmitted from './TestSubmitted';

const GradientBackground = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #232A56, #f5f5f5)',
});

const TestBox = styled(Paper)(({ theme }) => ({
  padding: '2rem',
  width: '100%',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
}));

const exampleQuestions = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "London", "Rome"],
    correctAnswer: "Paris"
  },
  {
    question: "What is the boiling point of water?",
    choices: ["90°C", "100°C", "110°C"],
    correctAnswer: "100°C"
  },
  {
    question: "What is the largest planet in our Solar System?",
    choices: ["Earth", "Jupiter", "Saturn"],
    correctAnswer: "Jupiter"
  },
];

const TakeTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(exampleQuestions.length).fill(''));
  const [openDialog, setOpenDialog] = useState(false);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < exampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (confirm) => {
    setOpenDialog(false);
    if (confirm) {
      setSubmitted(true);
    }
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleRetake = () => {
    setStarted(false);
    setSubmitted(false);
    setCurrentQuestion(0);
    setAnswers(new Array(exampleQuestions.length).fill(''));
  };

  return (
    <>
      {!started ? (
        <TestIntroduction onStart={handleStart} />
      ) : submitted ? (
        <TestSubmitted onRetake={handleRetake} />
      ) : (
        <GradientBackground>
          <Typography variant="h2" component="h1" style={{ marginBottom: '5%', color: common.white }}>
            Prendre le Test
          </Typography>
          <TestBox>
            <Typography variant="h6" component="h2" gutterBottom style={{ marginBottom: '5%', marginLeft:'40%' }}>
              Question {currentQuestion + 1} / {exampleQuestions.length}
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
              {exampleQuestions[currentQuestion].question}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup value={answers[currentQuestion]} onChange={handleChange}>
                {exampleQuestions[currentQuestion].choices.map((choice, index) => (
                  <FormControlLabel key={index} value={choice} control={<Radio />} label={choice} />
                ))}
              </RadioGroup>
            </FormControl>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
              <Box sx={{ display: 'flex', justifyContent: currentQuestion > 0 ? 'space-between' : 'flex-end', width: '100%' }}>
                {currentQuestion > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrevious}
                    sx={{ backgroundColor: '#232A56', '&:hover': { 
                        backgroundColor: grey[400], 
                        color: '#232A56' 
                      },  }}
                  >
                    Précédent
                  </Button>
                )}
                {currentQuestion < exampleQuestions.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    sx={{ backgroundColor: '#232A56', '&:hover': { 
                        backgroundColor: grey[400], 
                        color: '#232A56' 
                      },  }}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ backgroundColor: '#232A56', '&:hover': { 
                        backgroundColor: grey[400], 
                        color: '#232A56' 
                      },  }}
                  >
                    Soumettre
                  </Button>
                )}
              </Box>
            </Box>
          </TestBox>

          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
          >
            <DialogTitle id="confirmation-dialog-title">{"Confirmer la soumission"}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" id="confirmation-dialog-description">
                Êtes-vous sûr de vouloir soumettre le test ?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleCloseDialog(false)} color="primary">
                Annuler
              </Button>
              <Button onClick={() => handleCloseDialog(true)} color="primary">
                Soumettre
              </Button>
            </DialogActions>
          </Dialog>
        </GradientBackground>
      )}
    </>
  );
};

export default TakeTest;