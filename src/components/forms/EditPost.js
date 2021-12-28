import {Row, Col, Form, Button} from 'react-bootstrap';
import {useState} from 'react';
import Swal from 'sweetalert2';

function EditPost({id, refresh}) {
  const [update, setUpdate] = useState({});

  const onSubmitHandler = (e) => {
    e.preventDefault();

    let input = document.getElementById('newImage');

    let formData = new FormData();
    formData.append('newImage', input.files[0]);
    formData.append('title', update.title);
    formData.append('content', update.content);

    fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire(JSON.stringify(data.msg));
        refresh();
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
    <Row className=" justify-content-center ">
      <Col md="6">
        <Form onSubmit={onSubmitHandler}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" onChange={onChangeHandler} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control type="text" name="content" onChange={onChangeHandler} />
          </Form.Group>
          <Form.Group>
            <Form.Control type="hidden" name="author" id="author" value="name" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" name="image" id="newImage" />
          </Form.Group>
          <div className="text-center">
            <Button type="submit" className="customButton">
              Edit Post
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default EditPost;
