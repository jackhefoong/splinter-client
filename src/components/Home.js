import img from '../components/img/altlogo.png';
import img2 from '../components/img/text2.png';
import img3 from '../components/img/capture-1.jpg';
import {Row, Col, Container} from 'react-bootstrap';
import React from 'react';
// import {useState, useEffect} from 'react';

function Home() {
  return (
    <Container className="bgOpaque py-5 px-5 my-4">
      {localStorage.hasOwnProperty('userData') && localStorage.hasOwnProperty('token')  ? (
        <div style={{backgroundImage: `url(${img3})`}} className="swipeDiv">
          <a href="/match" className="btn btn-light text-clr matchLink">
            Start Swiping!
          </a>
        </div>
      ) : (
        <>
          <Row className="my-2">
            <Col md="6">
              <img src={img} alt="DRAWING OF COUPLE LMAOO" className="img-fluid" />
            </Col>
            <Col md="6">
              <div className="mt-5 text-white ">
                <h2>Introducing Splinter</h2>
                <p>Making connections anytime. anywhere.</p>
              </div>

              <a href="/register" className="btn btn-light text-clr">
                Register
              </a>
              <em> </em>
              <a href="/login" className="btn btn-inverted">
                Login
              </a>
            </Col>
          </Row>

          <Row className="my-2 flex-xl-row-reverse">
            <Col md="6">
              <img src={img2} alt="couples texting lmfao" className="img-fluid " />
            </Col>
            <Col md="6">
              <div className="mt-5 text-white text-end">
                <h2>Interact with your matches !!!!</h2>
                <p>Talk about your topics of interest and get to know each other better (WoHoo!) 😉</p>
                <p>(jk i lied its not even working XD)</p>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Home;
