from django.urls import path

from .views import BannerListView, ConcernListView

urlpatterns = [
    path("banners/", BannerListView.as_view(), name="banners"),
    path("concerns/", ConcernListView.as_view(), name="concerns"),
]
