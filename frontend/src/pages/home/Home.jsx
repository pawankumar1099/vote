import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Typography,
  Button,
  Container,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
  Paper,
} from '@mui/material';
import './home.scss';
import { api } from '../../config';
import { HowToVote as HowToVoteIcon } from '@mui/icons-material';
import { Input, DatePicker, Button as AntButton, Form, Row, Col } from 'antd';
import NavBar from "../../components/navBar/NavBar";

const Home = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [allElections, setAllElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const response = await api.get('/elections');
          setElections(response.data);
          setAllElections(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching elections:', error);
          setLoading(false);
        }
      }
    };

    fetchElections();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { text: 'Upcoming', color: '#3b82f6', bgColor: '#dbeafe' };
    } else if (now >= start && now <= end) {
      return { text: 'Ongoing', color: '#10b981', bgColor: '#d1fae5' };
    } else {
      return { text: 'Ended', color: '#6b7280', bgColor: '#f3f4f6' };
    }
  };

  const handleApplyFilters = () => {
    const filteredElections = allElections.filter((election) => {
      const matchesTitle = filterTitle ? election.title.toLowerCase().includes(filterTitle.toLowerCase()) : true;
      const matchesDate = filterDate ? formatDate(election.startDate) === filterDate : true;
      return matchesTitle && matchesDate;
    });
    setElections(filteredElections);
  };

  return (
    <div className="home-container" role="main" id="main-content" aria-busy={loading} aria-label="Election listing and filters" data-speak="Election listing and filters">
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Container className="home-content" maxWidth="lg">
        <div className="home-content-welcome">
          <Typography variant="h4" className="welcome-message home-content-welcome-title" gutterBottom>
            Welcome to YouVote!
          </Typography>
          <Typography variant="body1" className="info-message home-content-welcome-des" gutterBottom>
            Empowering your voice in democracy with secure, informed, and engaging voting.
          </Typography>
        </div>

        {/* Filter Section */}
        <Paper elevation={3} className="filter-section" role="region" aria-labelledby="filter-heading">
          <Typography id="filter-heading" variant="h6" gutterBottom className="filter-heading">
            Filter Elections
          </Typography>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Date">
                  <DatePicker
                    style={{ width: '100%' }}
                    aria-label="Filter by start date"
                    onChange={(date, dateString) => setFilterDate(dateString)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Title">
                  <Input
                    placeholder="Enter election title"
                    aria-label="Filter by election title"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  <AntButton
                    type="primary"
                    aria-label="Apply election filters"
                    data-speak="Apply election filters"
                    onClick={handleApplyFilters}
                    block
                    style={{ marginTop: '30px', background:"#028391", color:"#01204E", fontWeight:"bold", fontSize:"1rem" }}
                    className='applyFiltersButton'
                  >
                    Apply Filters
                  </AntButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Paper>

        <Typography variant="h5" className="elections-title" gutterBottom id="elections-heading">
          <HowToVoteIcon /> Elections
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {elections.map((election) => {
              const titleId = `election-${election._id}-title`;
              const descId = `election-${election._id}-description`;
              const statusId = `election-${election._id}-status`;

              return (
                <Grid item key={election._id} xs={12} sm={6} md={4}>
                  <Card role="article" aria-labelledby={titleId} aria-describedby={`${descId} ${statusId}`} data-speak={`${election.title}. ${getStatus(election.startDate, election.endDate).text}`} className="election-card">
                    <CardContent>
                      <div className="card-header">
                        <Typography id={titleId} variant="h6" component="div" className="election-title">
                          {election.title}
                        </Typography>
                        <span 
                          id={statusId}
                          className={`status-badge status-${getStatus(election.startDate, election.endDate).text.toLowerCase()}`}
                          style={{
                            backgroundColor: getStatus(election.startDate, election.endDate).bgColor,
                            color: getStatus(election.startDate, election.endDate).color
                          }}
                          aria-live="polite"
                        >
                          {getStatus(election.startDate, election.endDate).text}
                        </span>
                      </div>
                      <Typography id={descId} variant="body2" color="text.secondary" className="election-description">
                        {election.description}
                      </Typography>
                      <div className="election-dates">
                        <div className="date-item">
                          <span className="date-label">Start Date</span>
                          <span className="date-value">{formatDate(election.startDate)}</span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">End Date</span>
                          <span className="date-value">{formatDate(election.endDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardActions>
                      <Link to={getStatus(election.startDate, election.endDate).text === 'Ended' ? `/electionsResult/${election._id}` : `/elections/${election._id}`} aria-label={getStatus(election.startDate, election.endDate).text === 'Ended' ? `View results for ${election.title}` : `View candidates for ${election.title}`} data-speak={getStatus(election.startDate, election.endDate).text === 'Ended' ? `View results for ${election.title}` : `View candidates for ${election.title}`}>
                        <Button size="small" color="primary" className='electionCardCnadidatesButton'>
                          {getStatus(election.startDate, election.endDate).text === 'Ended' ? 'View Results' : 'View Candidates'}
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Home;
