import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import bgImage from "../../assets/images/yash_bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../../features/auth/authAction";
import { SuccessToast, ErrorToast } from "../../component/helper/ResourceToast";
import YRMSLoader from "../../component/helper/loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already logged in by checking for token in session storage
    const token = sessionStorage.getItem("token");
    const roleName = sessionStorage.getItem("roleName");
    let redirectPath = "/dashboard";

    if (roleName) {
      const userRoles = roleName.split(",").map(role => role.trim());
            
      if (userRoles.includes("SuperAdmin")) {
        redirectPath = "/superuser-dashboard";
      } else if (userRoles.includes("Admin")) {
        redirectPath = "/dashboard"; 
      } else if (userRoles.includes("Trainer")) {
        redirectPath = "/trainer-dashboard";
      } else if (userRoles.length === 1 && userRoles.includes("User")) {
        redirectPath = "/user-dashboard";
      }
    }

    if (token) {
      navigate(redirectPath);
    } else if (isAuthenticated) {
      setToast(<SuccessToast message="Login successful!" onClose={() => setToast(null)} />);
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate]);


  // Email validation
  const validateEmail = (inputEmail) => {
    const yashRegex = /^[a-zA-Z0-9._%+-]+@yash\.com$/;
    return yashRegex.test(inputEmail);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    if (!validateEmail(inputEmail) && inputEmail.length > 0) {
      setEmailError("Please enter a valid Yash email address.");
    } else {
      setEmailError("");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validate form data before making API call
    if (emailError || !email || !password) {
      setToast(<ErrorToast message="Please fill in all required fields correctly" onClose={() => setToast(null)} />);
      return;
    }

    const loginData = { email, password };

    try {
      // Dispatch login action and handle response
      await dispatch(adminLogin(loginData)).unwrap();
      // Success toast and navigation handled by useEffect
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err || "Login failed. Please try again.";
      setToast(<ErrorToast message={errorMessage} onClose={() => setToast(null)} />);
      console.error("Login failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {loading && <YRMSLoader loadingMessage="Logging in, please wait..." />}
      {toast}
      <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <form onSubmit={handleLoginSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="mb-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || emailError || !email || !password}
            className={`w-full py-2 px-4 rounded-lg transition duration-300 ${
              loading || emailError || !email || !password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 text-center">
            <Link
              to="/forgotpasswordotp"
              className="text-black hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;