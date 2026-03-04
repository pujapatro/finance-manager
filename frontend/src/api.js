import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api/' });

export const getAccounts = () => API.get('accounts/');
export const createAccount = (data) => API.post('accounts/', data);
export const deleteAccount = (id) => API.delete(`accounts/${id}/`);

export const getCategories = () => API.get('categories/');
export const createCategory = (data) => API.post('categories/', data);

export const getTransactions = () => API.get('transactions/');
export const createTransaction = (data) => API.post('transactions/', data);
export const deleteTransaction = (id) => API.delete(`transactions/${id}/`);

export const getDashboard = () => API.get('dashboard/');

export const getLoans = () => API.get('loans/');
export const createLoan = (data) => API.post('loans/', data);
export const getAmortization = (id) => API.get(`loans/${id}/amortization/`);