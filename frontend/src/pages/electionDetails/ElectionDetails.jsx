import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  Container,
  AppBar,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
} from '@mui/material';
import { Statistic } from 'antd';
import { api } from '../../config';
import NavBar from '../../components/navBar/NavBar';
import './electionDetails.scss';

// Utility function to get a random color for the avatar
const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState(''); // To store snackbar color

  useEffect(() => {
    const fetchElectionDetails = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found');
        setLoading(false);
        return;
      }

      try {
        const electionResponse = await api.get(`/election/${id}`);
        const electionData = electionResponse.data;

        const status = getStatus(electionData.startDate, electionData.endDate).text;
        if (status === 'Ended') {
          navigate('/home');
        } else {
          setElection(electionData);

          const candidatesResponse = await api.get(`/candidates/${id}`);
          setCandidates(candidatesResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching election details:', error);
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [id, navigate]);

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { text: 'Upcoming', color: 'blue', time: start };
    } else if (now >= start && now <= end) {
      return { text: 'Ongoing', color: 'green', time: end };
    } else {
      return { text: 'Ended', color: 'red', time: null };
    }
  };

  const handleVote = (candidate) => {
    setSelectedCandidate(candidate);
    setDialogOpen(true);
  };

  const handleConfirmVote = async () => {
    if (candidateName !== selectedCandidate.name) {
      setSnackbarMessage('Candidate name does not match.');
      setSnackbarColor('red'); // Set snackbar color to red for error
      setSnackbarOpen(true);
      return;
    }

    const token = localStorage.getItem('jwtToken');
    try {
      const response = await api.post(
        `/votes`,
        { election: id, candidate: selectedCandidate._id },
      );
      setSnackbarMessage(response.data.message);
      setSnackbarColor('green'); // Set snackbar color to green for success
      setCandidateName('');
    } catch (error) {
      setSnackbarMessage(error.response.data.error);
      setSnackbarColor('red'); // Set snackbar color to red for error
      setCandidateName('');
    }

    setDialogOpen(false);
    setSnackbarOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCandidateName('');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const status = getStatus(election.startDate, election.endDate);
  const countdownText = status.text === 'Upcoming' ? 'Election starts in:' : status.text === 'Ongoing' ? 'Election ends in:' : 'Election ended:';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="electionDetailsContainer">
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Container maxWidth="lg" className="electionDetailsContent">
        {election && (
          <Box mb={4} className="electionInfo">
            <Typography variant="h4" gutterBottom>
              {election.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {election.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Start Date: {formatDate(election.startDate)}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              End Date: {formatDate(election.endDate)}
            </Typography>
            {status.time && (
              <Box mt={2}>
                <Typography variant="body1" style={{ color: status.color }} gutterBottom>
                  {countdownText}
                </Typography>
                <Statistic.Countdown
                  value={status.time}
                  format="D[d] H[h] m[m] s[s]"
                  valueStyle={{ color: status.color, fontSize: '1.5rem', fontWeight: 'bold' }}
                />
              </Box>
            )}
          </Box>
        )}

        <Typography variant="h5" gutterBottom>
          Candidates
        </Typography>
        <Grid container spacing={4}>
          {candidates.map((candidate) => (
            <Grid item key={candidate._id} xs={12} sm={6} md={4}>
              <Card className="candidateCard">
                <CardContent className="candidateContent">
                  <Avatar style={{ backgroundColor: stringToColor(candidate.name), width: 60, height: 60, fontSize: '1.5rem' }}>
                    {candidate.name.charAt(0)}
                  </Avatar>
                  <Box ml={2} flexGrow={1}>
                    <Typography variant="h6">{candidate.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {candidate.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Party: {candidate.party}
                    </Typography>
                  </Box>
                  {status.text === 'Ongoing' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleVote(candidate)}
                      className="voteButton"
                      style={{ marginTop: '10px' }}
                    >
                      Vote
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Vote Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Your Vote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please type the candidate's name to confirm your vote for {selectedCandidate?.name}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Candidate Name"
            fullWidth
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmVote} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // 3 seconds
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        ContentProps={{
          style: {
            backgroundColor: snackbarColor,
          },
        }}
      />
    </div>
  );
};

export default ElectionDetails;
