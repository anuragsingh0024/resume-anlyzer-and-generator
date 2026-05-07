import React, { useState } from 'react';
import { GitFork, Mail, ArrowRight, ShieldCheck, RefreshCcw } from 'lucide-react'; // Check karo RefreshCcw yahan hai
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import axiosInstance from '../services/axiosInstance';
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/authSlice';
import toast from 'react-hot-toast';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitingSignUp, setIsSubmitingSignUp] = useState(false);
  const [isSubmitingSignUp2, setIsSubmitingSignUp2] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //conver guest to user
  const convertGuestToUser = async () => {
    try {
      const tempId = localStorage.getItem("tempId");
      if (!tempId || tempId === "null" || tempId === "undefined") {
        return;
      }
      const response = await axiosInstance.put(`/resume/update-guest-to-user`, { tempId });
      if (response.status != 200) {
        console.log("error while update guest to user: ", response)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // 1. Send OTP Function
  const handleSendOtp = async () => {

    if (!email) {
      toast.error("Please enter the email!")
      return
    }
    const loadingToast = toast.loading("Sending Otp...")
    try {

      setIsSubmitingSignUp(true)
      const response = await axiosInstance.post('/auth/email-auth', { email });
      if (response.status === 200) {
        setIsOtpSent(true);
        toast.dismiss(loadingToast)
        toast.success("Otp sent")
      } else {
        toast.dismiss(loadingToast)
        toast.error(response.data.msg);

      }
      setIsSubmitingSignUp(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Error:', error);
      // Testing ke liye isse true kar sakte ho agar backend ready nahi hai:
      // setIsOtpSent(true); 

      setIsSubmitingSignUp(false)
    }
  };

  // 2. Verify OTP Function
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the otp!")
      return
    }
    if (otp.length < 6) {
      toast.error("Otp must be 6 digit!")
      return
    }
    const loadingToast = toast.loading("Verifying otp...")
    try {

      setIsSubmitingSignUp2(true)
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      if (response.status === 200) {
        toast.success("Login successful");
        toast.dismiss(loadingToast)
        dispatch(loginSuccess(response.data.user))
        setIsSubmitingSignUp2(false)
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("role", response.data.user.role)
        const tempId = localStorage.getItem("tempId");
        if (tempId && tempId !== "null" && tempId !== "undefined") {
          console.log("tempId: ", tempId)
          await convertGuestToUser();
        }
        navigate('/dashboard')
        // setTimeout(() => {
        //   window.location.reload();
        // }, 800);

      } else {
        toast.dismiss(loadingToast)
        toast.error(response.data.message);
        setIsSubmitingSignUp2(false)
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to verify OTP";
      toast.dismiss(loadingToast)
      toast.error(message)
      console.error('Error:', error);

      setIsSubmitingSignUp2(false)
    }
  };


  //google login
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // ⚠️ ye access_token hota hai
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const user = res.data;

        // backend ko bhejo
        const backendRes = await axiosInstance.post(
          "/auth/google",
          { user }
        );

        // JWT save
        localStorage.setItem("token", backendRes.data.token);

        console.log("Login success", backendRes.data);

      } catch (err) {
        console.log(err);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  //google login 2
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        toast.error("Google login failed (No token)");
        return;
      }

      const res = await axiosInstance.post("/auth/google", {
        idToken,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role)
      dispatch(loginSuccess(res.data.user));

      toast.success("Login successful");
      await convertGuestToUser();
      navigate("/dashboard");
      // window.location.reload()

    } catch (err) {
      console.log(err);
      toast.error("Google login failed");
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    toast.error("Google login failed");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20 px-6 relative">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {!isOtpSent ? (
          /* --- STEP 1: EMAIL UI --- */
          <div className="glass-card p-10 border border-white/10 shadow-2xl">
            <div className="text-center mb-10">
              <Link to="/" className="text-2xl font-black tracking-tighter inline-block mb-6">
                RESUME<span className="text-primary">.AI</span>
              </Link>
              <h2 className="text-3xl font-bold text-text-primary">Welcome Back</h2>
              <p className="text-text-secondary mt-2 text-sm">Apne career ko boost karne ke liye login karein.</p>
            </div>

            <div className="space-y-4 mb-8">

              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#24292e] text-white rounded-xl font-semibold border border-white/10 hover:bg-[#2b3137] transition-all active:scale-[0.98]">
                <GitFork className="w-5 h-5" />
                Continue with GitHub
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-muted"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface px-4 text-text-secondary">Or email</span></div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendOtp()
                      }
                    }}
                    placeholder="name@example.com"
                    className="w-full bg-background border border-border-muted p-4 pl-12 rounded-xl focus:border-primary outline-none transition-all text-text-primary"
                  />
                </div>
              </div>
              <button
                disabled={isSubmitingSignUp}
                onClick={handleSendOtp} className="group w-full py-4 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(163,166,255,0.4)] transition-all">
                Send Login OTP <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* --- STEP 2: OTP UI (Ab render hoga!) --- */
          <div className="glass-card p-10 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
                <ShieldCheck className="text-accent w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Verify OTP</h2>
              <p className="text-text-secondary mt-2 text-sm">
                Code sent to <span className="text-primary">{email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleVerifyOtp()
                    }
                  }}
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-background border border-border-muted p-5 rounded-xl focus:border-accent outline-none text-center text-2xl font-black tracking-[0.5em] text-accent"
                />
              </div>

              <button
                disabled={isSubmitingSignUp2}

                onClick={handleVerifyOtp} className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                Verify & Continue <ArrowRight className="w-5 h-5" />
              </button>
              <div className="text-center space-y-4">
                <button onClick={handleSendOtp} className="flex items-center justify-center gap-2 mx-auto text-sm text-text-secondary hover:text-primary transition-colors">
                  <RefreshCcw size={14} /> Didn't receive? <span className="font-bold underline">Resend</span>
                </button>
                <button onClick={() => setIsOtpSent(false)} className="text-xs text-text-secondary hover:text-white block w-full underline">
                  Back to Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full mt-10"><Footer /></div>
    </div>
  );
};

export default LoginPage;