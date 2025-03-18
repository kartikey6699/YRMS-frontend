import { useState } from "react";
import bgImage from "../../assets/images/yash_bg.jpg"
import { Link, useNavigate } from "react-router";

const ForgotPasswordOtp = () => {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = (e) => {
        e.preventDefault();
        sessionStorage.setItem("email", email);
        console.log("OTP sent to:", email);
        navigate('/verifyotp')
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >
            <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
                <form onSubmit={handleSendOtp}>
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
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Send OTP
                    </button>
                    <div className="mt-4 text-center">
                        <Link
                            to="/login"
                            className="text-black hover:underline"
                        // className="text-black hover:underline hover:decoration-white text-sm"
                        >
                            back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordOtp;