import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    checkboxInput: [],
    radioInput: '',
    searchInput: '',
    profileData: [],
    jobsData: [],
    apiJobStatus: apiJobsStatusConstants.initial,
  }

  componentDidMount() {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, options)
    if (response.ok === true) {
      const data = [await response.json()]
      const updateData = data.map(eachOne => ({
        name: eachOne.profile_details.name,
        profileImageUrl: eachOne.profile_details.profile_image_url,
        shortBio: eachOne.profile_details.short_bio,
      }))
      this.setState({
        profileData: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onGetJobDetails = async () => {
    this.setState({apiJobStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, optionJobs)
    const data = await response.json()
    console.log(data)
    console.log(response)
    if (response.ok === true) {
      const newData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsData: newData,
        apiStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiJobsStatusConstants.failure})
    }
  }

  renderSuccessProfile = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData[0]

    return (
      <div>
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onRetryProfile = () => {
    this.onGetProfileDetails()
  }

  renderFailureProfile = () => (
    <div>
      <button type="button" onClick={this.onRetryProfile}>
        retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onCheckOption = event => {
    const {checkboxInput} = this.state
    const inputNotListed = checkboxInput.filter(
      eachOne => eachOne === event.target.id,
    )
    if (inputNotListed.length === 0) {
      this.setState(
        prevState => ({
          checkboxInput: [...prevState.checkboxInput, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filterData = checkboxInput.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkboxInput: filterData}, this.onnGetJobDetails)
    }
  }

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessProfile()
      case apiJobsStatusConstants.failure:
        return this.renderFailureProfile()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  onRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.onGetJobDetails)
  }

  checkBoxView = () => (
    <ul>
      {employmentTypesList.map(eachOne => (
        <li key={eachOne.employmentTypeId}>
          <input
            type="checkbox"
            id={eachOne.employmentTypeId}
            onChange={this.onCheckOption}
          />
          <label htmlFor={eachOne.employmentTypeId}>{eachOne.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul>
        {jobsData.map(eachItem => (
          <JobItem key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  onFailureView = () => (
    <div className="failure-img-button-container">
      <img className="failure-img" src={failureViewImg} alt="failure view" />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.onRetryJobs}
        >
          retry
        </button>
      </div>
    </div>
  )

  renderJobDetails = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobsStatusConstants.success:
        return this.onGetJobsView()
      case apiJobsStatusConstants.failure:
        return this.onFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  radioView = () => (
    <ul>
      {salaryRangesList.map(eachOne => (
        <li key={eachOne.salaryRangeId}>
          <input
            type="checkbox"
            id={eachOne.salaryRangeId}
            onChange={this.onRadioOption}
          />
          <label htmlFor={eachOne.salaryRangeId}>{eachOne.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeyEnter = event => {
    if (event.key === 'Enter') {
      this.onGetJobDetails()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div>
          <div>
            {this.renderAll()}
            <hr />
            <h1>Type of Employment</h1>
            {this.checkBoxView()}
            <hr />
            <h1>Salary Range</h1>
            {this.radioView()}
          </div>
          <div>
            <div>
              <input
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onKeyEnter}
              />
              <button type="button">
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobDetails()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
