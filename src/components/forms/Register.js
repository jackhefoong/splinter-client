import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';


function Register({handleLogin}) {
  let navigate = useNavigate();
  let [user, setUser] = useState({});
  let loginUser = {};

  let onChangeHandler = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const onSubmitHandler = (e) => {
    user.dob = document.getElementById('dob').value;
    console.log(user);
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire(data.msg);
        if (data.msg === 'Registered successfully') {
          e.preventDefault();
          loginUser.phoneNumber = user.phoneNumber;
          loginUser.password = user.password;
          fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginUser),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.msg === 'Logged in successfully') {
                handleLogin(data.token);
              }
              navigate('/');
            });
          e.target.reset();
        }
      });
    setUser({});
    e.target.reset();
  };

  return (
    <Container className="mt-5">
      <div className="text-center text-white justify-content-center align-items-center">
        <h2>Register Now!</h2>
        <small>
          Already have an account?{' '}
          <a href="./login" className="form-link">
            Log in here
          </a>
        </small>
      </div>
      <Row className="justify-content-center text-white">
        <Col md="6">
          <Form onSubmit={onSubmitHandler}>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="dob" id="dob" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phoneNumber" onChange={onChangeHandler} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" onChange={onChangeHandler} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" onChange={onChangeHandler} required />
            </Form.Group>
            <div className="text-center">
              <Button type="submit" className="customButton">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
