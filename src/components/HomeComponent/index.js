import {Link} from 'react-router-dom'
import {FiUserPlus} from 'react-icons/fi'
import {CgUserList} from 'react-icons/cg'
import './index.css'

const HomeComponent = () => (
  <div className="home-main-container">
    <Link to="/register" className="link-item">
      <button type="button" className="home-buttons">
        <FiUserPlus className="react-icon" />
        Register user
      </button>
    </Link>
    <Link to="/users" className="link-item">
      <button type="button" className="home-buttons">
        <CgUserList className="react-icon" />
        View All Users
      </button>
    </Link>
  </div>
)

export default HomeComponent
