import './navbarhome.css';
import { Link } from "react-router-dom";
import { userData } from '../contexts/userProfile';
import { useAuth } from "../contexts/Authcontext";

export default function NavBar() {
  const { logout } = useAuth();

  function closeNavLink() {
    window.scroll(0, 0);
  }

  return (
    <div>
      <nav>
        <div className="firstNav">
          <Link to='/' onClick={closeNavLink}>
            <p className="logo">CCNYZero</p>
          </Link>
          <div>
            <Link to='/AboutUs' onClick={closeNavLink}>
              <p className="links">About Us</p>
            </Link>
            {(userData.getRole() === 1) &&
              <Link to='/instructorView' onClick={closeNavLink}>
                <p className="links">Instructor</p>
              </Link>
            }
            {
              userData.getStatus() && <p className="username"> {userData.getName()} </p>
            }
            {
              userData.getStatus() && <p className="empl"> {userData.getEmpl()} </p>
            }
             {
              userData.getStatus() && <button onClick={() => logout()} className="signout"> Sign Out</button>
            }
            {(userData.getRole() === 0) &&
              <Link to='/Studentview' onClick={closeNavLink}>
                <p className="links">Student</p>
              </Link>
            }
            {(userData.getRole() === 2) &&
              <Link to='/RegistrarsApplication' onClick={closeNavLink}>
                <p className="links">Review Applications</p>
              </Link>
            }
            {(userData.getRole() === 2) &&
              <Link to='/Registrarscomplains' onClick={closeNavLink}>
                <p className="links">Review Complains</p>
              </Link>
            }
            {((userData.getRole() === 2) && (userData.getPeriod() === 0)) &&
              <Link to='/Regclasssetup' onClick={closeNavLink}>
                <p className="links">Class set-up period</p>
              </Link>
            }
          </div>

        </div>
      </nav>
    </div>
  )
}
