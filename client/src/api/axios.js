import axios from 'axios'

// BASEURL
// const BASE_URL = 'http://localhost:5000/api/v1/transportation_system/';
// const BASE_URL = 'https://lighte-ticket.com/api/v1/transportation_system/'

const BASE_URL = 'http://localhost:5000/api/';
// const BASE_URL = 'https://lighte-ticket.com/api/'


export default axios.create({
    baseURL:BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL:BASE_URL,
    headers:{'Content-Type':'application/json'},
    withCredentials:true
})