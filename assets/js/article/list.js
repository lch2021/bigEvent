$(function() {
    const { form, laypage } = layui

    // 1. 从服务器获取文章的分类列表数据
    getCateList()

    function getCateList() {
        // 1.2 发送请求
        axios.get('/my/article/cates').then(res => {
            console.log(res)
                // 1.3 判断请求是否失败
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            // 1.4 遍历数组, 渲染下拉组件的选项
            res.data.forEach(item => {
                // 每遍历一次向下拉选择框中追加一条 option
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            })

            // 1.5 坑: 动态创建的表单元素需要手动更新表单
            form.render('select')
        })
    }

    // 2. 定义一个查询对象
    const query = {
        pagenum: 1, // 表示当前的页码值, 第几页
        pagesize: 5, // 表示每页显示多少条数据
        cate_id: '', // 表示文章的分类 id
        state: '' // 表示文章的状态
    }

    // 3. 发送请求到服务器, 获取文章列表数据
    renderTable()

    function renderTable() {
        // 3.1 发送请求
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            // 3.2 使用模板引擎来渲染 
            const htmlStr = template('tpl', res)
                // console.log(htmlStr)

            // 3.3 添加到 tbody 中
            $('tbody').html(htmlStr)

            // 3.4 渲染分页器
            renderPage(res.total)
        })
    }

    // 4.
    function renderPage(total) {
        laypage.render({
            elem: 'pagination',
            count: total,
            limit: query.pagesize,
            limits: [2, 3, 4, 5],
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                query.pagenum = obj.curr
                query.pagesize = obj.limit
                    //首次不执行
                if (!first) {
                    renderTable() // 非首次进入页面，需要重新渲染
                }
            }

        })
    }

    // 5. 表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault()


        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()
        console.log(cate_id, state)


        query.cate_id = cate_id
        query.state = state

        renderTable()
    })


    //6.
    $(document).on('click', '.del-btn', function(e)  {        
        e.preventDefault()

        console.log($(this).data('id'));
        const id = $(this).data('id')
            //6.2
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //6.3
            axios.get(`/my/article/delete/${id}`).then(res => { //layui 里的询问插件
                console.log(res);
                if (res.status !== 0) {
                    console.log('删除失败!');
                }
                layer.msg('删除成功成功!')

                //6.5 填坑 这个页面当前页面只剩一条 
                if ($('.de;-btn').length == 1 && query.pagenum !== 1) {
                    query.pagenum--
                }
                //6.4
                renderTable() //重新渲染
            })
            layer.close(index); //关闭弹出层

        });
    })
})