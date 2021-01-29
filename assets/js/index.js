$(function() {

    const { layer } = layui


    // 1. 获取用户的个人信息
    function getUserInfo() {

        // 发送 ajax 请求
        axios.get('/my/userinfo').then(res => {
            console.log(res)

            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }

            const { data } = res
            //渲染用户信息
            //1.获取信息
            const name = data.nickname || data.username

            //2.渲染昵称
            $('nickname').text(`欢迎${name}`)

            //3.渲染头像
            if (data.user_pic) {
                $('.text-avatar').prop('src', data.user_pic).show()
                $('.text-avatar').hide()
            } else {
                $('.text-avatar').text(name[0].toUpperCase()).show()
                $('.avatar').hide()
            }

        })
    }

    getUserInfo()



    $('#logout').click(function() {
        //请求接口(模拟)
        //1.清除本地令牌 强制退出 权限
        localStorage.removeItem('token')

        //2.跳转到登录页
        localStorage.herf = './login.html'
    })



















})