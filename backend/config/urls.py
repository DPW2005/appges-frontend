from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

admin.site.site_header  = 'APPGES Administration'
admin.site.site_title   = 'APPGES'
admin.site.index_title  = 'Gestion des Enseignements'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Les apps exposeront leurs routes ici plus tard :
    path('api/core/', include('core.urls')),
    path('api/enseignements/', include('enseignements.urls')),
    path('api/facturation/', include('facturation.urls')),
    path('api/notes/', include('notes.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
