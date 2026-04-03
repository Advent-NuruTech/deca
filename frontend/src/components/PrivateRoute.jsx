import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo || userInfo.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default PrivateRoute;
