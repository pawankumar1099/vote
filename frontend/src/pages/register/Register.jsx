import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { api } from '../../config';
// notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//icons
import {FormOutlined} from '@ant-design/icons';

const Register = () => {
  const navigate = useNavigate();

  // Notification functions
  const errorNotify = (errorMsg) => toast.error(errorMsg, { autoClose: 3000 });
  const successNotify = (successMsg) => toast.success(successMsg, { autoClose: 3000 });

  const onFinish = async (values) => {
    try {
      const response = await api.post('/register', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      });

      if (response.status === 201) {
        successNotify(response.data.message);
        setTimeout(() => {
          navigate('/verifyEmailPhone');
        }, 3000); // 3 seconds delay
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 201 range
        errorNotify('Error: ' + error.response.data.error);
      } else {
        // Request was made but no response received
        errorNotify('No response received from server.');
      }
    }
  };

  return (
    <div className="register-container" role="main" aria-label="Register for AccessibleVote">
      <ToastContainer />
      <div className="register-form-content">
        <h2 id="register-heading">Register</h2>
        <Form
          name="register"
          className="register-form"
          onFinish={onFinish}
          aria-labelledby="register-heading"
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Please input your First Name!' }]}
          >
            <Input className="large-input" placeholder="First Name" aria-label="First name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Please input your Last Name!' }]}
          >
            <Input className="large-input" placeholder="Last Name" aria-label="Last name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input className="large-input" placeholder="Email address" aria-label="Email address" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-form-button large-input" aria-label="Submit registration">
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className="login-link">
          You already have an account? <Link to="/" aria-label="Go to login">Log in</Link>
        </div>
        <div className="all-rights-reserved" aria-label="All rights reserved">
          © 2026 <span>AccessibleVote</span> Inc. all rights reserved.
        </div>
      </div>
      <div className="register-form-info">
        <div className="register-form-info-content">
          <h2>Hello,<br />Welcome!</h2>
          <FormOutlined className='register-form-info-content-icon'/>
          <h4>
          Empowering your voice in democracy with secure, informed, and engaging voting.<br /><br />
          Enter your first name, last name, and email in order to register into AccessibleVote.<br /><br />
          If you already have an account go to the login page.<br />
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Register;
