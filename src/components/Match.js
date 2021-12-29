import {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';

import DatingCards from './DatingCards';

function Match() {
  const [allProfiles, setAllProfiles] = useState([]);
  const [check, setCheck] = useState({});
  const [likes, setLikes] = useState(null);

  const myLikes = () => {
    let phoneNum = JSON.parse(localStorage.getItem('userData')).phoneNumber;
    fetch(`${process.env.REACT_APP_API_URL}/likes/${phoneNum}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLikes(data[0]?.likes);
      });
  };

  const getAllProfiles = (phoneNum) => {
    phoneNum = [JSON.parse(localStorage.getItem('userData')).phoneNumber];
    if(likes) {
      phoneNum.push(...likes);
    } else {
      console.log("no likes")
    }
    console.log(phoneNum);
    fetch(`${process.env.REACT_APP_API_URL}/profiles/except/${phoneNum}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data && setAllProfiles(data)
        console.log(data)
      });
  };

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

  console.log(allProfiles)

  if (localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('userData')) {
    var showAllProfiles = allProfiles?.map((profiles) => {
      return <DatingCards data={profiles} key={profiles._id} />;
    });
  }

  //count swipe compare w map length . display nomore profiles

  useEffect(() => {
    myLikes();
    checkUser();
  }, []);

  useEffect(() => {
    if (likes || JSON.parse(localStorage.getItem('userData')).isAdmin) {
      getAllProfiles();
    } else {
    }
  }, [likes]);

  if (check.length !== 0 && check?.isRestricted === false) {
    if (allProfiles.length !== 0) {
      return showAllProfiles;
    } else {
      return (
        <Container className="bgOpaque text-center text-white p-5 mt-5">
          <h1>You already liked everyone, get a life</h1> 
        </Container>
      );
    }
  } else if (check?.isRestricted === true) {
    return (
      <Container className="bgOpaque text-center text-white p-5 mt-5">
        <h1>Your account has been restricted</h1>
      </Container>
    );
  } else if (JSON.parse(localStorage.getItem('userData')).isAdmin) {
    return showAllProfiles
  } else {
    return (
      <Container className="bgOpaque text-center text-white p-5">
        <h1>Set up your dating profile before you start swiping!</h1>
        <a href="/myProfile" className="btn btn-light text-clr">
          Create Profile
        </a>
      </Container>
    );
  }
}

export default Match;
