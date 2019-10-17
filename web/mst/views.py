import json
import os

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from ai_project.settings import STATICFILES_DIRS


def index(request):
    """
    展示主界面
    """
    return render(request, 'index.html')


def upload_image(request):
    """
    接受上传图片和选择的风格
    """
    if request.method == 'GET':
        return render(request, 'index.html')

    if request.method == 'POST':
        image = request.FILES.get('image', None)
        # print(image)

        # 选择的风格名称
        choice = request.POST['choice']
        # print('风格名称: ' + choice)

        if image is None:
            return HttpResponse(json.dumps({'status': 1, 'message': '没有需要上传的文件!'}))

        # 上传文件本地保存路径， image是static文件夹下专门存放图片的文件夹
        path = os.path.join(STATICFILES_DIRS[0], 'upload/' + image.name)
        if image.multiple_chunks():  # 判断上传文件大于2.5MB的大文件
            # 为真
            file_yield = image.chunks()  # 迭代写入文件
            with open(path, 'wb') as f:
                for buf in file_yield:  # for情况执行无误才执行 else
                    f.write(buf)
        else:
            with open(path, 'wb') as f:
                f.write(image.read())

        # print('上传成功')
        # print('存储路径为: ' + path)

        # TODO: 插入模型预测函数,修改返回值返回结果图片路径
        # 结果图片存储到/static/result/下面

        # choice 与风格图片的映射
        style_ = {
            "0": "starry_night.jpg",  # 星月夜
            "1": "the_scream.jpg",
            "2": "wave.jpg",
            "3": "picasso_selfport1907.jpg",
            "4": "pencil.jpg"
        }

        # === 调用模型 === 
        content_size = 256   # 根据显存调整该参数
        root = "backend/"    # 模型部分的根文件夹
        style = root + f"images/styles/{style_[choice]}"  # 风格图片
        model = root + "models/21styles.model"  # 模型路径
        output = "static/result/output.jpg"  # 输出图片

        cmd = f"python {root}main.py eval --content-image {path} --style-image {style} --output-image {output} --model {model} --content-size {content_size} --cuda 1" 
        os.system(cmd)
        
        # 结果文件名字,带后缀
        # result = '0.png'

        return HttpResponse(json.dumps({'status': 0, 'message': '上传成功', 'result': "output.jpg"}))
