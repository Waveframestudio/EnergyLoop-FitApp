import { CountUp } from './CountUp';

interface Props {
  consumed: number;
  burned: number;
  goal: number;
  theme: 'light' | 'dark';
}

export function CalorieRing({ consumed, burned, goal, theme }: Props) {
  const size = 250;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Industry Standard: Goal - Food + Exercise = Remaining
  const remaining = goal - consumed + burned;
  const totalBudget = goal + burned;
  
  // Progress: How much of the total budget is filled by food?
  const progressPct = totalBudget > 0 ? Math.min(consumed / totalBudget, 1) : 0;
  const progressOffset = circumference * (1 - progressPct);

  const overGoal = remaining < 0;

  const trackColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  
  // Color logic - Porsche aesthetic
  let progressColor = theme === 'dark' ? '#fbfcff' : '#010205';
  if (overGoal) progressColor = '#e60019'; // Porsche Red

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-10"
        style={{ 
          background: overGoal ? '#e60019' : (theme === 'dark' ? '#fbfcff' : '#018a16'),
          transition: 'background 0.5s ease'
        }}
      />

      <svg 
        width={size} 
        height={size} 
        style={{ transform: 'rotate(-90deg)' }} 
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={progressColor} />
            <stop offset="100%" stopColor={overGoal ? '#ff4d4d' : (theme === 'dark' ? '#afb0b3' : '#535457')} />
          </linearGradient>
        </defs>

        {/* Outer Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          style={{
            strokeLinecap: 'round',
            transition: 'stroke-dashoffset 1.5s cubic-bezier(.34, 1.56, 0.64, 1), stroke 0.3s ease',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center leading-none">
          <div
            className="font-black tracking-tighter"
            style={{ 
              fontSize: 64, 
              color: overGoal ? '#e60019' : (theme === 'dark' ? '#fbfcff' : '#010205'),
              transition: 'color 0.3s ease'
            }}
          >
            <CountUp value={Math.abs(remaining)} />
          </div>
          <span
            className="text-[11px] font-black uppercase tracking-[0.25em] mt-1 opacity-60"
            style={{ color: theme === 'dark' ? '#afb0b3' : '#535457' }}
          >
            {overGoal ? 'EXCESO' : 'RESTANTES'}
          </span>
        </div>
      </div>
    </div>
  );
}
