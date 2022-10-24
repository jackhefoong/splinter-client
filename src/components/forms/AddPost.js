import {useState} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';

function AddPost({allPosts, author}) {
  let name = author?.fullName;

  const [post, setPost] = useState({});

  const changeHandler = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = e => {
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
        Swal.fire(data.msg);
        allPosts();
      });
    e.target.reset();
  };

  return (
    <Container>
      {/* center row  */}
      <Row className="text-white justify-content-center ">
        {/* half screen  */}
        <Col md="6">
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" onChange={changeHandler} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control type="text" name="content" onChange={changeHandler} />
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
