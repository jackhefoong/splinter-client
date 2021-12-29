import {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import Report from './Report';

function Reports() {
  let [reports, setReports] = useState([]);

  const allReports = () => {
    fetch(`${process.env.REACT_APP_API_URL}/admin/`, {
      method: 'GET',
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data && setReports(data?.reverse());
      });
  };

  useEffect(() => {
    allReports();
  }, []);

  let showReports = reports?.map((report) => {
    return <Report data={report} key={report._id} refresh={allReports} />;
  });

  return <Container className="mt-5">{showReports ? showReports : <h1>No Reports</h1>}</Container>;
}

export default Reports;
