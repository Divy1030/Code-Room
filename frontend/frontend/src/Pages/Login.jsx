import React from 'react';
import { useState,useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sun, Moon, Mail, Lock } from 'lucide-react';
import axios from '../config/axios';
import {UserContext} from '../context/user.context';


const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

const Login = () => {
  const [isDark, setIsDark] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log('Login attempt with:', data);
    try {
      const response = await axios.post('/users/login', {
        email: data.email,
        password: data.password
      });
      console.log('Response data:', response.data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg bg-opacity-20 hover:bg-opacity-30 transition-colors"
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-300" />
        ) : (
          <Moon className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none ${
                  isDark 
                    ? 'bg-gray-700 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 focus:ring-2 focus:ring-blue-500'
                }`}
                placeholder="Enter your email"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none ${
                  isDark 
                    ? 'bg-gray-700 focus:ring-2 focus:ring-blue-500' 
                    : 'bg-gray-100 focus:ring-2 focus:ring-blue-500'
                }`}
                placeholder="Enter your password"
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;