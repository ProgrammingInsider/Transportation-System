import {Link} from 'react-router-dom'

const Error = () => {
  return <>
    <div className='errorPage'>

      <h1 className='null Error'>404 Page Not Found</h1>
      <Link to={"/login"}>Back to Home</Link>
      
    </div>
  </>
}

export default Error