// 显示选择的图片
$('#upload').change(function () {
    let image = this.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function () {
        $('#choose-img').attr('src', this.result);
    }
});


// 显示选择的风格图片
$('#choice').change(function () {
    let img_path = '/static/img/' + $('#choice').val() + '.png';
    $('#style-img').attr('src', img_path);
});


// 上传生成图片
$('#submit').click(function () {
    let formData = new FormData();
    let image = $('#upload')[0].files[0];
    let choice = $('#choice').val();
    formData.append('image', image);
    formData.append('choice', choice);

    $.ajax({
        url: 'upload-image/',
        type: 'POST',
        dataType: "json",//预期服务器返回的数据类型
        data: formData,
        processData: false,
        contentType: false,

        success: function (data) {
            console.log(data['message']);

            if (data['status'] == '0') {
                let path = '/static/result/';
                $('#result-img').attr('src', path + data['result'])
            }
        },

        error: function () {

        },
    });
});
