import { useState } from "react";
import bgImage from "../../assets/images/yash_bg.jpg"
import { Link, useNavigate } from "react-router";

const VerifyOtp = () => {

    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const navigate = useNavigate();

    const handleVerifyOtp = (e) => {
        e.preventDefault();

        console.log("OTP:", otp);
        // Call API or other backend logic here
        navigate('/forgotpassword')
    }

    const handleResendOtp = (e) => {
        e.preventDefault();
        const email = sessionStorage.getItem("email");
        console.log("re-sent otp on mail:", email);
        // Call API or other backend logic here
    }

    const handleResendClick = (e) => {
        e.preventDefault();
        handleResendOtp(e);
        setIsButtonDisabled(true);
        setTimer(30);

        // Start the countdown
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setIsButtonDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >
            <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Forgot Password
                </h2>
                <form onSubmit={handleVerifyOtp}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter OTP"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Verify OTP
                    </button>
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={handleResendClick}
                            disabled={isButtonDisabled}
                            className={`bg-gray-300 text-gray-700 py-1 px-3 rounded-lg transition duration-300 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"
                                }`}
                        >
                            {isButtonDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VerifyOtp;