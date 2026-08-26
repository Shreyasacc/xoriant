import { useState } from 'react';
import { motion } from 'motion/react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Check } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onNavigate: (page: 'signup' | 'forgot' | 'otp') => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <AuthLayout title="LOGIN">
      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
          transition={{ delay: 0.6 }}
        >
          <Label htmlFor="password" className="text-gray-600 text-sm">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 h-11 border-gray-300 rounded-lg bg-white"
          />
        </motion.div>

        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                  rememberMe
                    ? 'border-[#AE275F] bg-pink-50'
                    : 'border-gray-300 bg-white group-hover:border-gray-400'
                }`}
              >
                {rememberMe && (
                  <Check className="w-3.5 h-3.5 text-[#AE275F]" strokeWidth={3} />
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600 select-none">Remember Me</span>
          </label>
          <button
            type="button"
            onClick={() => onNavigate('forgot')}
            className="text-sm text-gray-600 hover:text-[#AE275F] transition-colors"
          >
            Forgot password?
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
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
            Log in
          </Button>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm text-gray-600 mb-4">or connect with</p>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="text-center pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-[#AE275F] hover:text-[#800F2F] transition-colors"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  );
}
