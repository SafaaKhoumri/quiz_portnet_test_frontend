import React, { useState } from 'react';
import logo from '../images/logo.png';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Modal,
  Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function Test3() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminEmail, domain, role, level, selectedCompetencies } = location.state || {};
  const [candidates, setCandidates] = useState([{ name: '', email: '' }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [testName, setTestName] = useState('');

  const handleCandidateChange = (index, e) => {
    const { name, value } = e.target;
    const newCandidates = [...candidates];
    newCandidates[index][name] = value;
    setCandidates(newCandidates);
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates, { name: '', email: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const competencyIds = selectedCompetencies.map(comp => comp.id);
  
    try {
      console.log('Submitting test data', {
        testName,
        adminEmail,
        domain,
        role,
        level,
        competencyIds,
        candidates
      });
  
      // Stocker le test dans la base de données
      const testResponse = await axios.post('http://localhost:8088/api/tests', {
        testName,
        adminEmail,
        domaineId: domain,
        roleId: role,
        levelId: level,
        competencyIds,
        candidates
      });
  
      console.log('Test response', testResponse.data);
  
      // Envoyer les emails aux candidats
      await axios.post('http://localhost:8088/api/sendTest', {
        testName,
        adminEmail,
        domaineId: domain,
        roleId: role,
        levelId: level,
        competencyIds,
        candidates
      });
  
      alert('Emails sent and test stored successfully!');
    } catch (error) {
      console.error('Error sending emails and storing test:', error);
      alert('Failed to send emails and store test.');
    }
  };
  

  const handleVisualizeTest = async () => {
    try {
      if (selectedCompetencies.length === 0) {
        throw new Error('No competencies selected');
      }

      const competencyIds = selectedCompetencies.map(comp => comp.id);
      const response = await axios.get('http://localhost:8088/api/questions', {
        params: { competencyIds: competencyIds.join(',') }
      });

      if (Array.isArray(response.data)) {
        setQuestions(response.data);
      } else {
        console.error('Data format error: Expected an array');
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to bottom, #f0f0f0 65%, #232A56 35%)', color: '#000', minHeight: '100vh' }}>
      <AppBar position="fixed" style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <img src={logo} alt="Logo" style={{ width: 100 }} />
          <nav style={{ alignItems: 'center' }}>
            <a href="#home" style={{ margin: '0 25px', textDecoration: 'none', color: '#000', fontWeight: 'inherit', cursor: 'pointer' }} onClick={() => navigate('/Login')}>Home</a>
            <a href="#tests" style={{ margin: '0 25px', textDecoration: 'none', color: '#000', fontWeight: 'inherit', cursor: 'pointer' }} onClick={() => navigate('/TestList')}>Tests</a>
            <a href="#results" style={{ margin: '0 25px', textDecoration: 'none', color: '#000', fontWeight: 'inherit', cursor: 'pointer' }}>Résultats</a>
            <a href="#more" style={{ margin: '0 25px', textDecoration: 'none', color: '#000', fontWeight: 'inherit', cursor: 'pointer' }}>Plus</a>
          </nav>
          <Button variant="outlined" color="primary" style={{ backgroundColor: '#fff', color: '#000000', padding: '10px 20px', borderRadius: 30, cursor: 'pointer', width: 'auto', marginRight: '3%', border: '2px solid #232A56' }} onClick={() => navigate('/Test1')}>Créer un test</Button>
        </Toolbar>
      </AppBar>

      <Typography variant="h1" style={{ marginTop: '15%', fontSize: '3.5em', fontStyle: 'italic' }}>Créer un test</Typography>

      <Container style={{ backgroundColor: '#fff', padding: 30, borderRadius: 10, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', width: '50%', margin: '3%', height: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h2" style={{ fontSize: '1.5em', color: 'rgba(35, 42, 86, 0.66)', textAlign: 'center', paddingBottom: '5%' }}>Inviter des candidats</Typography>
          <TextField
            type="text"
            name="testName"
            placeholder="Entrer le nom du test"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            variant="outlined"
            style={{ width: '100%', marginBottom: 20, padding: 5, borderRadius: 30, fontSize: '1em' }}
          />
          <div style={{ maxHeight: 130, overflowY: 'auto', width: '100%' }}>
            {candidates.map((candidate, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <TextField
                  type="text"
                  name="name"
                  placeholder="Entrer le nom du candidat"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(index, e)}
                  variant="outlined"
                  style={{ width: '50%', padding: 5, borderRadius: 30, fontSize: '1em' }}
                />
                <TextField
                  type="email"
                  name="email"
                  placeholder="Entrer l’email du candidat"
                  value={candidate.email}
                  onChange={(e) => handleCandidateChange(index, e)}
                  variant="outlined"
                  style={{ width: '50%', padding: 5, borderRadius: 30, fontSize: '1em' }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <Button type="button" variant="contained" color="primary" style={{ borderRadius: 30, width: '20%', backgroundColor: 'rgba(35, 42, 86, 0.66)', color: '#000', cursor: 'pointer' }} onClick={handleAddCandidate}>Ajouter</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="button" variant="contained" color="primary" style={{ borderRadius: 30, width: '45%', backgroundColor: '#232A56', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 10 }} onClick={handleVisualizeTest}>Visualiser le test</Button>
            <Button type="submit" variant="contained" color="primary" style={{ borderRadius: 30, width: '45%', backgroundColor: '#232A56', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 10 }}>Envoyer le test</Button>
          </div>
        </form>
      </Container>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          <Typography variant="h4" gutterBottom style={{ fontSize: '1.5em', color: 'rgba(35, 42, 86, 0.66)', textAlign: 'center', paddingBottom: '5%' }}>
            Visualiser le test
          </Typography>
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <Box key={index} sx={{
                mb: 2,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 2
              }}>
                <Typography variant="h6" style={{ marginBottom: 10, color: '#000' }}>{q.questionText}</Typography>
                {q.choices.map((choice, idx) => (
                  <Typography key={idx} variant="body1" style={{ color: '#555' }}>
                    {choice.choiceText}
                  </Typography>
                ))}
              </Box>
            ))
          ) : (
            <Typography style={{ color: '#000' }}>No questions available</Typography>
          )}
          <Button variant="contained" color="primary" onClick={handleCloseModal} style={{ borderRadius: 30, backgroundColor: '#232A56', color: '#fff', cursor: 'pointer', marginTop: 10 }}>Fermer</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Test3;
