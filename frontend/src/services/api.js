import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
})


export default API