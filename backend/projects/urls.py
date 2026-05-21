from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers as nested_routers
from .views import ProjectViewSet
from tasks.views import TaskViewSet

router = DefaultRouter()
router.register(r'', ProjectViewSet, basename='project')

projects_router = nested_routers.NestedSimpleRouter(router, r'', lookup='project')
projects_router.register(r'tasks', TaskViewSet, basename='project-tasks')

urlpatterns = [
    *router.urls,
    *projects_router.urls,
]