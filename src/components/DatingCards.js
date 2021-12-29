import DatingCard from 'react-tinder-card';
import Swal from 'sweetalert2';
// import {useState} from 'react';
// useEffect,
// import {Card, Button} from 'react-bootstrap';

const DatingCards = ({data}) => {
  // const [liked, setLiked] = useState('kkkk');

  let user = JSON.parse(localStorage.getItem('userData')).phoneNumber;

  const swiped = (direction, name, personLiked) => {
    if (direction === 'right') {
      Swal.fire(`You liked ${name}!`);

      const liked = {
        likedBy: user,
        user: personLiked,
      };

      fetch(`${process.env.REACT_APP_API_URL}/likes`, {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(liked),
      });
    } else if (direction === 'left') {
      Swal.fire(`You disliked ${name} ;(`);
    }
  };

  // const outOfFrame = (name) => {
  //   console.log(name + 'Left the screen');
  // };

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
          });
      }
    });
  };

  if (data) {
    return (
      <div className="datingCards">
        <div className="datingCardsContainer">
          <DatingCard
            className="swipe"
            key={data._id}
            preventSwipe={['up, down']}
            onSwipe={(direction, name, phoneNumber) => swiped(direction, data?.fullName, data?.phoneNumber)}
            // onCardLeftScreen={(name) => outOfFrame(data.fullName)}
          >
            <div
              className="datingCardsCard"
              style={{backgroundImage: `url(${process.env.REACT_APP_API_URL}/${data?.profilePicture.split('/')[2]})`}}
            >
              <h2>
                {data?.fullName}, {data?.age}, {data?.gender === 'male' ? '♂️' : '♀'}
              </h2>
              {
                JSON.parse(localStorage.getItem('userData')).isAdmin &&
                  (data?.isRestricted ? (
                    <button className="btn btn-inverted" onClick={(id) => unrestrictProfile(data._id)}>
                      Unrestrict
                    </button>
                  ) : (
                    <button className="btn btn-inverted" onClick={(id) => restrictProfile(data._id)}>
                      Restrict
                    </button>
                  ))
                // <button className="btn btn-inverted" onClick={(id) => restrictProfile(data._id)}>Restrict</button>
              }
            </div>
          </DatingCard>
        </div>
      </div>
    );
  } else {
    return <h1>No Profiles</h1>;
  }
};

export default DatingCards;
