import {useState} from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';

function EditDatingProfile({id, showMyProfile}) {
  const [update, setUpdate] = useState({});

  const onSubmitHandler = (e) => {
    e.preventDefault();

    let input = document.getElementById('profilePicture');
    let phoneNumber = document.getElementById('phoneNumber');
    let age = document.getElementById('age');

    let formData = new FormData();
    formData.append('newProfilePicture', input.files[0]);
    formData.append('fullName', update.fullName);
    formData.append('age', age.value);
    formData.append('phoneNumber', phoneNumber.value);
    formData.append('bio', update.bio);

    fetch(`${process.env.REACT_APP_API_URL}/profiles/${id}`, {
      method: 'PUT',
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
    setUpdate({
      ...update,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container className="mt-5">
      <Form onSubmit={onSubmitHandler}>
        <Form.Group>
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control type="file" name="profilePicture" id="profilePicture" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" name="fullName" onChange={onChangeHandler} />
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
          <Form.Select id="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Biography</Form.Label>
          <Form.Control type="text" name="bio" onChange={onChangeHandler} />
        </Form.Group>
        <div className="text-center">
          <Button type="submit" className="btn-inverted mt-2">
            Edit
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default EditDatingProfile;
