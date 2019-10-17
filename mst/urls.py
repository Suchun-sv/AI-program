from django.contrib import admin
from django.urls import path
from django.urls import path, include
from .views import *

app_name = 'mst'

urlpatterns = [
    path('', index, name='index'),
    path('upload-image/', upload_image, name='upload_image'),

]
