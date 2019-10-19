// 显示选择的图片
let flag = 0;
let is_change = 0;

$('#upload').change(function () {
    let image = $('#upload')[0].files[0];
    let reader = new FileReader();
    let img_url;
    is_change = 1;

    reader.readAsDataURL(image);
    reader.onload = function () {
        img_url = this.result;
    };

    if (flag == 0) {
        flag = 1;
        reader.onload = function () {
            $('#choose-img').attr('src', this.result);
        };
        $('#choose-img-div').animate({height: '300px'}, "slow");
        $('#choose-img').show('slow');
        $('#tow').show('slow');

    } else {
        $('#choose-img').fadeOut('slow', function () {
            $('#choose-img').attr('src', img_url);
            $('#choose-img').fadeIn('slow');
        });

        // $('#choose-img-div').animate({height: '0px'}, "slow", function () {
        //     $('#choose-img').attr('src', img_url);
        // });
    }


});

// 改变选择风格按钮内容
function changeContent(btn) {
    if (btn.text() == '隐藏风格') {
        btn.text('选择风格');
    } else {
        btn.text('隐藏风格');
    }
}

// 点击选择风格图片来选择显示
$('.thumbnail').click(function () {
    let img_path = $(this).find('img')[0].src;

    $('#submit').popover('disable');

    is_change = 1;

    if ($('#style_image_name').val() == $(this).attr('name')) {
        return;
    }

    if ($('#style_image_name').val() != "") {
        $('#style-img').animate({height: '0px', width: '0px'}, "slow", function () {
            $('#style-img').attr('src', img_path);
            $('#style-img').animate({height: '100%', width: '100%'}, 'slow')
        });
    } else {
        $('#style-img').attr('src', img_path);
        $('#style-img-div').animate({height: '300px'}, "slow");
        $('#style-img').animate({height: '100%', width: '100%'}, 'slow');
        $('#three').show('slow');
    }

    $('#style_image_name').val($(this).attr('name'));

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


let numbers = 0;
// 上传生成图片
$('#submit').click(function () {


    if (is_change == 0) {
        numbers += 5;
        $('.progressThree-bar').css('width', numbers.toString() + '%');
        $('.progressThree-bar').attr('aria-valuenow', numbers);
        if (numbers == 15) {
            $('.progressThree').show();
        } else if (numbers == 100) {
            $('#submit').popover('dispose');
            $('#msg').text("服务器原地爆炸, 再见...愚蠢的人类");
            $('#show-msg').trigger('click');
            let container = $('.container');
            container.empty();
            $('.container').css({
                'background-image': 'url(/static/js/timg.gif)',
                'width': '100%',
                'height': '100%',
            });
        }
        return;
    } else {
        $('#submit').popover('enable');
        is_change = 0;
    }


    let formData = new FormData();
    let image = $('#upload')[0].files[0];
    let style_image_name = $('#style_image_name').val();
    let msg = $('#msg');
    formData.append('image', image);
    formData.append('style_image_name', style_image_name);


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
                let result_img = $('#result-img');

                if (result_img.attr('src') == null) {
                    $('#result-img').attr('src', img_path);
                    $('#result-img-div').animate({height: '300px'}, "slow");

                    $('#download-btn').attr('href', img_path);
                    $('#download-btn').show();
                } else {
                    result_img.fadeOut('slow', function () {
                        result_img.attr('src', img_path);
                        result_img.fadeIn('slow');
                    });

                }


            } else {
                msg.text(data['message']);
                $('#show-msg').trigger('click');
            }
        },

        error: function () {
            msg.text('程序开小差了');
            $('#show-msg').trigger('click');
        },

        complete: function () {
        }
    });
});


// 在任何地方添加弹出框
$(function () {
    $('[data-toggle="popover"]').popover()
});

$('#submit').popover({
    trigger: 'hover',
    content: '不许再点我了，再点生气了',
    placement: 'auto',
    container: 'body',
});