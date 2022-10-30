import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TopBar from "../../components/navigation/appbar";
import SideBar from "../../components/navigation/sidebar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Graph from "./Graph";
import Divider from "@mui/material/Divider";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import SearchIcon from '@mui/icons-material/Search';
import { MDBDataTable } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap-css-only/css/bootstrap.min.css';
import { clusterStatus, clusterLogs, clusterMetrics, clusterMachines, addLogs } from "./store";
import { Avatar } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { Hub } from "@mui/icons-material";
import { ButtonBase } from "@mui/material";
import Modal from '@mui/material/Modal';
import cluster from "../images/cluster.png";
import {
  PieChart,
  Pie,
  Tooltip,
  Sector,
  Cell,
  ResponsiveContainer
} from "recharts";

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


const style1 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '60%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  //height: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const date = new Date();
const month = parseInt(date.getMonth() + 1) < 10 ? "-0" + parseInt(date.getMonth() + 1) : "-" + parseInt(date.getMonth() + 1);
const day = date.getDate()  < 10 ? "-0" + date.getDate()  : "-" + date.getDate();
const today = date.getFullYear() + month + day;

const theme = createTheme();

function Infrastructure(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.infrastructure);
  const [uptime, setUptime] = React.useState([]);
  const [probability, setProbability] = React.useState(0);
  const [logs, setLogs] = React.useState([]);
  const [status, setStatus] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [vm_open, setVMOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [log_start, setLogStart] = React.useState('');
  const [log_end, setLogEnd] = React.useState('');
  const [log_min_date, setLogMinDate] = React.useState('');
  const [mem, setMem] = React.useState(0);
  const [maxmem, setMaxMem] = React.useState(0);
  const [disk, setDisk] = React.useState(0);
  const [maxdisk, setMaxDisk] = React.useState(0);
  const [cpu, setCPU] = React.useState(0);
  const [maxcpu, setMaxCPU] = React.useState(0);


  React.useEffect(() => {
    addStatusMetrics();
    dispatch(clusterLogs())
    dispatch(clusterMetrics())
    addLogs();

  }, [store.status.length, store.virtual_machines, store.cluster_data.length, store.cluster_logs.length, log_start, log_end])


  const handleClose = () => {
    setOpen(false);
  }
  

  const handleOpen = () => {
      setOpen(true);
  };

  
  const addStatusMetrics = () => {
    var status = [];
    var uptime = 0;
    var total = 0;
    var probability = 0;
           
    for (var i = 0; i < store.status.length; i++) {
      var  obj = {};

      if (store.status[i].status == "success") {
        uptime = uptime + 1;
      }

      obj.name = store.status[i].date_created;
      obj.value = store.status[i].status == "success" ? 1 : 0;
      status.push(obj);

      total++;
    }


    if (uptime > 0) {
      probability = (uptime / total) * 100;

    } else {
      probability = 0;

    }
    
    setUptime(status);
    setProbability(probability);
  }


  const addClusterData = (name) => {
    var mem_total = 0;
    var maxmem_total = 0;
    var disk_total = 0;
    var maxdisk_total = 0;
    var cpu_total = 0;
    var maxcpu_total = 0;

    for (var i = 0; i < store.cluster_data.length; i++) {
      if(store.cluster_data[i].id == name) {
        mem_total = mem_total + store.cluster_data[i].mem;
        maxmem_total =  maxmem_total + store.cluster_data[i].maxmem;
        disk_total =  disk_total + store.cluster_data[i].disk;
        maxdisk_total =  maxdisk_total + store.cluster_data[i].maxdisk;
        cpu_total =  cpu_total + store.cluster_data[i].cpu;
        maxcpu_total =  maxcpu_total + store.cluster_data[i].maxcpu;

        setStatus(store.cluster_data[i].status)
      }
    }

    setMem(mem_total);
    setMaxMem(maxmem_total);
    setDisk(disk_total);
    setMaxDisk(maxdisk_total);
    setCPU(cpu_total);
    setMaxCPU(maxcpu_total);
  }


  const handleVMClose = () => {      
      setVMOpen(false);
  }

  const handleVMOpen = () => {
    setVMOpen(true);
  };


  const memory = [
    {
      name: "used",
      value: mem
    },
    {
      name: "remaining",
      value: maxmem-mem
    }
  ];

  const disc = [
    {
      name: "used",
      value: disk
    },
    {
      name: "remaining",
      value: maxdisk-disk
    }
  ];


  const activity = [
    {
      name: "used",
      value: cpu
    },
    {
      name: "remaining",
      value: maxcpu-cpu
    }
  ];



  const addLogs = () => {
    var logs = [];
    
    for (var i = 0; i < store.cluster_logs.length; i++) {
      var date = new Date(store.cluster_logs[i].date_created).toLocaleDateString()
      if(!(date >= log_start && date <= log_end) && log_start != '' && log_end != '') {
        continue;
      }

      var log = {};

      log.cluster_name = store.cluster_logs[i].cluster_id;
      log.status = store.cluster_logs[i].status == "success" ? "online" : "offline";
      log.date_created = store.cluster_logs[i].date_created;
      
      logs.push(log);
    }

    setLogs(logs);

  }


//      setInterval(dispatch(addLogs()), 5000);

  const handleChange = (event) => {
    setName(event.target.value)

    addClusterData(event.target.value);

    dispatch(clusterStatus({
      cluster_id: event.target.value
    }))

    dispatch(clusterMachines({node_id : event.target.value.slice(5)}))
  }

  const setLogDate = (event) => {
    setLogMinDate(event.target.value)
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

     if (data.get("date1") && data.get("date2")) {
      setLogStart(new Date(data.get("date1")).toLocaleDateString());
      setLogEnd(new Date(data.get("date2")).toLocaleDateString());

    } else {
      setLogStart("");
    }
  };


  const COLORS = ['#0088FE', '#FFBB28'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  const cluster_logs = {
    columns: [
      {
        label: "Cluster Name",
        field: "cluster_name",
        sort: "asc",
        width: 150,
      },
      {
        label: "Status",
        field: "status",
        sort: "asc",
        width: 150,
      },
      {
        label: "Date Created",
        field: "date_created",
        sort: "asc",
        width: 100,
      }
    ],
    rows: logs
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
          <Container sx={{ mt: 2, mb: 4}}>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style1}>
                  <Graph data={uptime} title="Uptime" xaxis = {"Date"} yaxis = {"Status"}/>
              </Box>
            </Modal>

            <Grid container spacing={2}>
              <Grid
                item
                xs={3}
                mb={3}
                mt={4}
                ml={2}
                mr={4}
                component={Paper}
                elevation={4}
                sx={{ height: 200, pr: 2}}
              >
                <Typography sx={{ textAlign: "center", mb: 2, backgroundColor: "#008ac1", color: "#fff", borderRadius: 2}}>
                  <b>Select Clusters</b>
                </Typography>

                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Cluster</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    //value={age}
                    label="Clusters"
                   onChange={handleChange}
                    >
                    {store.clusters.map((value) => {
                      return (
                        <MenuItem value={value.name}>{value.name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {name ? 
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 3
                  }}
                  onClick={()=>handleVMOpen()}
                >View virtual machines</Button>: ""}
                <Modal
                  open={vm_open}
                  onClose={() => handleVMClose()}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style2}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    {name + " "} Virtual Machines.
                    </Typography>
                    <hr/>

                    {store.virtual_machines.map((item) => {
                      return(
                        <>
                          <Typography>Machine ID: {item.vmid}</Typography>
                          <Typography>Machine Name: {item.name}</Typography>
                          <Typography>Maximum Disk: {item.maxdisk / 1073741824}GB</Typography>
                          <Typography>Machine CPUS: {item.cpus}</Typography>
                          <Typography>Machine Status: {item.status}</Typography>
                          <hr/>
                        </>
                      );
                    })}

                    <Button variant = "outlined" sx={{mt:4}} onClick = {() => handleVMClose()}>Close</Button>
                  </Box>
                </Modal>


                {/*<Typography sx={{textAlign: "center", mt: 2, mb: 2, backgroundColor: "#008ac1", color: "#fff", borderRadius: 2}}>
                  <b>Create Nodes</b>
                  </Typography>*/}
              </Grid>

              <Grid                 
                item
                xs={8}
                mb={3}
                mt={2}
              >
                <Card>
                  <Box
                    sx={{
                      fontSize: 10,
                      display: "flex",
                      backgroundColor: "#008ac1",
                      paddingLeft: 3,
                    }}
                  >
                    <Typography sx={{ flexGrow: 1, fontSize: 17, color: "#fff" }}>
                      <b>Cluster{"  "+ name}</b>
                    </Typography>
                    <Hub sx={{ color: "#fff", marginRight: 2 }} />
                  </Box>

                  {name ? 
                  <CardContent>
                      <Grid container>
                        {/*<Typography sx={{ fontSize: 15, marginLeft: 5, marginRight: 3 }}>
                          <b>Nodes: </b>
                          <em className="text-secondary" style={{ fontSize: 22 }}>
                            <b>{cluster.node}</b>
                          </em>
                          {""}
                        </Typography>*/}
                        <Typography sx={{ fontSize: 15,  marginLeft: 5, marginRight: 3 }}>
                          <b>Active Nodes: {store.count}</b>
                          <span className="text-primary" style={{ fontSize: 18 }}>
                            {" "}
                          </span>
                        </Typography>
                        <Typography sx={{ fontSize: 15, marginRight: 3 }}>
                          <b>Probability of uptime:</b>
                          <span className="text-info" style={{ fontSize: 18 }}>
                            {" "}
                            <b>{probability.toFixed(2)}%</b>{" "}
                          </span>
                        </Typography>
                        <Typography sx={{ fontSize: 15, marginRight: 3 }}>
                          <b>Status:</b>
                          {" "}
                          <span className={status == "online" ? "text-success" : "text-danger"} style={{ fontSize: 18 }}>
                            <b>{status}</b>
                          </span>
                        </Typography>
                      </Grid>

                      <Grid container>
                        <Grid item xs ={6} mt={2} mb={2}>
                          <ButtonBase component = "div">
                            <Paper
                              sx={{
                                height: 160,
                                width: 300,
                              }}
                              onClick={() => handleOpen()}
                            >
                              <Graph data={uptime} title="Availability" xaxis = {"Date"} yaxis = {"Status"}/>
                            </Paper>
                          </ButtonBase>
                        </Grid>

                        <Grid item xs ={6} mt={2} mb={2}>
                          <ButtonBase component = "div">
                            <Paper
                              sx={{
                                height: 200,
                                width: 300,
                              }}
                              onClick={() => {}}
                            >
                              <ResponsiveContainer width="100%" height="85%">
                                <PieChart width={200} height={400}>
                                  <Pie
                                    data={memory}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {memory.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                              <Typography sx={{ textAlign: "center", fontSize: 15 }}>
                                Memory Usage
                              </Typography>
                            </Paper>
                          </ButtonBase>
                        </Grid>
                      </Grid>

                      <Grid container>
                        {" "}
                        <Grid item xs ={6} mt={2} mb={2}>
                          <ButtonBase component = "div">
                            <Paper
                              sx={{
                                height: 200,
                                width: 300,
                              }}
                              onClick={() => {}}
                            >
                              <ResponsiveContainer width="100%" height="85%">
                                <PieChart width={800} height={400}>
                                  <Pie
                                    data={activity}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {activity.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                              <Typography sx={{ textAlign: "center", fontSize: 15 }}>
                                CPU Usage
                              </Typography>
                            </Paper>
                          </ButtonBase>
                        </Grid>
                        <Grid item xs ={6} mt={2} mb={2}>
                          <ButtonBase component = "div">
                            <Paper
                              sx={{
                                height: 200,
                                width: 300,
                              }}
                              onClick={() => {}}
                            >
                              <ResponsiveContainer width="100%" height="85%">
                                <PieChart width={800} height={400}>
                                  <Pie
                                    data={disc}
                                    //cx={120}
                                    //cy={200}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {disc.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                              <Typography sx={{ textAlign: "center", fontSize: 15 }}>
                                Disk Usage
                              </Typography>
                            </Paper>
                          </ButtonBase>
                        </Grid>
                      </Grid>
                  </CardContent>
                  : 
                  <CardContent sx={{ height: 300}}>
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Avatar
                        variant="square"
                        sx={{ mt: 6, width: 100, height: 100 }}
                        alt="clusters"
                        src={cluster}
                      />
                      <Typography sx = {{mt: 2,color: "#e6e6e6"}}>Please select a cluster.</Typography>
                    </Stack>
                  </CardContent> }
                </Card>
              </Grid>
            </Grid>

            <Card sx={{ marginTop: 3 }}>
              <Box
                sx={{
                  fontSize: 10,
                  display: "flex",
                  backgroundColor: "#008ac1",
                  paddingLeft: 3,
                }}
              >
                <Typography sx={{ flexGrow: 1, fontSize: 17, color: "#fff" }}>
                  <b>Recent Activity</b>
                </Typography>
                <LocalActivityIcon sx={{ color: "#fff", marginRight: 2 }} />
              </Box>
              <CardContent>
                <Box 
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}              
                  sx={{mb: 2, mt: 2}}>
                  <TextField
                    name="date1"
                    label="Start"
                    type="date"
                    //defaultValue="2017-05-24"
                    onChange={setLogDate}
                    sx={{ width: 220 }}
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}

                    inputProps={{
                      max: today
                    }}
                  />
                  <TextField
                    name="date2"
                    label="End"
                    type="date"
                    //defaultValue="2017-05-24"
                    disabled = {log_min_date ? false : true}
                    size="small"
                    sx={{ width: 220, ml: 2, height: 20}}
                    InputLabelProps={{
                      shrink: true,
                    }}

                    inputProps={{
                      min: log_min_date,
                      max: today
                    }}
                  />
                  <Button type="submit" variant="outlined" sx={{ mt: 0.1, ml: 2 }} startIcon={<SearchIcon />}>Filter</Button>
                </Box>
                <MDBDataTable striped bordered small  data = {cluster_logs}/>
              </CardContent>
            </Card>

            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Infrastructure;