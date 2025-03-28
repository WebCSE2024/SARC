import axios from "axios";

// const baseURL = 'http://192.168.128.148:8000/sarc/v0/api'
const baseURL = 'http://localhost:8000/sarc/v0/api'

//  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

 const axiosInstance = axios.create({
  baseURL,
//   headers: {
//    //   Authorization: user && user.token ? `Bearer ${user.token}` : ''
//   }
});

export default axiosInstance
