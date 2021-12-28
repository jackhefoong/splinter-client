import {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import AddPost from './forms/AddPost';
import Post from './Post';

function Posts() {
  let [posts, setPosts] = useState([]);
  let [check, setCheck] = useState({});

  const allPosts = () => {
    fetch(`${process.env.REACT_APP_API_URL}/posts`, {
      method: 'GET',
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data && setPosts(data.reverse());
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

  useEffect(() => {
    allPosts();
    checkUser();
  }, []);

  let showPosts = posts?.map((post) => {
    return <Post data={post} key={post._id} refresh={allPosts} />;
  });

  if (check.length !== 0 && check?.isRestricted === false) {
    return (
      <Container className="mt-5">
        <AddPost allPosts={allPosts} author={check} /> {showPosts}
      </Container>
    );
  } else if (check?.isRestricted === true) {
    return (
      <Container className="bgOpaque text-center text-white p-5 mt-5">
        <h1>Your account has been restricted</h1>
      </Container>
    );
  } else if (JSON.parse(localStorage.getItem('userData')).isAdmin) {
    return (
      <Container className="mt-5">
        {showPosts}
      </Container>
    );
  } else {
    return (
      <Container className="mt-5">
        <h1>Set up your dating profile first goddamn</h1>
        <a href="/myProfile" className="btn btn-light text-clr">
          Create Profile
        </a>
      </Container>
    );
  }

  // return (
  //   <Container className="mt-5">
  //     {check.length !== 0 ? (
  //       <>
  //         <AddPost allPosts={allPosts} author={check[0]} /> {showPosts}
  //       </>
  //     ) : (
  //       <Container className="bgOpaque text-center text-white p-5">
  //         <h1>Set up your dating profile first goddamn</h1>
  //         <a href="/myProfile" className="btn btn-light text-clr">
  //           Create Profile
  //         </a>
  //       </Container>
  //     )}
  //   </Container>
  // );
}

export default Posts;
