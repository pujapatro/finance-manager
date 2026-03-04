from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
import datetime

from .models import Account, Category, Transaction, Loan
from .serializers import AccountSerializer, CategorySerializer, TransactionSerializer, LoanSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-date')
    serializer_class = TransactionSerializer

    def perform_create(self, serializer):
        transaction = serializer.save()
        account = transaction.account
        if transaction.transaction_type == 'expense':
            account.balance -= transaction.amount
        elif transaction.transaction_type == 'income':
            account.balance += transaction.amount
        account.save()


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer


@api_view(['GET'])
def dashboard_summary(request):
    net_worth = Account.objects.aggregate(total=Sum('balance'))['total'] or 0

    today = datetime.date.today()

    monthly_expenses = Transaction.objects.filter(
        transaction_type='expense',
        date__year=today.year,
        date__month=today.month
    ).aggregate(total=Sum('amount'))['total'] or 0

    monthly_income = Transaction.objects.filter(
        transaction_type='income',
        date__year=today.year,
        date__month=today.month
    ).aggregate(total=Sum('amount'))['total'] or 0

    spending_by_category = Transaction.objects.filter(
        transaction_type='expense',
        date__year=today.year,
        date__month=today.month
    ).values('category__name', 'category__color').annotate(
        total=Sum('amount')
    ).order_by('-total')

    categories = Category.objects.all()
    budget_comparison = []
    for cat in categories:
        spent = Transaction.objects.filter(
            category=cat,
            transaction_type='expense',
            date__year=today.year,
            date__month=today.month
        ).aggregate(total=Sum('amount'))['total'] or 0

        budget_comparison.append({
            'category': cat.name,
            'budget': float(cat.monthly_budget),
            'spent': float(spent),
            'remaining': float(cat.monthly_budget - spent),
            'color': cat.color,
        })

    return Response({
        'net_worth': float(net_worth),
        'monthly_expenses': float(monthly_expenses),
        'monthly_income': float(monthly_income),
        'cash_flow': float(monthly_income - monthly_expenses),
        'spending_by_category': list(spending_by_category),
        'budget_comparison': budget_comparison,
    })


@api_view(['GET'])
def amortization_schedule(request, loan_id):
    try:
        loan = Loan.objects.get(id=loan_id)
    except Loan.DoesNotExist:
        return Response({'error': 'Loan not found'}, status=404)

    principal = float(loan.principal)
    annual_rate = float(loan.annual_interest_rate) / 100
    monthly_rate = annual_rate / 12
    n = loan.term_months

    if monthly_rate == 0:
        monthly_payment = principal / n
    else:
        monthly_payment = principal * (monthly_rate * (1 + monthly_rate)**n) / ((1 + monthly_rate)**n - 1)

    schedule = []
    balance = principal
    total_interest = 0

    for month in range(1, n + 1):
        interest_payment = balance * monthly_rate
        principal_payment = monthly_payment - interest_payment
        balance -= principal_payment
        total_interest += interest_payment

        schedule.append({
            'month': month,
            'payment': round(monthly_payment, 2),
            'principal': round(principal_payment, 2),
            'interest': round(interest_payment, 2),
            'balance': round(max(balance, 0), 2),
        })

    return Response({
        'loan_name': loan.name,
        'principal': principal,
        'monthly_payment': round(monthly_payment, 2),
        'total_paid': round(monthly_payment * n, 2),
        'total_interest': round(total_interest, 2),
        'schedule': schedule,
    })
