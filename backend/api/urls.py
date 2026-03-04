from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'accounts', views.AccountViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'loans', views.LoanViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.dashboard_summary, name='dashboard'),
    path('loans/<int:loan_id>/amortization/', views.amortization_schedule, name='amortization'),
]
