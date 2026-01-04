import React, { useState, useEffect } from 'react';
import "./navBar.scss";
import { Link, useNavigate } from 'react-router-dom';
import {
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Home as HomeIcon } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

//context
import { useAuth } from '../../AuthContext';

const NavBar = () => {
    const { logout } = useAuth();

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [highContrast, setHighContrast] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('youvote-theme') === 'high-contrast';
    });
    const [fontSize, setFontSize] = useState(() => {
        if (typeof window === 'undefined') return 100;
        const saved = localStorage.getItem('youvote-font-size');
        return saved ? parseInt(saved) : 100;
    });

    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (highContrast) {
            document.documentElement.setAttribute('data-theme', 'high-contrast');
            localStorage.setItem('youvote-theme', 'high-contrast');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('youvote-theme', 'light');
        }
    }, [highContrast]);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        document.documentElement.style.fontSize = `${fontSize}%`;
        localStorage.setItem('youvote-font-size', fontSize.toString());
    }, [fontSize]);

    const increaseFontSize = () => {
        setFontSize(prev => Math.min(prev + 10, 150)); // Max 150%
    };

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(prev - 10, 80)); // Min 80%
    };

    const resetFontSize = () => {
        setFontSize(100);
    };

    const handleLogout = () => {
    logout();
    navigate('/');
    };

    const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
    setAnchorEl(null);
    };
    return (
        <Toolbar component="nav" disableGutters aria-label="Primary navigation">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/home" style={{display:"flex", justifyContent: "center"}} aria-label="YouVote home">
                <img className="navbarLogo" src="/img/YouVoteLogoSmallVersionCircular.png" alt="YouVote logo" />
            </Link>
            </Typography>
            <div className="navbar-links">
            <Link to="/home" color="inherit" className="nav-link" aria-label="Go to home" data-speak="Home" sx={{ marginRight: 2 }}><HomeIcon style={{fontSize: "1.7rem", marginBottom: "2px"}} /> <p>Home</p></Link>
            <Link to="/security" color="inherit" className="nav-link" aria-label="Go to security" data-speak="Security" sx={{ marginRight: 2 }}><LockIcon style={{marginBottom: "2.5px"}} /> <p>Security</p></Link>
            <Link to="/calendar" color="inherit" className="nav-link" aria-label="View election calendar" data-speak="Election calendar" sx={{ marginRight: 2 }}><CalendarMonthIcon style={{marginBottom: "2px"}} /> <p>Calendar</p></Link>
            <Link to="/history" color="inherit" className="nav-link" aria-label="View voting history" data-speak="Voting history" sx={{ marginRight: 2 }}><HistoryIcon style={{fontSize: "1.7rem", marginBottom: "2px"}} /> <p>History</p></Link>
            <Link to="/profile" color="inherit" className="nav-link" aria-label="View profile" data-speak="Profile" sx={{ marginRight: 2 }}><AccountBoxIcon /> <p>Profile</p></Link>
            <Button className='navbar-button' color="inherit" onClick={handleLogout} aria-label="Log out of your account" data-speak="Logout">Logout</Button>
                        <div className="nav-contrast-toggle" aria-label="High contrast theme toggle" data-speak={highContrast ? 'Disable high contrast' : 'Enable high contrast'}>
                            <Switch
                                checked={highContrast}
                                onChange={(e) => setHighContrast(e.target.checked)}
                                inputProps={{ 'aria-label': 'Toggle high contrast theme' }}
                            />
                            <p>{highContrast ? 'High Contrast: On' : 'High Contrast: Off'}</p>
                        </div>
                        <div className="nav-font-controls" aria-label="Font size controls">
                            <Tooltip title="Decrease font size">
                                <IconButton 
                                    onClick={decreaseFontSize}
                                    disabled={fontSize <= 80}
                                    size="small"
                                    aria-label="Decrease font size"
                                    data-speak="Decrease text size"
                                >
                                    <TextDecreaseIcon />
                                </IconButton>
                            </Tooltip>
                            <span className="font-size-label">{fontSize}%</span>
                            <Tooltip title="Increase font size">
                                <IconButton 
                                    onClick={increaseFontSize}
                                    disabled={fontSize >= 150}
                                    size="small"
                                    aria-label="Increase font size"
                                    data-speak="Increase text size"
                                >
                                    <TextIncreaseIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset font size">
                                <IconButton 
                                    onClick={resetFontSize}
                                    size="small"
                                    aria-label="Reset font size to default"
                                    data-speak="Reset text size"
                                >
                                    <RestartAltIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
            </div>
            <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            onClick={handleMenuOpen}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            >
            <MenuIcon />
            </IconButton>
            <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{ 'aria-label': 'Mobile navigation' }}
            >
            <MenuItem onClick={handleMenuClose}><Link to="/home" color="inherit" className="nav-link">Home</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/security" color="inherit" className="nav-link">Security</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/calendar" color="inherit" className="nav-link">Calendar</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/history" color="inherit" className="nav-link">History</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/profile" color="inherit" className="nav-link">Profile</Link></MenuItem>
            <MenuItem onClick={handleLogout}><Typography color="inherit">Logout</Typography></MenuItem>
            </Menu>
        </Toolbar>
    )
}

export default NavBar