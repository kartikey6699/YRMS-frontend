import { useState } from "react";
import bgImage from "../../assets/images/yash_bg.jpg"
import { Link, useNavigate } from "react-router";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        const yashRegex = /^[a-zA-Z0-9._%+-]+@yash\.com$/;

        if (!yashRegex.test(inputEmail)) {
            setEmailError('Please enter a valid Yash email address.');
        } else {
            setEmailError('');
        }
        setEmail(inputEmail);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log(">>>>>>>>>>>>>>>>>login>>>>>>>>>>>");
        navigate('/dashboard');
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >
            <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Login
                </h2>
                <form onSubmit={handleLoginSubmit}>
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
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
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
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? (
                                // Eye slash icon (hidden)
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                // Eye icon (visible)
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={emailError || !email} // Disable if there's an error or if email is empty
                        className={`w-full py-2 px-4 rounded-lg transition duration-300 ${emailError || !email
                                ? 'bg-blue-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-600 cursor-pointer'
                            }`}
                    >
                        Login
                    </button>
                    <div className="mt-4 text-center">
                        <Link
                            to="/forgotpasswordotp"
                            className="text-black hover:underline"
                        // className="text-black hover:underline hover:decoration-white text-sm"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login