import {useState, useEffect} from 'react';
import {Container, Row, Col, Card, Button, Modal} from 'react-bootstrap';
import EditPost from './forms/EditPost';
import Swal from 'sweetalert2';

function Post({data, refresh}) {
  const [check, setCheck] = useState({});

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //check if user has a profile
  let checkUser = (phoneNum) => {
    phoneNum = JSON.parse(localStorage.getItem('userData')).phoneNumber;
    fetch(`${process.env.REACT_APP_API_URL}/profiles/${phoneNum}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data && setCheck(data);
      });
  };

  const deleteHandler = (id) => {
    Swal.fire({
      title: 'Are you sure you want to delete this post?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: 'true',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire('Deleted!', 'Post deleted', 'success');
            refresh();
          });
      }
    });
  };

  useEffect(() => {
    checkUser();
  }, []);


  return (
    <Container className="mt-5">
      <div className="bgOpaque p-5">
        <Row className="justify-content-center">
          <Col md="6">
            <Card>
              {data.image && (
                <Card.Img
                  src={`${process.env.REACT_APP_API_URL}/${data.image.split('/')[2]}`}
                  className="img-fluid postCardImg"
                />
              )}

              <Card.Body>
                <Card.Title>{data.title}</Card.Title>
                <Card.Text>{data.content}</Card.Text>
              </Card.Body>
              <Card.Footer>Posted by {data.author}</Card.Footer>
            </Card>
          </Col>

          {/*author edit delete admin delete */}
          {data.phoneNumber === JSON.parse(localStorage.getItem('userData')).phoneNumber && JSON.parse(localStorage.getItem('userData')).isAdmin === false && (
            <div className="text-end">
              <Button className="btn formBtn" onClick={handleShow}>
                Edit
              </Button>
              <em> </em>
              <button className="btn btn-inverted" onClick={(id) => deleteHandler(data._id)}>
                Delete
              </button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {' '}
                  <EditPost id={data._id} refresh={refresh} />{' '}
                </Modal.Body>
              </Modal>
            </div>
          )}
          {JSON.parse(localStorage.getItem('userData')).isAdmin && (
            <div className="text-end">
              <em> </em>
              <button className="btn btn-inverted" onClick={(id) => deleteHandler(data._id)}>
                Delete
              </button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {' '}
                  <EditPost id={data._id} refresh={refresh} />{' '}
                </Modal.Body>
              </Modal>
            </div>
          )}
        </Row>
      </div>
    </Container>
  );
}

export default Post;
