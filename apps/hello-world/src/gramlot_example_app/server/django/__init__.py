"""Django URL configuration for the shared Python Hello World page."""
from importlib.resources import files

from django.urls import include, path
from gramlot_django import NativeHtmlPages

pages = NativeHtmlPages(files("gramlot_example_app.pages"), prefix="/hello")
urlpatterns = [path("hello/", include(pages.urls))]

__all__ = ["pages", "urlpatterns"]
