import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { resetRegistered, login } from '../features/user';

import axios from 'axios';
import { BASE_URL } from '../config';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import connectubgi from '../assets/connectubgi.jpg'

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const { loading, registered, isAuthenticated } = useSelector(state => state.user)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      console.log("++","email : ",email, ", password : ", password )
      const response = await dispatch(login({ email, password }));  
      if (response.payload && response.payload.detail) {
        setErrors(response.payload);
        console.log('Login failed:', response.payload);
      } else {
        console.log(response.payload);
        console.log('Login successful. Navigating to home.');
        navigate('/home');
      }
    } catch (error) {
      console.log('Error caught:', error);
    }
  };  
  
  useEffect(()=> {
    if (registered) dispatch(resetRegistered());
  }, [registered, dispatch]);

  useEffect(()=> {
    if (isAuthenticated) {
      navigate('/home'); 
    } else {
      navigate('/'); 
    }
  },[isAuthenticated, navigate]);


  const handleGoogleLoginSuccess = async (response) => {
    try {
      const decodedToken = jwtDecode(response.credential);
      const email = decodedToken.email; 
      const password = "qwerty@12345"; 

            const fullName = decodedToken.name;
            const spaceIndex = fullName.indexOf(' ');
            
            let firstName, lastName;
            
            if (spaceIndex !== -1) {
              firstName = fullName.substring(0, spaceIndex);
              lastName = fullName.substring(spaceIndex + 1);
            } else {
              firstName = fullName;
              lastName = ''; 
            }


              const formData_1 = new FormData();
              formData_1.append('first_name', firstName);
              formData_1.append('last_name', lastName);
              formData_1.append('email', decodedToken.email);
              formData_1.append('age', 18);
              formData_1.append('password', 'qwerty@12345');

              const response_1 = await axios.post(`${BASE_URL}/api/users/GoogleAuthView/`, formData_1);

              if (response_1.status === 200) {


                try {
                  setErrors({});
                  const response = await dispatch(login({ email, password }));  
                  if (response.payload && response.payload.detail) {
                    setErrors(response.payload);
                    console.log('Login failed:', response.payload);
                  } else {
                    console.log('Login successful. Navigating to home.');
                    navigate('/home');
                  }
                } catch (error) {
                  console.log('Error caught:', error);
                }
                
                
              } else {
                console.log(response.error);
              }


          



    } catch (error) {
      console.log('Error during Google login:', error);
    }
  };

  const handleGoogleLoginFailure = () => {
    console.log('Login Failed');
  };







  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen' >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >
            Loading...
          </span>
        </div>
      </div>
    )
  };
  

  return (
    <Layout title='ConnectU | Login' content='Login page'>
  <div className="flex flex-col md:flex-row justify-center p-2 items-center h-full mt-16">
    <div className="w-full md:w-1/2 md:ml-8 p-8 bg-[#fafafa] rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#333333]">Sign in to your account</h2>
      </div>

      {errors && (
        <div className="text-red-600 text-center mt-4 text-sm">
          {errors.detail}
        </div>
      )}

      <form className="mt-6" onSubmit={onSubmit}>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          onChange={onChange}
          value={email}
          type="email"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring focus:ring-[#92638f] focus:ring-opacity-50 focus:border-[#92638f] sm:text-sm mt-2"
        />

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-700">
              Password
            </label>
            <Link to="/forgot" className="text-sm font-semibold text-[#000000] hover:text-[#000000]">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            onChange={onChange}
            value={password}
            type="password"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring focus:ring-[#92638f] focus:ring-opacity-50 focus:border-[#92638f] sm:text-sm mt-2"
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4caf50] hover:bg-[#388e3c] focus:outline-none focus:ring focus:ring-offset-2 focus:ring-[#388e3c]"
          >
            Sign in
          </button>
        </div>
      </form>

      <div className="mt-6 flex justify-center">
        <GoogleOAuthProvider clientId="554158844207-2g5nm548ll0b1l29etmr9oqmad2ub6rs.apps.googleusercontent.com">
          <GoogleLogin
            clientId="554158844207-2g5nm548ll0b1l29etmr9oqmad2ub6rs.apps.googleusercontent.com"
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
          />
        </GoogleOAuthProvider>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Not a member?{' '}
        <Link to={'/register'} className="font-semibold leading-6 text-[#5444ff] hover:text-[#000000]">
          Register
        </Link>
      </p>
      <p className="mt-4 text-center text-sm text-gray-500">
        Admin?{' '}
        <Link to={'/admin-login'} className="font-semibold leading-6 text-[#5d48ff] hover:text-[#000000]">
          Admin Login
        </Link>
      </p>
    </div>
  </div>
</Layout>


  )
}

export default LoginPage;
