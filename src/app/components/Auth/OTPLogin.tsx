import { useState } from 'react';
import { motion } from 'motion/react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Mail, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

interface OTPLoginProps {
  onLogin: () => void;
  onNavigate: (page: 'login') => void;
}

export function OTPLogin({ onLogin, onNavigate }: OTPLoginProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleResendOTP = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <AuthLayout title="OTP LOGIN">
      <div>
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <motion.p
              className="text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Enter your email address to receive a one-time password for secure login.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label htmlFor="email" className="text-gray-600 text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="abc@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11 border-gray-300 rounded-lg bg-white"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                className="w-full h-11 text-white rounded-lg shadow-md"
                style={{
                  background: 'linear-gradient(90deg, #C9184A 0%, #AE275F 100%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #AE275F 0%, #800F2F 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #C9184A 0%, #AE275F 100%)';
                }}
              >
                Send OTP
              </Button>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-sm text-[#AE275F] hover:text-[#800F2F] transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </motion.div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-600 text-sm">
                We've sent a 6-digit code to <strong>{email}</strong>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <Label className="text-gray-700 mb-4">Enter OTP Code</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg border-gray-300 rounded-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg border-gray-300 rounded-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg border-gray-300 rounded-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg border-gray-300 rounded-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg border-gray-300 rounded-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg border-gray-300 rounded-lg" />
                </InputOTPGroup>
              </InputOTP>
            </motion.div>

            <motion.div
              className="text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {countdown > 0 ? (
                <p className="text-gray-600">
                  Resend code in <span className="text-[#AE275F]">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-[#AE275F] hover:text-[#800F2F] transition-colors inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend OTP
                </button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                className="w-full h-12 text-white rounded-xl group"
                style={{
                  background: 'linear-gradient(90deg, #C9184A 0%, #AE275F 100%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #AE275F 0%, #800F2F 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #C9184A 0%, #AE275F 100%)';
                }}
              >
                <span>Verify & Login</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-sm text-[#AE275F] hover:text-[#800F2F] transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Email
              </button>
            </motion.div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
