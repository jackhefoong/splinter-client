import React, {useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';

import axios from 'axios';
import jwt_decode from 'jwt-decode';

const clientId = '241400382471-pd0fv4kibgptrsg2jon5bhfkk1c207ca.apps.googleusercontent.com';

function Login({handleLogin}) {
  let navigate = useNavigate();
  let [user, setUser] = useState({});

  const [gsiLoaded, setGsiLoaded] = useState(false);
  // const [user, setUser] = useState(null)
  const btnDivRef = useRef();

  const onSignOut = () => {
    window.google?.accounts.id.revoke(user.sub, (done, err) => {
      console.log(done, err);
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire(data.msg);
        if (data.msg === 'Logged in successfully') {
          handleLogin(data.token);
        }

        navigate('/');
      });
    setUser({});
    e.target.reset();
  };

  const onChangeHandler = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  useEffect(() => {
    const handleGoogleSignIn = async (res) => {
      const decoded = jwt_decode(res.credential);
      console.log(decoded);
      const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/auth/tokenLogin`, {
        credential: res.credential,
      });
      // setUser(data);
      // console.log(user);
    };

    const initializeGsi = () => {
      if (!window.google || gsiLoaded) return;
      setGsiLoaded(true);

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleSignIn,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('buttonDiv'),
        {theme: 'outline', size: 'large'}, // customization attributes
      );
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGsi;
    script.async = true;
    script.id = 'google-script';
    document.querySelector('head')?.appendChild(script);

    return () => {
      document.getElementById('google-script')?.remove();
      window.google?.accounts.id.cancel();
    };
  }, [gsiLoaded]);

  return (
    <Container className="mt-5">
      <div className="text-center text-white">
        <h2>Login Now!</h2>
        <small>
          No account?{' '}
          <a href="./register" className="form-link">
            Register here
          </a>
        </small>
      </div>
      <Row className="text-white justify-content-center">
        <Col md="6">
          <Form onSubmit={onSubmitHandler}>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="number" name="phoneNumber" onChange={onChangeHandler} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" onChange={onChangeHandler} />
            </Form.Group>
            <div className="text-center">
              <Button type="submit" className="customButton">
                Login
              </Button>
              {/* <div id="buttonDiv" ref={btnDivRef} className="mt-3"></div> */}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
