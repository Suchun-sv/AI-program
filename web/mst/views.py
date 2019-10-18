import json
import os

from django.http import HttpResponse
from django.shortcuts import render
import datetime
import random

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
        upload_path = os.path.join(STATICFILES_DIRS[0], 'upload/')
        if not os.path.isdir(upload_path):
            os.makedirs(upload_path)

        result_path = os.path.join(STATICFILES_DIRS[0], 'result/')
        if not os.path.isdir(result_path):
            os.makedirs(result_path)

        return render(request, 'index.html')

    if request.method == 'POST':
        image = request.FILES.get('image', None)  # 上传的图片

        choice = request.POST['choice']  # 选择的风格名称
        print(STATICFILES_DIRS[0])

        # 上传图片
        if image is None:
            return HttpResponse(json.dumps({'status': 1, 'message': '没有需要上传的文件!'}))
        else:
            result = get_random() + '-' + image.name  # 返回值,也是生成图片的名称
            path = os.path.join(STATICFILES_DIRS[0], 'upload/' + result)  # 上传的文件存储路径
            if not save_file(image, path):
                return HttpResponse(json.dumps({'status': 1, 'message': '上传文件失败!'}))

        # 调用模型
        if not test_model(choice, result, path):
            return HttpResponse(json.dumps({'status': 1, 'message': '生成图片失败'}))

        return HttpResponse(json.dumps({'status': 0, 'message': '上传成功', 'result': result}))


def test_model(choice, result, path):
    """
    调用模型
    :param choice: 选择的风格
    :param result: 调用模型生成的图片名称
    :param path: 上传的图片路径
    :return:
    """
    # choice 与风格图片的映射
    style_ = {
        "0": "starry_night.jpg",  # 星月夜
        "1": "the_scream.jpg",
        "2": "wave.jpg",
        "3": "picasso_selfport1907.jpg",
        "4": "pencil.jpg"
    }

    # === 调用模型 ===
    content_size = 256  # 根据显存调整该参数
    root = "backend/"  # 模型部分的根文件夹
    style = root + f"images/styles/{style_[choice]}"  # 风格图片
    model = root + "models/21styles.model"  # 模型路径
    output = "static/result/" + result  # 输出图片

    cmd = f"python {root}main.py eval --content-image {path} --style-image {style} --output-image {output} --model {model} --content-size {content_size} --cuda 1"
    os.system(cmd)
    return True


def save_file(file, path):
    """
    保存文件
    :param file: 文件
    :param path: 保存路径
    """
    if file.multiple_chunks():  # 判断上传文件大于2.5MB的大文件
        file_yield = file.chunks()  # 迭代写入文件
        with open(path, 'wb') as f:
            for buf in file_yield:  # for情况执行无误才执行 else
                f.write(buf)
    else:
        with open(path, 'wb') as f:
            f.write(file.read())
    return True


def get_random():
    """
    生成一个随机数返回
    :return:
    """
    now_time = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  # 生成当前时间
    random_num = random.randint(0, 100)
    if random_num <= 10:
        random_num = str(0) + str(random_num)
    unique_num = str(now_time) + str(random_num)  # 产生唯一随机数
    return unique_num
