import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { adjustDrawer } from './store';
import CustomizedMenu from './menu';

const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const theme = createTheme();

function TopBar() {
  const dispatch = useDispatch();
  const store = useSelector(state => state.navigation)


  const toggleDrawer = () => {
    dispatch(adjustDrawer({open: true}));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar sx = {{backgroundColor: '#fff'}} position="absolute" open={store.open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            
            <IconButton ur wathy 
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(store.open && { display: 'none' }),
              }}
            >
              <MenuIcon sx ={{color: "#000"}}/>
            </IconButton>
            <svg width="50" height="30"  xmlns="http://www.w3.org/2000/svg" >
                <path d="M41.3027 11.8166C40.3089 11.8162 39.3227 11.9882 38.3877 12.3251C36.5684 5.23677 30.1385 0 22.4851 0C14.1189 0 7.21963 6.2587 6.20193 14.3486C4.47166 14.628 2.89737 15.5142 1.76098 16.8486C0.624592 18.1829 0.000333384 19.8782 0 21.6309C0 25.5746 3.09291 28.8226 6.98744 28.998C9.65921 29.1183 12.2471 27.882 15.1222 26.0322C16.9653 24.8458 19.6574 22.5893 19.6574 22.5893C19.6574 22.5893 18.2312 22.9376 17.7932 23.0223C16.6356 23.2452 15.5544 23.0808 14.6164 21.7512L18.8405 20.5708L14.7867 20.8251C14.5135 20.8564 14.237 20.8125 13.987 20.6981C13.737 20.5837 13.523 20.4032 13.3682 20.176C13.1502 19.8533 12.9592 19.5132 12.797 19.1591L17.8931 19.2278L13.3868 18.4651C13.0879 18.4249 12.8074 18.2981 12.5798 18.1002C12.3523 17.9023 12.1877 17.6421 12.1064 17.3517C12.0039 16.9856 12.0056 16.7924 11.937 16.4196L16.6323 17.4254L12.7487 15.973C12.4579 15.871 12.2041 15.6846 12.0197 15.4377C11.8352 15.1908 11.7285 14.8945 11.7132 14.5867C11.6861 14.1028 11.7073 13.7478 11.7217 13.2834L16.3823 16.0306L13.5012 13.5648C11.748 12.0641 12.009 10.5066 12.3335 8.95928C12.5708 7.99921 12.7869 7.40944 12.7869 7.40944C12.7869 7.40944 13.7376 10.1159 15.7527 13.0928C15.7529 13.0959 15.7529 13.099 15.7527 13.1021C15.7527 13.1021 17.3491 15.6442 18.4211 16.5128C18.4211 16.5128 16.9695 14.5121 16.0255 12.2683C15.1722 10.2397 14.8172 8.61017 15.5959 7.21793C15.5959 7.21793 20.387 21.4775 27.6049 19.1659C28.393 18.9117 29.9775 17.4432 31.002 14.896C30.3123 14.9655 28.298 15.3197 28.298 15.3197C28.298 15.3197 27.4998 11.1074 32.2544 10.9803L31.979 13.7876C32.407 13.5792 32.973 13.4826 33.6797 13.8563C35.0686 13.2826 36.0464 13.4504 36.0464 13.4504C31.3901 15.5298 29.7369 20.492 25.0306 24.029C22.9655 25.5814 21.5004 25.8483 18.4414 26.3398C15.1748 26.8643 14.3232 29.0192 16.6034 29.0107C16.6136 29.0107 39.7198 29.042 41.2985 29.042C42.4371 29.0533 43.5666 28.8388 44.6218 28.4109C45.6771 27.983 46.637 27.3502 47.4461 26.549C48.2553 25.7478 48.8976 24.7942 49.3359 23.7433C49.7743 22.6924 50 21.565 50 20.4264C50 19.2877 49.7743 18.1603 49.3359 17.1094C48.8976 16.0585 48.2553 15.1049 47.4461 14.3037C46.637 13.5026 45.6771 12.8697 44.6218 12.4418C43.5666 12.0139 42.4371 11.7994 41.2985 11.8107L41.3027 11.8166Z" fill="#008AC1"></path></svg>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, marginLeft: 2, color: "#000"}}
            >
              Crane Cloud
            </Typography>
            <CustomizedMenu/>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}

export default TopBar;
