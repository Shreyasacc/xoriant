import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ArrowRight, ArrowLeft, CheckCircle2, Check } from 'lucide-react';

interface SignUpProps {
  onSignUp: () => void;
  onNavigate: (page: 'login') => void;
}

export function SignUp({ onSignUp, onNavigate }: SignUpProps) {
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp();
  };

  return (
    <AuthLayout title="SIGN UP">
      <div className="mb-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#AE275F]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step >= 1 ? 'border-[#AE275F] bg-pink-50' : 'border-gray-300 bg-white'} ${step > 1 ? 'bg-[#AE275F] border-[#AE275F]' : ''}`}>
              {step > 1 ? <CheckCircle2 className="w-5 h-5 text-white" /> : <span className={step >= 1 ? 'text-[#AE275F]' : 'text-gray-400'}>1</span>}
            </div>
            <span className="text-sm">Account</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-[#AE275F]' : 'bg-gray-300'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#AE275F]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step >= 2 ? 'border-[#AE275F] bg-pink-50 text-[#AE275F]' : 'border-gray-300 bg-white text-gray-400'}`}>
              2
            </div>
            <span className="text-sm">Details</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            onSubmit={handleNextStep}
            className="space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="name" className="text-gray-600 text-sm">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5 h-11 border-gray-300 rounded-lg bg-white"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="email" className="text-gray-600 text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="abc@xyz.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5 h-11 border-gray-300 rounded-lg bg-white"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="password" className="text-gray-600 text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1.5 h-11 border-gray-300 rounded-lg bg-white"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
              <Button
                type="submit"
                className="w-full h-11 text-white rounded-lg shadow-md group"
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
                <span>Continue</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              className="text-center pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-[#AE275F] hover:text-[#800F2F] transition-colors"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="company" className="text-gray-600 text-sm">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Your Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1.5 h-11 border-gray-300 rounded-lg bg-white"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="confirmPassword" className="text-gray-600 text-sm">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1.5 h-11 border-gray-300 rounded-lg bg-white"
                required
              />
            </motion.div>

            <motion.div
              className="pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="sr-only"
                    required
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                      agreedToTerms
                        ? 'border-[#AE275F] bg-pink-50'
                        : 'border-gray-300 bg-white group-hover:border-gray-400'
                    }`}
                  >
                    {agreedToTerms && (
                      <Check className="w-3.5 h-3.5 text-[#AE275F]" strokeWidth={3} />
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-600 select-none leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </motion.div>

            <motion.div
              className="flex gap-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 h-11 border-gray-300 rounded-lg group"
              >
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 text-white rounded-lg shadow-md"
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
                Create Account
              </Button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
