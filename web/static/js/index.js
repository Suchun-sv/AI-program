// 显示选择的图片
let flag = 0;

$('#upload').change(function () {
    let image = $('#upload')[0].files[0];
    let reader = new FileReader();
    let img_url;

    reader.readAsDataURL(image);
    reader.onload = function () {
        img_url = this.result;
    };

    if (flag != 0) {
        $('#choose-img').fadeOut('slow', function () {
            $('#choose-img').attr('src', img_url);
            $('#choose-img').fadeIn('slow');
        });

        // $('#choose-img-div').animate({height: '0px'}, "slow", function () {
        //     $('#choose-img').attr('src', img_url);
        // });
    } else {
        flag = 1;
        reader.onload = function () {
            $('#choose-img').attr('src', this.result);
        };
        $('#choose-img-div').animate({height: '300px'}, "slow");
        $('#choose-img').show('slow');
    }

});


// 显示选择的风格图片
$('#choice').change(function () {
    let img_path = '/static/img/' + $('#choice').val() + '.jpg';
    $('#style-img').attr('src', img_path);
});

// 点击选择风格图片来选择显示
$('.thumbnail').click(function () {
    let img_path = $(this).find('img')[0].src;

    if ($('#choice').val() == $(this).attr('name')) {
        return;
    }

    if ($('#choice').val() != "") {
        $('#style-img').animate({height: '0px', width: '0px'}, "slow", function () {
            $('#style-img').attr('src', img_path);
            $('#style-img').animate({height: '100%', width: '100%'}, 'slow')
        });
    } else {
        $('#style-img').attr('src', img_path);
        $('#style-img-div').animate({height: '300px'}, "slow");
        $('#style-img').animate({height: '100%', width: '100%'}, 'slow');
    }

    $('#choice').val($(this).attr('name'));

});


// 读取上传进度
function xhrOnProgress() {
    let myXhr = $.ajaxSettings.xhr();
    if (myXhr.upload) {

        myXhr.upload.onloadstart = function (e) {
            $('.progressOne').show();
        };

        myXhr.upload.onprogress = function (e) {
            let loaded = e.loaded;//已经上传大小情况
            let tot = e.total;//附件总大小
            let per = Math.floor(100 * loaded / tot);  //已经上传的百分比

            $(".progressOne-bar").css("width", per + "%");
            $(".progressOne-bar").attr('aria-valuenow', per);
            $(".progressOne-bar").text(per + "%");

            console.log('已经上传大小 = ' + loaded);
            console.log('附件总大小 = ' + tot);
        };

        myXhr.upload.onloadend = function (e) {
            $('.progressOne').hide();
            $('.progressTow').show();
            $(".progressTow-bar").text('生成图片中');
            $(".progressOne-bar").css("width", 0);
        };
    }
    return myXhr;
}


// 上传生成图片
$('#submit').click(function () {

    let formData = new FormData();
    let image = $('#upload')[0].files[0];
    let choice = $('#choice').val();
    let msg = $('#msg');
    formData.append('image', image);
    formData.append('choice', choice);


    $.ajax({
        url: 'upload-image/',
        type: 'POST',
        cache: false,
        dataType: "json",//预期服务器返回的数据类型
        data: formData,
        processData: false,
        contentType: false,
        xhr: xhrOnProgress,

        success: function (data) {
            console.log(data['message']);
            $('.progressTow').hide();

            if (data['status'] == '0') {
                let img_path = '/static/result/' + data['result'];

                $('#result-img').attr('src', img_path);
                $('#result-img-div').animate({height: '300px'}, "slow");

                $('#download-btn').attr('href', img_path);
                $('#download-btn').show();
            } else {
                msg.text(data['message']);
                $('#show-msg').trigger('click');
            }
        },

        error: function () {
            msg.text('程序开小差了');
            msg.click();
        },

        complete: function () {
        }
    });
});
