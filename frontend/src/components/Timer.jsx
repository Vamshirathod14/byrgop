import { motion } from 'framer-motion';

export default function Timer({ secondsLeft, total, color }) {
  const percentage = (secondsLeft / total) * 100;
  
  // Gold colors
  const goldLight = '#FFE87C';
  const goldMain = '#FFD700';
  const goldDark = '#DAA520';
  const goldGlow = 'rgba(255, 215, 0, 0.4)';

  return (
    <div className="relative flex flex-col items-center">
      {/* Timer circle with subtle shiny gold gradient */}
      <div className="relative">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          
          {/* Subtle shiny gold gradient ring with light glow */}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54 * (1 - percentage / 100)}
            animate={{
              strokeDashoffset: 2 * Math.PI * 54 * (1 - percentage / 100)
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              stroke: `url(#shinyGoldGradient)`,
              filter: `drop-shadow(0 0 10px ${goldGlow})`,
            }}
          />
          
          {/* Subtle gold gradient definition */}
          <defs>
            <linearGradient id="shinyGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE87C" />
              <stop offset="35%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFF8DC" />
              <stop offset="65%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#DAA520" />
            </linearGradient>
            
            {/* Subtle shine highlight overlay */}
            <linearGradient id="shineOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
            </linearGradient>
          </defs>
          
          {/* Subtle shine highlight overlay on the ring */}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#shineOverlay)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54 * (1 - percentage / 100)}
            opacity="0.3"
          />
        </svg>
        
        {/* Time text with gold color */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: secondsLeft <= 5 ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: secondsLeft <= 5 ? Infinity : 0,
            repeatDelay: 0.3
          }}
        >
          <span 
            className="font-display text-2xl font-bold"
            style={{
              color: '#FFD700',
              textShadow: `0 0 15px ${goldGlow}`,
            }}
          >
            {Math.ceil(secondsLeft)}
          </span>
        </motion.div>
      </div>
    </div>
  );
}