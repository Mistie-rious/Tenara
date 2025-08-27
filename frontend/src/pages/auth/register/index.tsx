import React from 'react';
import AuthLayout from '../components/shared/AuthLayout';
import RegisterForm from './components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create Your Tenant"
      subtitle="Set up your organization and admin account"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
