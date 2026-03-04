from django.db import models


class Account(models.Model):
    ACCOUNT_TYPES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
        ('credit_card', 'Credit Card'),
        ('loan', 'Loan'),
    ]
    name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.account_type})"


class Category(models.Model):
    name = models.CharField(max_length=100)
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    color = models.CharField(max_length=7, default='#6366f1')

    def __str__(self):
        return self.name


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('expense', 'Expense'),
        ('income', 'Income'),
        ('transfer', 'Transfer'),
    ]
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    date = models.DateField()
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    debit_account = models.CharField(max_length=100)
    credit_account = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - ${self.amount}"


class Loan(models.Model):
    name = models.CharField(max_length=100)
    principal = models.DecimalField(max_digits=12, decimal_places=2)
    annual_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    term_months = models.IntegerField()
    start_date = models.DateField()
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} - ${self.principal}"
