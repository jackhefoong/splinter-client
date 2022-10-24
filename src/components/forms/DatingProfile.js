import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, Image, Modal} from 'react-bootstrap';
import Swal from 'sweetalert2';
import EditDatingProfile from './EditDatingProfile';
import Matches from '../Matches';

function DatingProfile() {
  const [profile, setProfile] = useState({});
  const [exist, setExist] = useState({});
  const [likes, setLikes] = useState([]);
  const [likedby, setLikedBy] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    let input = document.getElementById('profilePicture');
    let gender = document.getElementById('gender');
    let phoneNumber = document.getElementById('phoneNumber');
    let age = document.getElementById('age');

    let formData = new FormData();
    formData.append('profilePicture', input.files[0]);
    formData.append('fullName', profile.fullName);
    formData.append('gender', gender.value);
    formData.append('age', age.value);
    formData.append('phoneNumber', phoneNumber.value);
    formData.append('bio', profile.bio);

    fetch(`${process.env.REACT_APP_API_URL}/profiles/createProfile`, {
      method: 'POST',
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire(data.msg);
        showMyProfile();
      });
    e.target.reset();
  };

  const onChangeHandler = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  let showMyProfile = (phoneNum) => {
    phoneNum = JSON.parse(localStorage.getItem('userData')).phoneNumber;
    fetch(`${process.env.REACT_APP_API_URL}/profiles/${phoneNum}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data && setExist(data);
      });
  };

  const myLikes = () => {
    let phoneNum = JSON.parse(localStorage.getItem('userData')).phoneNumber;
    fetch(`${process.env.REACT_APP_API_URL}/likes/${phoneNum}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => setLikes(data[0]?.likes));
  };

  const likesMe = () => {
    let phoneNum = JSON.parse(localStorage.getItem('userData')).phoneNumber;
    fetch(`${process.env.REACT_APP_API_URL}/likes/likedby/${phoneNum}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => setLikedBy(data[0]?.likedBy));
  };

  const result = likes?.filter((like) => likedby?.includes(like));

  useEffect(() => {
    showMyProfile();
    myLikes();
    likesMe();
  }, []);

  let profileInfo = exist?.profilePicture;

  if (profileInfo && profileInfo.isRestricted === false) {
    return (
      <Container className="mt-5">
        <div className="bgOpaque">
          <Row className="justify-content-center text-white align-items-center">
            <Col md="4">
              <Image
                src={`${process.env.REACT_APP_API_URL}/${profileInfo.profilePicture?.split('/')[2]}`}
                alt="Profile Picture"
                className="img-round m-5 "
              />
            </Col>
            <Col md="6" className="offset-1">
              <h1>
                {profileInfo.fullName}, {profileInfo.gender === 'male' ? '♂️' : '♀'}, {profileInfo.age}
              </h1>
              <h3>{profileInfo.bio}</h3>

              <Button className="btn formBtn" onClick={handleShow}>
                Edit
              </Button>
              {/* <em> </em>
                <button className="btn btn-inverted" onClick={(id) => deleteHandler(profileInfo._id)}>
                  Delete
                </button> */}

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {' '}
                  <EditDatingProfile
                    id={profileInfo._id}
                    showMyProfile={showMyProfile}
                    profileInfo={profileInfo}
                  />{' '}
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </div>
        {result?.length !== 0 && (
          <div className="bgOpaque">
            <Row className="justify-content-center text-white align-items-center mt-3">
              <h2 className="text-center mt-2">My Matches</h2>
            </Row>
            <Row>
              {result?.map((result) => {
                return <Matches phoneNum={result} key={result._id} />;
              })}
            </Row>
          </div>
        )}
      </Container>
    );
  } else if (profileInfo?.isRestricted) {
    return (
      <Container className="bgOpaque text-center text-white p-5 mt-5">
        <h1>Your account has been restricted</h1>
      </Container>
    );
  } else {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center text-white">
          <Col md="6">
            <Form onSubmit={onSubmitHandler}>
              <Form.Group>
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control type="file" name="profilePicture" id="profilePicture" required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" name="fullName" onChange={onChangeHandler} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="dob"
                  id="age"
                  disabled
                  value={JSON.parse(localStorage.getItem('userData')).age}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="string"
                  name="phoneNumber"
                  disabled
                  id="phoneNumber"
                  value={JSON.parse(localStorage.getItem('userData')).phoneNumber}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select id="gender" required>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Biography</Form.Label>
                <Form.Control type="text" name="bio" onChange={onChangeHandler} required />
              </Form.Group>
              <div className="text-center">
                <Button type="submit" className="customButton">
                  Create
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DatingProfile;
