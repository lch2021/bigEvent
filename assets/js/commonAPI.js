axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    console.log('-----发送ajax 请求前');


    //在发送请求之前判断是否有/my 开头的请求路径
    //如果有，手动添加headers 请求头
    console.log(config.url);
    const token = localStorage.getItem('token') || ''
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token
    }


    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加全局响应拦截器
axios.interceptors.response.use(function(response) {
    console.log('-----发送ajax 响应前');

    const { message, status } = response.data

    if (message == '身份认证失败!' && status == 1) {
        location.href = './login.html'
    }



    // 对响应数据做点什么
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});