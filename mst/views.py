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
        print(image)

        # 选择的风格名称
        # choice = request.POST['choice']
        # print('风格名称: ' + choice)

        if image is None:
            return HttpResponse(json.dumps({'status': 1, 'message': '没有需要上传的文件!'}))
        else:
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

            print('上传成功')
            print('存储路径为: ' + path)

            # TODO: 插入模型预测函数,修改返回值返回结果图片路径
            # 结果图片存储到/static/result/下面

            # 结果文件名字,带后缀
            result = '0.png'

            return HttpResponse(json.dumps({'status': 0, 'message': '上传成功', 'result': result}))
