import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <nav className="flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <span className="text-lg">💪</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Fit<span className="text-primary-400">Connect</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-dark-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-dark-800/50 transition-all">
              Sign in
            </Link>
            <Link to="/register" className="bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-400/30 transition-all">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row items-center gap-16 pt-12 pb-20">
          <div className="flex-1 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-primary-300 text-xs font-medium tracking-wide uppercase">500+ Active Users</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
              Find Your{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-blue-500 bg-clip-text text-transparent">
                Perfect Match
              </span>
              <br />at the Gym
            </h1>
            <p className="text-dark-300 text-base md:text-lg leading-relaxed mb-8">
              FitConnect uses smart matching to pair you with gym partners who share your goals, schedule, and experience. Never workout alone again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold px-6 py-3 rounded-xl shadow-xl shadow-primary-500/30 hover:shadow-primary-400/40 transition-all text-sm"
              >
                Start Matching Free
              </Link>
              <Link
                to="/login"
                className="bg-dark-800/80 hover:bg-dark-700 border border-dark-600 text-dark-200 hover:text-white font-medium px-6 py-3 rounded-xl transition-all text-sm"
              >
                Sign In
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start">
              {[
                { num: '95%', label: 'Match Rate' },
                { num: '1k+', label: 'Workouts Paired' },
                { num: '4.9', label: 'User Rating' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">{s.num}</div>
                  <div className="text-dark-500 text-xs font-medium uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-dark-800/90 backdrop-blur-xl border border-dark-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dark-700">
                  <div className="flex -space-x-2">
                    {['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-800" style={{ background: c }}></div>
                    ))}
                  </div>
                  <div className="text-xs text-dark-400">
                    <span className="text-green-400 font-medium">● 12 people</span> online now
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { name: 'Rahul', goal: 'Muscle Gain', time: 'Morning', match: '92%', color: 'from-primary-400 to-blue-400' },
                    { name: 'Priya', goal: 'Weight Loss', time: 'Evening', match: '85%', color: 'from-green-400 to-emerald-400' },
                    { name: 'Amit', goal: 'Muscle Gain', time: 'Morning', match: '78%', color: 'from-yellow-400 to-orange-400' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between bg-dark-900/60 rounded-xl p-3 hover:bg-dark-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-bold`}>
                          {item.name[0]}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{item.name}</div>
                          <div className="text-dark-400 text-xs">{item.goal} · {item.time}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.match}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: '🎯', label: 'Smart Matching', desc: 'AI-powered' },
                    { icon: '💬', label: 'Real-Time Chat', desc: 'Connect instantly' },
                    { icon: '📊', label: 'Compatibility', desc: 'Score breakdown' },
                    { icon: '🏆', label: 'Stay Motivated', desc: 'Never alone' },
                  ].map((f) => (
                    <div key={f.label} className="bg-dark-900/40 rounded-xl p-3 border border-dark-700/50">
                      <div className="text-lg mb-1">{f.icon}</div>
                      <div className="text-white text-xs font-semibold">{f.label}</div>
                      <div className="text-dark-500 text-[10px]">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🎯', title: 'Goal Matching', desc: 'Same fitness objectives' },
              { icon: '⏰', title: 'Schedule Sync', desc: 'Match workout times' },
              { icon: '📈', title: 'Level Alignment', desc: 'Compatible experience' },
              { icon: '📍', title: 'Location Based', desc: 'Find buddies near you' },
            ].map((f) => (
              <div key={f.title} className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-4 text-center hover:bg-dark-800 hover:border-dark-600 transition-all">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-white text-sm font-semibold">{f.title}</div>
                <div className="text-dark-500 text-xs mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
