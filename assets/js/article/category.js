$(function() {

    const { form } = layui
    let index
        //1.从服务器获取文章列表数据，并渲染到页面（封装成一个函数）
    getCateList()

    function getCateList() {
        // 1.1 发送请求
        axios.get('/my/article/cates').then(res => {
            console.log(res);

            //1.2 判断请求失败
            if (res.status !== 0) {
                return layer.msg('获取分类列表失败!')
            }

            //1.4 请求成功 todo
            //使用模板引擎渲染页面：1.引入插件 2.准备一个模板 3.调用一个模板函数 template(id, 数据对象)
            const htmlStr = template('tpl', res)
            console.log(htmlStr);

            //1.5 渲染添加到页面里的tbdoy
            $('tbody').html(htmlStr)

        })
    }




    //2.点击添加按钮，添加一个文章分类
    $('.add-btn').click(function() {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('.add-form-container').html() //这里content是一个普通的String
        });
    })



    //3.监听添加表单的提交事件
    //事件委托，点击过后添加的
    $(document).on('submit', '.add-form', function(e)  {        
        e.preventDefault()

        axios.post('/my/article/addcates', $(this).serialize()).then(res => {
            console.log(res);

            if (res.status !== 0) {
                return ('提交失败!')
            }
            layer.msg('添加分类成功!')
            layer.close(index)

            getCateList()
        })
    })

    //4.1 点击过后 弹出一个编辑的窗口
    $(document).on('click', '.edit-btn', function() {
        console.log('编辑');

        index = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('.edit-form-container').html()
        })

        //4.2获取自定义属性的id值
        console.log($(this).data('id'));
        const id = $(this).data('id')

        //4.3发送axios 请求到服务器，获取当前的分类数据
        axios.get(`/my/article/cates/${id}`).then(res => {
            console.log(res);

            if (res.status !== 0) {
                console.log('获取失败!');
            }


            form.val('edit-form', res.data);
        })

    })

    //5.修改编辑
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()

        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            console.log(res);
            if (res.status !== 0) {
                console.log('修改分类成功!');
            }

            layer.close(index)

            getCateList()
        })

    })


    //6.
    $(document).on('click', '.del-btn', function() {
        //4.2获取自定义属性的id值
        console.log($(this).data('id'));
        const id = $(this).data('id')

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something

            axios.get(`/my/article/deletecate/${id}`).then(res => { //layui 里的询问插件
                console.log(res);
                if (res.status !== 0) {
                    console.log('删除失败!');
                }
                layer.msg('删除成功成功!')
                getCateList() //重新渲染
            })
            layer.close(index); //关闭弹出层

        });
    })






})