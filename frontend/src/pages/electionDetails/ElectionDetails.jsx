import React, { useEffect, useState, useRef } from 'react';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Statistic } from 'antd';
import { api } from '../../config';
import NavBar from '../../components/navBar/NavBar';
import { speak, speakWithCallback, startListening, stopListening } from '../../utils/speech';
import { trapFocus, enableEscapeKey, announce } from '../../utils/keyboardNavigation';
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
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const dialogRef = useRef(null);
  const cleanupFocusTrap = useRef(null);
  const cleanupEscapeKey = useRef(null);

  // Setup focus trap and escape key for dialog
  useEffect(() => {
    if (dialogOpen && dialogRef.current) {
      // Trap focus within dialog
      cleanupFocusTrap.current = trapFocus(dialogRef.current);
      
      // Enable escape key to close dialog
      cleanupEscapeKey.current = enableEscapeKey(handleCloseDialog);
      
      // Announce dialog opened
      announce('Vote confirmation dialog opened. Press Escape to cancel.');
    }

    return () => {
      if (cleanupFocusTrap.current) {
        cleanupFocusTrap.current();
      }
      if (cleanupEscapeKey.current) {
        cleanupEscapeKey.current();
      }
    };
  }, [dialogOpen]);

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
    
    // Read candidate details aloud
    const message = `You are about to vote for ${candidate.name}, from ${candidate.party} party. ${candidate.description}. Please confirm by typing the candidate's name or use voice command.`;
    speakWithCallback(message, () => {
      console.log('Finished reading candidate details');
    });
  };

  const handleReadCandidates = () => {
    if (candidates.length === 0) {
      speak('No candidates available');
      return;
    }
    
    let message = `There are ${candidates.length} candidates. `;
    candidates.forEach((candidate, index) => {
      message += `Candidate ${index + 1}: ${candidate.name} from ${candidate.party} party. `;
    });
    message += 'Click on any candidate to hear more details and vote.';
    
    speak(message);
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    speak('Listening... Say "Vote for" followed by the candidate name');
    
    startListening(
      (transcript) => {
        setIsListening(false);
        setVoiceCommand(transcript);
        console.log('Voice command:', transcript);
        
        // Parse voice command
        const lowerTranscript = transcript.toLowerCase();
        const voteMatch = lowerTranscript.match(/vote for (.+)/i);
        
        if (voteMatch) {
          const candidateName = voteMatch[1].trim();
          
          // Find matching candidate
          const matchedCandidate = candidates.find(c => 
            c.name.toLowerCase().includes(candidateName) || 
            candidateName.includes(c.name.toLowerCase())
          );
          
          if (matchedCandidate) {
            speak(`Opening vote confirmation for ${matchedCandidate.name}`);
            handleVote(matchedCandidate);
          } else {
            speak(`Could not find candidate ${candidateName}. Please try again.`);
          }
        } else {
          speak('Command not recognized. Please say "Vote for" followed by candidate name.');
        }
      },
      (error) => {
        setIsListening(false);
        console.error('Speech recognition error:', error);
        speak('Voice command failed. Please try again.');
      }
    );
  };

  const handleConfirmVote = async () => {
    if (candidateName !== selectedCandidate.name) {
      const errorMsg = 'Candidate name does not match.';
      setSnackbarMessage(errorMsg);
      setSnackbarColor('red'); // Set snackbar color to red for error
      setSnackbarOpen(true);
      speak(errorMsg);
      announce(errorMsg, 'assertive');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    try {
      const response = await api.post(
        `/votes`,
        { election: id, candidate: selectedCandidate._id },
      );
      const successMsg = response.data.message;
      setSnackbarMessage(successMsg);
      setSnackbarColor('green'); // Set snackbar color to green for success
      setCandidateName('');
      
      // Confirm vote via speech
      speak(`Vote confirmed! You have successfully voted for ${selectedCandidate.name}.`);
      announce(successMsg, 'assertive');
    } catch (error) {
      const errorMsg = error.response.data.error;
      setSnackbarMessage(errorMsg);
      setSnackbarColor('red'); // Set snackbar color to red for error
      setCandidateName('');
      speak(errorMsg);
      announce(errorMsg, 'assertive');
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
          <Tooltip title="Read all candidates aloud">
            <IconButton 
              onClick={handleReadCandidates} 
              color="primary" 
              style={{ marginLeft: '10px' }}
              aria-label="Read candidates aloud"
            >
              <VolumeUpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isListening ? "Stop listening" : "Use voice command to vote"}>
            <IconButton 
              onClick={handleVoiceCommand}
              color={isListening ? "secondary" : "primary"}
              style={{ marginLeft: '5px' }}
              aria-label="Voice command"
            >
              <MicIcon />
            </IconButton>
          </Tooltip>
        </Typography>
        <Grid container spacing={4}>
          {candidates.map((candidate) => (
            <Grid item key={candidate._id} xs={12} sm={6} md={4}>
              <Card 
                className="candidateCard"
                tabIndex={0}
                role="article"
                aria-label={`Candidate: ${candidate.name}, Party: ${candidate.party}, ${candidate.description}`}
                onKeyDown={(e) => {
                  if (status.text === 'Ongoing' && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleVote(candidate);
                  }
                }}
              >
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
                      aria-label={`Vote for ${candidate.name}`}
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
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        ref={dialogRef}
        aria-labelledby="vote-dialog-title"
        aria-describedby="vote-dialog-description"
        className="focus-trap-active"
      >
        <DialogTitle id="vote-dialog-title">Confirm Your Vote</DialogTitle>
        <DialogContent>
          <DialogContentText id="vote-dialog-description">
            Please type the candidate's name to confirm your vote for {selectedCandidate?.name}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Candidate Name"
            fullWidth
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirmVote();
              }
            }}
            aria-label="Enter candidate name to confirm vote"
            aria-required="true"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            color="primary"
            aria-label="Cancel vote"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmVote} 
            color="primary"
            aria-label="Confirm vote"
          >
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
