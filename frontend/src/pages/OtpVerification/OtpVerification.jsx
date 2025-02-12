import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpVerification.css";

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { data } = location.state || {};
    
    const email = data?.email;
    const source = data?.source; // Determine the source (signup or forgot-password)
    
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/api/users/verify?email=${email}&otp=${otp}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                
                if (data.success) {
                    alert("OTP Verified Successfully!");
                    
                    if (source === "forgot-password") {
                        navigate("/reset-password", { state: { email } });
                    } else {
                        navigate("/login");
                    }
                } else {
                    setError("Invalid OTP. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error verifying OTP:", error);
                setError("Failed to verify OTP. Please try again later.");
            });
    };

    return (
        <div className="otp-container">
            <h2>OTP Verification</h2>
            <p>Enter the OTP sent to your email: <strong>{email}</strong></p>
            <form onSubmit={handleSubmit}>
                <input type="number" name="otp" value={otp} onChange={handleChange} placeholder="Enter OTP" required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="otp-btn">Verify OTP</button>
            </form>
        </div>
    );
};

export default OtpVerification;
