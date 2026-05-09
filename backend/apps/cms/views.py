from __future__ import annotations

from rest_framework import generics

from .models import Banner, Concern
from .serializers import BannerSerializer, ConcernSerializer


class BannerListView(generics.ListAPIView):
    serializer_class = BannerSerializer
    queryset = Banner.objects.filter(is_active=True)


class ConcernListView(generics.ListAPIView):
    serializer_class = ConcernSerializer
    queryset = Concern.objects.all()
