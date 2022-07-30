import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled, alpha } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import TopBar from "../../components/navigation/appbar";
import SideBar from "../../components/navigation/sidebar";
import { MDBDataTable } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap-css-only/css/bootstrap.min.css';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from '@mui/icons-material/Delete';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import RestoreIcon from '@mui/icons-material/Restore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjects, projectStatus, setStatus, projectCount, appCount } from "./store";
import Cookies from 'universal-cookie'


function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Crane Cloud
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


export default function Project() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies()
  const store = useSelector((state) => state.projects);
  const [projects, setProjects] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl); 
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const projStatus = (id, status) => {
    dispatch(
       projectStatus({
        id: id,
        status: status
       })
    );

    setAnchorEl(null);
  };

  React.useEffect(() => {
     dispatch(projectCount())
     dispatch(appCount())
     dispatch(getProjects())

     addProjects();


  }, [store.projects.length, store.project_status, anchorEl])


  const projectDetails = (name, owner_id, project_id, date_created, status) => {
      var project_data = {
        project_id: project_id,
        owner_id: owner_id,
        name: name,
        date_created: date_created,
        status: status
      }
      cookies.set('project_data', project_data, { path: '/' })

      navigate("/applications")
  }

  const addProjects = () => {
    var projects = [];
           
    for (var i = 0; i < store.projects.length; i++) {
      var project = {};

      let name = store.projects[i].name;
      let owner_id = store.projects[i].owner_id;
      let id = store.projects[i].id;
      let date_created = store.projects[i].date_created;
      let status = store.projects[i].status;

      project.name = <Link
       onClick={() => 
          projectDetails(
            name, 
            owner_id, 
            id, 
            date_created,
            status
          )
       }
       >{store.projects[i].name}</Link>;
      project.description = store.projects[i].description;
      project.organisation = store.projects[i].organisation;
      project.date_created = store.projects[i].date_created;
      project.status = store.projects[i].status == 1? <Chip label="active" color="success"/> : store.projects[i].status == 0? <Chip label="inactive" /> : <Chip label="deleted" color="error"/>;
      project.actions = <>
      <MoreVertIcon   
        onClick={handleClick}              
      />
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => projStatus(id, 1)} disableRipple>
          <RestoreIcon/>
          Activate
        </MenuItem>
        <MenuItem onClick={() => projStatus(id, 0)} disableRipple>
          <UnpublishedIcon/>
          Disable
        </MenuItem>
        <MenuItem onClick={() => projStatus(id, 5)} disableRipple>
          <DeleteIcon />
          Delete
        </MenuItem>
      </StyledMenu>
    </>;
      
      projects.push(project);
    }

    setProjects(projects);
  }


  const data = {
    columns: [
      {
        label: "Name",
        field: "name",
        sort: "asc",
        width: 150,
      },
      {
        label: "Description",
        field: "description",
        sort: "asc",
        width: 200,
      },
      {
        label: "Organisation",
        field: "organisation",
        sort: "asc",
        width: 200,
      },
      {
        label: "Date Created",
        field: "date_created",
        sort: "asc",
        width: 150,
      },
      {
        label: "Status",
        field: "status",
        sort: "asc",
        width: 100,
      },
      {
        label: "Actions",
        field: "actions",
        sort: "asc",
        width: 100,
      },
    ],
    rows: projects
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar />
        <SideBar />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container sx={{ mt: 2, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={1} sm={1} md={1} lg={2}></Grid>
              <Grid item xs={12} sm={2} md={2} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    height: 160,
                    paddingTop: 5,
                    ":hover": {
                      boxShadow: 5,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: 20 }}>Projects</Typography>
                    <Typography sx={{ fontSize: 30 }}>{parseInt(store.active_projects) + parseInt(store.inactive_projects)}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 16, flexGrow: 1, color: "green" }}
                    >
                      Active: <span>{store.active_projects}</span>
                    </Typography>
                    <Typography
                      sx={{ fontSize: 16, float: "right", color: "red" }}
                    >
                      Disabled: <span>{store.inactive_projects}</span>
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={2} md={2} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    height: 160,
                    paddingTop: 5,
                    ":hover": {
                      boxShadow: 5,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: 20 }}>Applications</Typography>
                    <Typography sx={{ fontSize: 30 }}>{parseInt(store.active_apps) + parseInt(store.inactive_apps)}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 16, flexGrow: 1, color: "green" }}
                    >
                      Active: <span>{store.active_apps}</span>
                    </Typography>
                    <Typography
                      align="right"
                      sx={{ fontSize: 16, color: "red" }}
                    >
                      Disabled: <span>{store.inactive_apps}</span>
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={1} sm={1} md={1} lg={2}></Grid>
            </Grid>

            <Card sx={{ marginTop: 3 }}>
              <Box
                sx={{
                  fontSize: 10,
                  display: "flex",
                  backgroundColor: "#008ac1",
                  paddingLeft: 2,
                }}
              >
                <Typography sx={{ flexGrow: 1, fontSize: 17, color: "#fff" }}>
                  <b>Projects</b>
                </Typography>
                <FolderIcon sx={{ color: "#fff", marginRight: 2 }} />
              </Box>
              <CardContent>
                <MDBDataTable striped bordered small data={data} />
              </CardContent>
            </Card>
            <Copyright sx={{ pt: 4, mb: 4, bottom:0, width:"100%", height:60}} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
