import {useState} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';

function AddPost({allPosts, author}) {
  let name = author?.fullName;

  const [post, setPost] = useState({});

  const onChangeHandler = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    let input = document.getElementById('image');
    let author = document.getElementById('author');

    let formData = new FormData();
    formData.append('image', input.files[0]);
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('author', author.value);
    formData.append('phoneNumber', JSON.parse(localStorage.getItem("userData")).phoneNumber);

    fetch(`${process.env.REACT_APP_API_URL}/posts/addPost`, {
      method: 'POST',
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire(JSON.stringify(data.msg));
        allPosts();
      });
    e.target.reset();
  };

  return (
    <Container>
      <Row className="text-white justify-content-center ">
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
              <Form.Control type="hidden" name="author" id="author" value={name} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" id="image" />
            </Form.Group>
            <div className="text-center">
              <Button type="submit" className="customButton">
                Add Post
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddPost;
