import {useEffect, useState} from 'react';
import {Col, Row, Image} from 'react-bootstrap';
import Swal from 'sweetalert2';

function Matches({phoneNum}) {
  const [data, setData] = useState({});

  const reportUser = (id) => {
    let user = JSON.parse(localStorage.getItem('userData')).phoneNumber;
    let body = {
      reportedBy: `${user}`,
    };
    Swal.fire({
      title: 'Are you sure you want to report this user?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: 'true',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/admin/report/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
          },
          body: JSON.stringify(body),
        })
          .then((res) => res.json())
          .then((data) => {
            Swal.fire(data.msg);
          });
      }
    });
  };

  const getMatches = () => {
    fetch(`${process.env.REACT_APP_API_URL}/profiles/${phoneNum}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };

  const unlikeUser = (phoneNumber, unliked) => {
    Swal.fire({
      title: 'Are you sure you want to unlike this user?',
      icon: 'warning',
      showCancelButton: 'true',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/likes/${phoneNumber}/${unliked}`, {
          method: 'PUT',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        })
          .then((res) => res.json())
          .then(() => {
            getMatches();
            Swal.fire('Unliked!', 'successfully removed user from ur likes', 'success');
          });
      }
    });
  };

  const calculate = (fn, sn) => {
    fetch(`${process.env.REACT_APP_API_URL}/likes/calculate/${fn}/${sn}`, {
      method: 'POST',
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire(`Compatibility: ${parseInt(data) + 40}%`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getMatches();
  }, []);

  return (
    <Row className="justify-content-center text-white align-items-center">
      <Col md="4">
        <Image
          src={`${process.env.REACT_APP_API_URL}/${data?.profilePicture?.split('/')[2]}`}
          alt="Profile Picture"
          className="img-round m-5 "
        />
      </Col>
      <Col md="6" className="offset-1">
        <h1>
          {data?.fullName}, {data?.gender === 'male' ? '♂️' : '♀'}, {data?.age}
        </h1>
        <h3>{data?.bio}</h3>
        <h3>{data?.phoneNumber}</h3>
        <button className="btn formBtn" onClick={(id) => reportUser(data?._id)}>
          Report
        </button>
        <em> </em>
        <button
          className="btn btn-inverted"
          onClick={(phoneNumber, unliked) =>
            unlikeUser(JSON.parse(localStorage.getItem('userData')).phoneNumber, data?.phoneNumber)
          }
        >
          Unlike
        </button>
        <em> </em>
        <button
          className="btn formBtn"
          onClick={(fn, sn) => calculate(JSON.parse(localStorage.getItem('userData')).phoneNumber, data?.fullName)}
        >
          Calculate compatibility
        </button>
      </Col>
    </Row>
    // <h1>Yes</h1>
  );
}

export default Matches;
