//Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

//Axios Imports
import axios from 'axios'

var response = {"data":[{"maxmem":16791883776,"maxcpu":4,"id":"node/pve4","cpu":0.252052859228101,"status":"online","uptime":13234,"node":"pve4","mem":10044264448,"disk":3400269824,"level":"","type":"node","maxdisk":41697148928},{"maxdisk":35668230144,"type":"node","level":"","uptime":13460,"cpu":0.275261593721971,"node":"pve1","status":"online","id":"node/pve1","disk":4123918336,"mem":9069383680,"maxcpu":4,"maxmem":12589027328},{"maxcpu":4,"maxmem":12589023232,"maxdisk":41691250688,"level":"","type":"node","uptime":13472,"cpu":0.319715411263182,"node":"pve2","status":"online","id":"node/pve2","disk":3399352320,"mem":10135912448},{"maxmem":8344236032,"maxcpu":16,"disk":3430567936,"mem":1623896064,"status":"online","cpu":0.00234485757036387,"uptime":13411,"node":"pve3","id":"node/pve3","maxdisk":100924641280,"type":"node","level":""}]}

export const clusterMetrics = createAsyncThunk('appDash/clusterMetrics', async () => {
  const response = await axios.get('http://127.0.0.1:4000/proxmox/cluster_metrics')
  return response.data
})

export const userCount = createAsyncThunk('appDash/userCount', async () => {
  const response = await axios.get('http://127.0.0.1:5000/users/count')
  return response.data
})

export const projectCount = createAsyncThunk('appDash/projectCount', async () => {
  const response = await axios.get('http://127.0.0.1:5000/projects/count')
  return response.data
})


export const appCount = createAsyncThunk('appDash/appCount', async () => {
  const response = await axios.get('http://127.0.0.1:5000/apps/count')
  return response.data
})


export const databaseCount = createAsyncThunk('appDash/databaseCount', async () => {
  const response = await axios.get('http://127.0.0.1:5000/projects/databases')
  return response.data
})

export const getLogs = createAsyncThunk('appDash/getLogs', async () => {
  const response = await axios.get('http://127.0.0.1:5000/logs/all_logs')
  return response.data
})

export const appDashSlice = createSlice({
  name: 'appDash',
  initialState: {
    clusters: 0,
    projects: 0,
    applications: 0,
    users: 0,
    databases: 0,
    //cluster_data: {},
    cluster_data: response.data,
    all_logs: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(clusterMetrics.fulfilled, (state, action) => {
        //state.cluster_data = action.payload.data.cluster_data.data 
        //console.log(action.payload)
      })
      .addCase(userCount.fulfilled, (state, action) => {
          state.users = action.payload.data.active + action.payload.data.inactive
      })
      .addCase(projectCount.fulfilled, (state, action) => {
          state.projects = action.payload.data.active + action.payload.data.inactive 
      })
      .addCase(appCount.fulfilled, (state, action) => {
          state.applications = action.payload.data.active + action.payload.data.inactive
      })
      .addCase(databaseCount.fulfilled, (state, action) => {
        //console.log(action.payload)
        state.databases = action.payload.data.databases
      })
      .addCase(getLogs.fulfilled, (state, action) => {
        state.all_logs = action.payload.data.app_logs.concat(action.payload.data.project_logs)
        state.all_logs = state.all_logs.concat(action.payload.data.user_logs).sort((a, b) => a.date_created.localeCompare(b.date_created)).reverse();
        //console.log(state.all_logs.length)
      })

  }
})

export default appDashSlice.reducer
