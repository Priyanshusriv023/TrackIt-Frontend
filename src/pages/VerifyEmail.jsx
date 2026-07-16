import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios.js";

export default function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying | success | error
    const hasVerified = useRef(false);
    useEffect(() => {
        const verify = async () => {
             if (hasVerified.current) return; 
             hasVerified.current = true;


            try {
                await axiosInstance.get(`/auth/verify-email/${token}`);
                setStatus("success");
            } catch (err) {
                setStatus("error");
            }
        };
        verify();
    }, [token]);

    if (status === "verifying") return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Verifying your email...</p>
        </div>
    );

    if (status === "success") return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">Email Verified!</h2>
                <p className="text-gray-400 text-sm mb-6">Your account is now active. You can sign in.</p>
                <Link
                    to="/login"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">Verification Failed</h2>
                <p className="text-gray-400 text-sm mb-6">Token is invalid or expired. Request a new one.</p>
                <Link
                    to="/login"
                    className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
}