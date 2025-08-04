import axios from 'axios';

const api = axios.create()

// 기본 url 설정
api.defaults.baseURL = '/api'

export default api;