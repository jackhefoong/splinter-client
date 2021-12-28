import {useState, useEffect} from 'react';
import {Container, Col, Card} from 'react-bootstrap';
import Swal from 'sweetalert2';

function Report({data, refresh}) {
  const [profile, setProfile] = useState({});
  const [reporter, setReporter] = useState({});

  const deleteHandler = (id) => {
    Swal.fire({
      title: 'Are you sure you want to delete this report?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: 'true',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/admin/${id}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire('Deleted!', 'Report deleted', 'success');
            refresh();
          });
      }
    });
  };

  const restrictProfile = (id) => {
    Swal.fire({
      title: 'Are you sure you want to restrict this profile?',
      icon: 'warning',
      showCancelButton: 'true',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/admin/restrict/${id}`, {
          method: 'PUT',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire('Restricted!', 'Profile restricted', 'success');
            refresh();
          });
      }
    });
  };

  const unrestrictProfile = (id) => {
    Swal.fire({
      title: 'Are you sure you want to unrestrict this profile?',
      icon: 'warning',
      showCancelButton: 'true',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/admin/unrestrict/${id}`, {
          method: 'PUT',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire('Unrestricted!', 'Profile unrestricted', 'success');
            refresh();
          });
      }
    });
  };

  const getReportedProfile = (id) => {
    id = data.user;
    fetch(`${process.env.REACT_APP_API_URL}/admin/${id}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));
  };

  const getReporter = (phoneNumber) => {
    phoneNumber = data.reportedBy;
    fetch(`${process.env.REACT_APP_API_URL}/profiles/${phoneNumber}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => setReporter(data));
  };

  useEffect(() => {
    getReportedProfile();
    getReporter();
  }, []);

  console.log(profile);

  return (
    <Container className="mt-5">
      <div className="bgOpaque p-5 ">
        <Col md="6" className="offset-3">
          <Card>
            <Card.Img
              src={`${process.env.REACT_APP_API_URL}/${profile.profilePicture?.split('/')[2]}`}
              className="img-fluid postCardImg"
            />
            <Card.Body>
              <Card.Title>
                Profile Reported{' '}
                {profile?.isRestricted ? (
                  <button className="btn restrictBtn" onClick={(id) => unrestrictProfile(data.user)}>
                    Unrestrict Profile
                  </button>
                ) : (
                  <button className="btn btn-inverted" onClick={(id) => restrictProfile(data.user)}>
                    Restrict Profile
                  </button>
                )}
              </Card.Title>
              <Card.Text>User Details: {profile.fullName}</Card.Text>
              <small>User: {data.user}</small>
            </Card.Body>
            <Card.Footer>Reported by {reporter.fullName}</Card.Footer>
          </Card>
        </Col>
        <div className="text-end">
          <button className="btn btn-inverted" onClick={(id) => deleteHandler(data._id)}>
            Mark as read
          </button>
        </div>
      </div>
    </Container>
  );
}

export default Report;
