import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = props => {
  const renderJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <>
      <Header />
      <div className="container">
        <h1 className="heading">
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p className="para">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" onClick={renderJobs}>
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home
