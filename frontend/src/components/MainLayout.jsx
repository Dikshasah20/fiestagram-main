import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {

  // useEffect(() => {
  //   console.log("interceptor runned")
  //   // Axios interceptor to add Authorization header with the token for each request
  //   const interceptor = axios.interceptors.request.use(
  //     (config) => {
  //       if (token) {
  //         config.headers.Authorization = `Bearer ${token}`;
  //       }
  //       return config;
  //     },
  //     (error) => Promise.reject(error)
  //   );

  //   // Clean up interceptor on component unmount
  //   return () => {
  //     axios.interceptors.request.eject(interceptor);
  //   };
  // }, [token]); // Re-run if token changes


  return (
    <div>
      <LeftSidebar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout