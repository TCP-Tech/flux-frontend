import { FaArrowRight, FaTrophy, FaCode, FaChartLine, FaBolt } from 'react-icons/fa'
import Header from '../components/Header'
import Footer from '../components/Footer'

function HomePage() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full text-center pb-48 pt-24">
        {/* Badge */}
        <div className="w-full max-w-6xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 mb-8 animate-fade-in-up">
            <FaBolt className="text-primary-400 animate-pulse" />
            <span className="text-sm font-medium text-neutral-300">
              Powered by Advanced Algorithms
            </span>
          </div>

          <h1 className="mt-4 mb-6 text-2xl md:text-5xl font-bold text-neutral-300 animate-fade-in-up animation-delay-200">
            Welcome to
          </h1>
          <h1 className="relative text-6xl md:text-8xl font-bold animate-fade-in-up animation-delay-400">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 animate-gradient-x">
              Flux
            </span>
            {/* Glow effect */}
            <span className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 blur-2xl opacity-50">
              Flux
            </span>
          </h1>

          <p className="mt-12 md:mt-16 font-semibold text-xl md:text-2xl text-neutral-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-400">
              Compete. Code. Conquer.
            </span>
          </p>

          <p className="mt-6 font-normal text-base md:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed animate-fade-in-up animation-delay-800">
            Join the next generation of competitive programmers on an
            <span className="font-semibold text-primary-400"> advanced platform</span> designed for
            excellence
          </p>

          {/* Main Action Buttons */}
          <div className="mb-4 mt-12 p-4 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-1000">
            <a href="/contests" className="group">
              <button className="relative inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950 hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-105 overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-400 to-primary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <FaTrophy size={18} />
                  Browse Contests
                  <FaArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={14}
                  />
                </span>
              </button>
            </a>
            <a href="/problems" className="group">
              <button className="relative inline-flex h-14 items-center justify-center rounded-xl border-2 border-neutral-700 bg-neutral-900/50 backdrop-blur-sm px-8 font-semibold text-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950 hover:bg-neutral-800/80 hover:border-neutral-600 hover:text-white hover:shadow-xl hover:scale-105">
                <span className="relative flex items-center gap-2">
                  <FaCode size={18} />
                  Solve Problems
                  <FaArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={14}
                  />
                </span>
              </button>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 px-4 animate-fade-in-up animation-delay-1200">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400">10K+</div>
              <div className="text-sm text-neutral-500 mt-1">Active Users</div>
            </div>
            <div className="w-[1px] bg-neutral-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-400">500+</div>
              <div className="text-sm text-neutral-500 mt-1">Problems</div>
            </div>
            <div className="w-[1px] bg-neutral-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-400">100+</div>
              <div className="text-sm text-neutral-500 mt-1">Contests</div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 mb-8">
            <div className="group relative p-8 rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/10 animate-fade-in-up animation-delay-1400">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/50">
                  <FaTrophy className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-200 mb-3">Competitive Contests</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Participate in timed contests and multi-round tournaments. Test your skills
                  against the best.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary-500/10 animate-fade-in-up animation-delay-1600">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary-500/50">
                  <FaCode className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-200 mb-3">Premium Problems</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Access curated competitive programming challenges across all difficulty levels.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent-500/10 animate-fade-in-up animation-delay-1800">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent-500/50">
                  <FaChartLine className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-200 mb-3">Global Leaderboards</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Track your progress, climb the ranks, and compete with programmers worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
