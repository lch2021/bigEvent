$(function() {
    //定义一个全局状态变量
    let state = ''
        // 提取组件
    const { form } = layui

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

    // 2. 初始化富文本编辑器
    initEditor()

    // 3. 先获取要裁剪的图片
    const $image = $('#image')

    // 4. 初始化裁剪区
    $image.cropper({
        // 指定宽高比
        aspectRatio: 400 / 280,
        // 指定预览区元素
        preview: '.img-preview',
        // 图片覆盖整个容器
        // viewMode: 3
    })

    // 5. 为选择封面按钮绑定点击事件
    $('#choose-btn').click(function() {

        // 自动触发文件框的点击事件
        $('#file').click()
        console.log(123);
    })

    // 6. 给文件选择框绑定change事件
    $('#file').change(function() {
        // 6.1 获取所有文件列表
        console.log(this.files[0])

        // 6.2 把文件转成 blob 格式的 url
        const imgUrl = URL.createObjectURL(this.files[0])

        // 6.2 替换掉裁剪区的图片
        $image.cropper('replace', imgUrl)
    })




    //7.整个表单提交 submit事件
    $('.publisch-form').submit(function(e) {
        e.preventDefault()
            //7.1 new 一个FormData
        const fd = new FormData(this)
            //7.2
        fd.forEach(item => { //遍历获取到的数据
            console.log(item);
        })

        //7.3 追加一条发布数据
        fd.append('state', state)

        //7.4
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {
            fd.append('cover_img', blob)
                //调用函数，提交数据到服务器
            publishArticle(fd)
        })
    })


    //8.点击发布按钮和存为草稿按钮，改变状态 state自定义属性
    $('.last-row button').click(function() {
        //获取自定义属性值
        console.log($(this).data('state'));
        state = $(this).data('state')
    })


    //9.在外层封装一个发布文章到服务器的函数，参数就是组装好得到 formdata 数据
    function publishArticle(fd) {
        axios.post('/my/article/add', fd).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('发布文章失败!')
            }
            layer.msg(state == '草稿' ? '存为草稿成功!' : '发布文章成功!')

            location.href = "./list.html"
            window.parent.$('.article-list').prev().find('a').cilck()
        })
    }
})