axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    console.log('-----发送ajax 请求前');
    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加全局响应拦截器
axios.interceptors.response.use(function(response) {
    console.log('-----发送ajax 响应前');
    // 对响应数据做点什么
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});