import React from 'react';
import {Navbar, Container, Nav, Badge} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../img/logo.png';

function TopNav({handleLogout}) {
  let navigate = useNavigate();
  return (
    <Navbar expand="md" bg="transparent" variant="dark" id="navbar">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          <em> </em> Splinter 🥴
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu" />
        <Navbar.Collapse id="menu" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('userData') ? (
              <>
                {/* <Nav.Link as={Link} to="/messages">
                  Messages <em> </em>
                  <Badge bg="primary">0</Badge>
                </Nav.Link> */}

                {JSON.parse(localStorage.getItem('userData')).isAdmin ? (
                  <Nav.Link as={Link} to="/reports">
                    Reports
                  </Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/myprofile">
                    My Profile
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/posts">
                  Posts
                </Nav.Link>

                <Nav.Link
                  onClick={() => {
                    handleLogout();
                    navigate('/');
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNav;
