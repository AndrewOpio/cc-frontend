//Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

//Axios Imports
import axios from 'axios'

var response = {"data":[{"maxmem":16791883776,"maxcpu":4,"id":"node/pve4","cpu":0.252052859228101,"status":"online","uptime":13234,"node":"pve4","mem":10044264448,"disk":3400269824,"level":"","type":"node","maxdisk":41697148928},{"maxdisk":35668230144,"type":"node","level":"","uptime":13460,"cpu":0.275261593721971,"node":"pve1","status":"online","id":"node/pve1","disk":4123918336,"mem":9069383680,"maxcpu":4,"maxmem":12589027328},{"maxcpu":4,"maxmem":12589023232,"maxdisk":41691250688,"level":"","type":"node","uptime":13472,"cpu":0.319715411263182,"node":"pve2","status":"online","id":"node/pve2","disk":3399352320,"mem":10135912448},{"maxmem":8344236032,"maxcpu":16,"disk":3430567936,"mem":1623896064,"status":"online","cpu":0.00234485757036387,"uptime":13411,"node":"pve3","id":"node/pve3","maxdisk":100924641280,"type":"node","level":""}]}

export const clusterStatus = createAsyncThunk('appInfrastructure/clusterStatus', async (data) => {
    const response = await axios.post('http://127.0.0.1:4000/status', data)
    return response.data
})

export const clusterLogs = createAsyncThunk('appInfrastructure/clusterLogs', async () => {
  const response = await axios.get('http://127.0.0.1:4000/status/cluster_data')
  return response.data
})

export const clusterMetrics = createAsyncThunk('appDash/clusterMetrics', async () => {
  const response = await axios.get('http://127.0.0.1:4000/proxmox/cluster_metrics')
  return response.data
})

export const addLogs = createAsyncThunk('appDash/addLogs', async () => {
  const response = await axios.get('http://127.0.0.1:4000/proxmox/cluster_metrics')
  return response.data
})

export const clusterMachines = createAsyncThunk('appDash/clusterMachines', async (data) => {
  const response = await axios.post('http://127.0.0.1:4000/proxmox/cluster_metrics/machine', data)
  return response.data
})

export const appInfrastructureSlice = createSlice({
  name: 'appInfrastructure',
  initialState: {
    status: [],
    cluster_logs: [],
    clusters: [],
    //cluster_data: {},
    cluster_data: response.data,
    virtual_machines: [],
    count: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(clusterStatus.fulfilled, (state, action) => {
        state.status = action.payload.data.logs
        //console.log(action.payload)
      })
      .addCase(clusterLogs.fulfilled, (state, action) => {
        state.cluster_logs = action.payload.data.logs.reverse()
        state.clusters = action.payload.data.clusters
        //console.log(action.payload)
      })
      .addCase(clusterMetrics.fulfilled, (state, action) => {
       // state.cluster_data = action.payload.data.cluster_data.data 
        //console.log(action.payload)
      })
      .addCase(clusterMachines.fulfilled, (state, action) => {
        state.count = action.payload.data.vm_data.data.length
        state.virtual_machines = action.payload.data.vm_data.data 
        //console.log(state.virtual_machines)
      })
  }
})

export default appInfrastructureSlice.reducer
