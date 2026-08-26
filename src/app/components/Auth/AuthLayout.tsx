import { ReactNode } from 'react';
import { motion } from 'motion/react';
import logo from 'figma:asset/f11b2ccbc5edb6bf832b728e2ab91c617da855fb.png';
import { Play } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-rose-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Diagonal Background */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-gray-100 to-pink-100 transform -rotate-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Main Container */}
      <motion.div
        className="w-full max-w-6xl relative z-10 grid md:grid-cols-2 gap-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side - Form */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg p-12 md:p-16 rounded-l-3xl shadow-2xl relative overflow-hidden"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Top Logo/Icon */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-6">
              <img src={logo} alt="Xoriant" className="h-10" />
            </div>
            <h1 className="text-gray-400 text-sm tracking-wide mb-2">
              Log in / Sign Up On Xoriant
            </h1>
          </motion.div>

          {/* Form Content */}
          <div className="relative z-10">
            {children}
          </div>
        </motion.div>

        {/* Right Side - Circular Gradient */}
        <motion.div
          className="relative rounded-r-3xl overflow-hidden flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #C9184A 0%, #AE275F 50%, #800F2F 100%)'
          }}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Large Circular Element */}
          <motion.div
            className="absolute -right-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full backdrop-blur-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.8) 0%, rgba(174, 39, 95, 0.8) 100%)'
            }}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner Glow Circle */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-white p-12 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-5xl mb-6">Xoriant</h2>
              <p className="text-white/90 text-sm leading-relaxed mb-8">
                Unified cloud infrastructure management platform. Access powerful analytics, monitoring, and optimization tools for your multi-cloud environment with enterprise-grade security and performance.
              </p>
              
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all">
                  Learn More
                </button>
                <motion.button
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5 text-white fill-white ml-1" />
                </motion.button>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-20 right-20 w-3 h-3 bg-white/40 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-32 left-12 w-2 h-2 bg-white/50 rounded-full"
              animate={{
                y: [0, -15, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute top-40 left-20 w-2.5 h-2.5 bg-white/30 rounded-full"
              animate={{
                y: [0, -25, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
