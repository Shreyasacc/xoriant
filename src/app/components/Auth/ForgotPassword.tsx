import { useState } from 'react';
import { motion } from 'motion/react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (page: 'login') => void;
}

export function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <AuthLayout title="FORGOT PASSWORD">
      <div>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.p
              className="text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Enter your email address and we'll send you instructions to reset your password.
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
                Send Reset Link
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
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Mail className="w-10 h-10 text-[#AE275F]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-gray-600 text-sm">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => onNavigate('login')}
                className="text-white rounded-xl"
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
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Login
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AuthLayout>
  );
}
