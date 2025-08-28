
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-4 w-96 h-96 bg-gradient-to-br from-green-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cliona
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Features</a>
            <a href="#use-cases" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Use Cases</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">About</a>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
            Get Early Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating icons */}
          <div className="absolute top-16 left-16 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-24 right-16 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-1/4 w-4 h-4 bg-gradient-to-br from-pink-400 to-red-500 rounded-full shadow-lg opacity-25 animate-bounce" style={{animationDelay: '3s'}}></div>

          <div className="relative">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-sm font-semibold text-green-700 mb-6">
              <span className="mr-2">✅</span>
              Official WhatsApp Business API Partner
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn WhatsApp Into Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                #1 Revenue Channel
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto font-medium">
              Automate conversations, recover abandoned carts, and convert leads into customers with AI-powered WhatsApp & RCS messaging.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-2 text-green-500">⚡</span>
                Setup in 5 minutes
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-blue-500">📱</span>
                No app downloads required
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-purple-500">🚀</span>
                500K+ messages processed daily
              </div>
            </div>
            
            {/* Enhanced CTA buttons with urgency */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center">
                  <span className="mr-2 text-lg">🚀</span>
                  Start Free 14-Day Trial
                  <span className="ml-2 px-2 py-1 bg-yellow-400 text-green-800 text-xs font-bold rounded-full animate-pulse">FREE</span>
                </span>
              </button>
              <button className="group bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-blue-400 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center">
                  <span className="mr-2 text-lg">📞</span>
                  Watch 2-Min Demo
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
            
            {/* Urgency indicator */}
            <div className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-8">
              <span className="mr-2 animate-pulse">🔥</span>
              Limited time: Get WhatsApp API setup worth $500 FREE
            </div>

            {/* Enhanced dashboard preview */}
            <div className="relative mt-8 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-lg transform scale-105"></div>
              <div className="relative bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
                <div className="text-gray-500 mb-4 flex items-center justify-center">
                  <span className="mr-2 text-sm">💻</span>
                  <span className="text-sm">Platform Dashboard Preview</span>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 shadow-inner border">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-green-200 to-blue-200 rounded-full w-1/2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-2/3 animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-sm animate-pulse transform hover:scale-105 transition-transform"></div>
                      <div className="h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-sm animate-pulse transform hover:scale-105 transition-transform" style={{animationDelay: '0.5s'}}></div>
                      <div className="h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg shadow-sm animate-pulse transform hover:scale-105 transition-transform" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced stats with ROI focus */}
            <div className="grid md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-2xl font-bold text-green-600 mb-1">5x</div>
                <div className="text-sm text-gray-600 font-medium">Higher ROI</div>
                <div className="text-xs text-gray-500">vs email marketing</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
                <div className="text-sm text-gray-600 font-medium">Open Rate</div>
                <div className="text-xs text-gray-500">WhatsApp messages</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                <div className="text-sm text-gray-600 font-medium">Less Support</div>
                <div className="text-xs text-gray-500">tickets with AI</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-2xl font-bold text-orange-600 mb-1">30%</div>
                <div className="text-sm text-gray-600 font-medium">Cart Recovery</div>
                <div className="text-xs text-gray-500">via WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Solution Flow */}
      <section className="relative px-6 py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🚀</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-4">
              How Cliona Transforms Your Business in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From setup to scaling – see how businesses achieve 5x ROI with our AI-powered messaging platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">⚙️</span>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    STEP 1
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Setup & Integration</h3>
                <p className="text-gray-600 mb-6">
                  Connect your WhatsApp Business API, RCS, and existing tools in under 5 minutes. Our team handles the technical setup.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    WhatsApp API provisioning
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    CRM data synchronization
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Team onboarding & training
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-semibold">Setup Time</span>
                    <span className="text-2xl font-bold text-green-600">5min</span>
                  </div>
                </div>
              </div>
              
              {/* Connecting arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    STEP 2
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI Automation & Optimization</h3>
                <p className="text-gray-600 mb-6">
                  Our AI learns your business patterns and creates intelligent chatbots that handle 85% of customer inquiries automatically.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    AI chatbot deployment
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Smart routing & escalation
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Performance optimization
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-semibold">Automation Rate</span>
                    <span className="text-2xl font-bold text-blue-600">85%</span>
                  </div>
                </div>
              </div>
              
              {/* Connecting arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">📈</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                    STEP 3
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Scale & Optimize Results</h3>
                <p className="text-gray-600 mb-6">
                  Track performance, optimize campaigns, and scale your messaging strategy with AI-powered insights and recommendations.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Real-time analytics dashboard
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Conversion optimization
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Multi-channel scaling
                  </div>
                </div>
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-800 font-semibold">ROI Increase</span>
                    <span className="text-2xl font-bold text-purple-600">5x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="mt-16 bg-gradient-to-r from-green-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-6">Results Our Customers See Within 30 Days</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">5x</div>
                <div className="text-sm text-green-100">Higher ROI vs Email</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">85%</div>
                <div className="text-sm text-green-100">Support Automation</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">30%</div>
                <div className="text-sm text-green-100">Cart Recovery Rate</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">70%</div>
                <div className="text-sm text-green-100">Faster Response Time</div>
              </div>
            </div>
            <div className="mt-8">
              <button className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                <span className="mr-2">🚀</span>
                Start Your Transformation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="relative px-6 py-12 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              {/* Problem side decorative elements */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-red-200 to-orange-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-16 -right-6 w-8 h-8 bg-gradient-to-br from-yellow-200 to-red-300 rounded-lg opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
              
              <div className="relative bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">⚠️</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3">
                    The Problem
                  </h2>
                </div>
                <p className="text-base text-gray-600 mb-6 text-center">
                  Businesses lose leads because customers prefer WhatsApp & RCS, but traditional tools can&apos;t keep up with modern messaging demands.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start group">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mt-0.5 mr-3 group-hover:scale-110 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Missed conversations on WhatsApp</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mt-0.5 mr-3 group-hover:scale-110 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">No RCS rich messaging capabilities</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mt-0.5 mr-3 group-hover:scale-110 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Fragmented customer communication</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              {/* Solution side decorative elements */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-16 -left-6 w-8 h-8 bg-gradient-to-br from-blue-200 to-green-300 rounded-lg opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
              
              <div className="relative bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                    Our Solution
                  </h2>
                </div>
                <p className="text-base text-gray-600 mb-6 text-center">
                  AI-powered engagement platform that unifies WhatsApp, RCS, and SMS into one intelligent system.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start group">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mt-0.5 mr-3 group-hover:scale-110 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">AI-powered conversation automation</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mt-0.5 mr-3 group-hover:scale-110 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Rich RCS messaging with payments</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mt-0.5 mr-3 group-hover:scale-110 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Unified multi-channel inbox</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="relative px-6 py-12 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/10 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">⚡</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to engage customers across WhatsApp, RCS, and SMS with AI-powered automation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    AI-POWERED
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">No-Code AI Chatbot Builder</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors mb-4">
                  Create intelligent chatbots that understand context, handle complex queries, and learn from every interaction. No coding required.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    85% automation rate achieved
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    50+ pre-built industry templates
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Multi-language support (50+ languages)
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Start Building →</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">Free</div>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">💬</span>
                  </div>
                  <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    VERIFIED
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">WhatsApp Business API</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors mb-4">
                  Official WhatsApp Business partner with green tick verification. Send unlimited messages to customers who opt-in.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    98% message open rate guaranteed
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Free green tick verification
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Rich media & interactive buttons
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Get API Access →</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">Setup in 5min</div>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                    NEXT-GEN
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">RCS Rich Messaging</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors mb-4">
                  Google RCS partner delivering app-like experiences through native messaging. Interactive buttons, carousels, and in-chat payments.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    5x higher engagement vs SMS
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Native Android integration
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    In-message payment processing
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Try RCS →</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">New</div>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">📧</span>
                  </div>
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                    UNIFIED
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">Multi-Channel Inbox</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors mb-4">
                  One inbox for WhatsApp, SMS, RCS, and social media. AI-powered smart routing ensures messages reach the right team instantly.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    70% faster response time
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Auto-assignment to right agent
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Conversation history sync
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">See Demo →</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">$49</div>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors">Smart Analytics</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  AI-powered insights into customer behavior, conversation trends, and performance metrics
                </p>
                <div className="mt-4 flex items-center text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🔗</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">CRM Integration</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  Seamlessly connect with your existing CRM and sync customer data across all touchpoints
                </p>
                <div className="mt-4 flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Business API Deep Dive */}
      <section className="relative px-6 py-12 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        {/* WhatsApp themed background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-200/30 to-green-300/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-300/20 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-10">
            {/* WhatsApp icon */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <span className="text-white text-3xl">💬</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              WhatsApp Business API Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Official WhatsApp Business Solution Partner with enterprise-grade messaging capabilities
            </p>
            
            {/* Trust badges */}
            <div className="flex justify-center items-center space-x-6 mt-8">
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 shadow-lg">
                <span className="text-green-600 text-sm font-semibold mr-2">✓</span>
                <span className="text-gray-700 text-sm">Official Partner</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 shadow-lg">
                <span className="text-green-600 text-sm font-semibold mr-2">🔒</span>
                <span className="text-gray-700 text-sm">Enterprise Grade</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 shadow-lg">
                <span className="text-green-600 text-sm font-semibold mr-2">⚡</span>
                <span className="text-gray-700 text-sm">99.9% Uptime</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">💚</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Verified Green Tick</h3>
                  <p className="text-gray-600">Official business verification badge</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Message Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-sm text-gray-600">Open Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">45-60%</div>
                      <div className="text-sm text-gray-600">Click Rate</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Scale & Reach</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Unlimited messaging capabilities</li>
                    <li>• Global reach across 180+ countries</li>
                    <li>• Handle millions of conversations daily</li>
                    <li>• 99.9% uptime SLA guarantee</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">WhatsApp Business Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Template Messages</h4>
                    <p className="text-gray-600">Pre-approved message templates for marketing, notifications, and updates</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Interactive Messages</h4>
                    <p className="text-gray-600">Buttons, quick replies, and list messages for better engagement</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Media Support</h4>
                    <p className="text-gray-600">Send images, videos, documents, and audio messages</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Catalog Integration</h4>
                    <p className="text-gray-600">Showcase products directly within WhatsApp conversations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp Pay</h4>
                    <p className="text-gray-600">Secure payment processing within chat conversations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started with WhatsApp Business API?</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Get your WhatsApp Business API account set up in minutes. No setup fees, free green tick verification, and dedicated support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white hover:bg-gray-100 text-green-600 px-8 py-3 rounded-lg font-semibold">
                  Get WhatsApp API Access
                </button>
                <button className="border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-3 rounded-lg font-semibold">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Chatbot Capabilities */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              AI-Powered Chatbot Builder
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create intelligent conversational experiences with our advanced no-code chatbot platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Natural Language Processing</h3>
              <p className="text-gray-600">Advanced NLP to understand customer intent, context, and sentiment in real-time</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Routing</h3>
              <p className="text-gray-600">Intelligent conversation routing to the right department or agent based on context</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learning & Adaptation</h3>
              <p className="text-gray-600">Continuously learns from interactions to improve responses over time</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Drag & Drop Bot Builder</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 mr-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Visual Flow Designer</h4>
                      <p className="text-gray-600">Create complex conversation flows with simple drag-and-drop interface</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 mr-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Pre-built Templates</h4>
                      <p className="text-gray-600">Industry-specific bot templates for quick deployment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 mr-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">API Integrations</h4>
                      <p className="text-gray-600">Connect with CRM, databases, and third-party services</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 mr-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Multi-language Support</h4>
                      <p className="text-gray-600">Support customers in 50+ languages with auto-translation</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Bot Use Cases</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Lead Qualification</span>
                    <span className="text-sm text-green-600 font-medium">85% automation</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Customer Support</span>
                    <span className="text-sm text-green-600 font-medium">70% automation</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Order Tracking</span>
                    <span className="text-sm text-green-600 font-medium">95% automation</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Appointment Booking</span>
                    <span className="text-sm text-green-600 font-medium">90% automation</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">FAQ Resolution</span>
                    <span className="text-sm text-green-600 font-medium">80% automation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RCS Rich Messaging */}
      <section className="relative px-6 py-12 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 overflow-hidden">
        {/* RCS themed background elements */}
        <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-56 h-56 bg-gradient-to-br from-indigo-200/15 to-purple-300/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-40 left-1/3 w-20 h-20 bg-purple-300/10 rounded-xl animate-bounce opacity-30" style={{animationDelay: '1.5s'}}></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-10">
            {/* RCS icon with animation */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse">
                  <span className="text-white text-3xl">📱</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
                  <span className="text-white text-xs">📊</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
              RCS Rich Communication Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Next-generation SMS with rich media, interactive elements, and verified business messaging
            </p>
            
            {/* RCS capability badges */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 shadow-lg">
                <span className="text-purple-600 text-sm font-semibold mr-2">🎠</span>
                <span className="text-gray-700 text-sm">Rich Carousels</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 shadow-lg">
                <span className="text-purple-600 text-sm font-semibold mr-2">💳</span>
                <span className="text-gray-700 text-sm">In-Chat Payments</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 shadow-lg">
                <span className="text-purple-600 text-sm font-semibold mr-2">📍</span>
                <span className="text-gray-700 text-sm">Live Location</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 shadow-lg">
                <span className="text-purple-600 text-sm font-semibold mr-2">🔔</span>
                <span className="text-gray-700 text-sm">Read Receipts</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why RCS is the Future</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-purple-600 text-sm font-bold">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Native Android Experience</h4>
                    <p className="text-gray-600">Pre-installed on Android devices, no app download required</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-purple-600 text-sm font-bold">💳</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">In-Message Payments</h4>
                    <p className="text-gray-600">Secure payment processing without leaving the conversation</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-purple-600 text-sm font-bold">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Rich Analytics</h4>
                    <p className="text-gray-600">Detailed delivery, read receipts, and engagement metrics</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-purple-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Verified Business</h4>
                    <p className="text-gray-600">Official business verification with brand colors and logos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-purple-200 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">RCS Interactive Elements</h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">📸 Rich Media Cards</h4>
                  <p className="text-gray-600 text-sm">High-resolution images, videos, and GIFs with call-to-action buttons</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🎠 Carousel Messages</h4>
                  <p className="text-gray-600 text-sm">Swipeable product catalogs and service showcases</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">📝 Quick Reply Buttons</h4>
                  <p className="text-gray-600 text-sm">Pre-defined response options for faster customer interactions</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Live Location Sharing</h4>
                  <p className="text-gray-600 text-sm">Real-time location updates for delivery and service tracking</p>
                </div>
                
                <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Action Buttons</h4>
                  <p className="text-gray-600 text-sm">Direct call, website visit, and location navigation buttons</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-semibold">Engagement Boost</span>
                  <span className="text-2xl font-bold text-green-600">5x Higher</span>
                </div>
                <p className="text-green-700 text-sm mt-1">vs traditional SMS messaging</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">RCS vs SMS vs WhatsApp</h3>
              <p className="text-gray-600">See how RCS compares to traditional messaging channels</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center p-4 font-semibold text-gray-900">SMS</th>
                    <th className="text-center p-4 font-semibold text-gray-900">WhatsApp</th>
                    <th className="text-center p-4 font-semibold text-purple-600">RCS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-4 text-gray-900">Rich Media Support</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center text-purple-600">✅</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-900">Interactive Buttons</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center text-purple-600">✅</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-900">Read Receipts</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center text-purple-600">✅</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-900">In-Message Payments</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">Limited</td>
                    <td className="p-4 text-center text-purple-600">✅</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-900">No App Required</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center text-purple-600">✅</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-900">Brand Verification</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center text-purple-600">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="relative px-6 py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🎢</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              Real Results Across Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses achieve measurable growth with Cliona&apos;s AI-powered messaging platform
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* E-commerce Case Study */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-2xl">🛒</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">E-commerce</h3>
                    <p className="text-sm text-gray-500">Fashion Retailer - 50K customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">+312%</div>
                  <div className="text-sm text-gray-500">Revenue Growth</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
                <h4 className="font-bold text-gray-900 mb-3">🎯 Challenge:</h4>
                <p className="text-gray-700 mb-4">78% cart abandonment rate, poor customer support response times, no personalized product recommendations</p>
                
                <h4 className="font-bold text-gray-900 mb-3">🚀 Solution:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      WhatsApp cart recovery automation
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      AI-powered product recommendations
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      RCS order tracking with rich media
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      24/7 AI customer support
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">35%</div>
                  <div className="text-xs text-gray-600">Cart Recovery Rate</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">-65%</div>
                  <div className="text-xs text-gray-600">Support Tickets</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">28%</div>
                  <div className="text-xs text-gray-600">Higher AOV</div>
                </div>
              </div>
            </div>
            
            {/* Healthcare Case Study */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-2xl">🏥</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Healthcare</h3>
                    <p className="text-sm text-gray-500">Clinic Chain - 25 locations</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">+89%</div>
                  <div className="text-sm text-gray-500">Patient Satisfaction</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl mb-6">
                <h4 className="font-bold text-gray-900 mb-3">🎯 Challenge:</h4>
                <p className="text-gray-700 mb-4">High no-show rates (32%), manual appointment scheduling, missed medication reminders</p>
                
                <h4 className="font-bold text-gray-900 mb-3">🚀 Solution:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      WhatsApp appointment booking
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Automated prescription reminders
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      RCS health tips with rich media
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      HIPAA-compliant messaging
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">-76%</div>
                  <div className="text-xs text-gray-600">No-show Rate</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">92%</div>
                  <div className="text-xs text-gray-600">Medication Adherence</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">+156%</div>
                  <div className="text-xs text-gray-600">Patient Engagement</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional industry examples */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🎓</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">EdTech</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lead Conversion</span>
                  <span className="font-bold text-purple-600">+247%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Course Completion</span>
                  <span className="font-bold text-purple-600">+84%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Student Engagement</span>
                  <span className="font-bold text-purple-600">+158%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🏦</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Banking</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fraud Detection</span>
                  <span className="font-bold text-orange-600">-91%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Support Resolution</span>
                  <span className="font-bold text-orange-600">3x Faster</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-bold text-orange-600">+94%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🍽️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Food Delivery</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Accuracy</span>
                  <span className="font-bold text-pink-600">+73%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Retention</span>
                  <span className="font-bold text-pink-600">+112%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Satisfaction</span>
                  <span className="font-bold text-pink-600">+89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative px-6 py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🔒</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              Trusted by 500+ Growing Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade security, official partnerships, and proven results you can trust
            </p>
          </div>
          
          {/* Customer Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">CMO, TechStyle Fashion</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                &quot;Cliona transformed our customer engagement. We recovered 35% of abandoned carts via WhatsApp and saw 312% revenue growth in 6 months.&quot;
              </blockquote>
              <div className="text-2xl font-bold text-green-600">+312% Revenue</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Dr. Michael Raj</h4>
                  <p className="text-sm text-gray-500">Director, MedCare Clinics</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                &quot;Patient no-shows dropped by 76% with WhatsApp appointment reminders. The HIPAA-compliant messaging gives us peace of mind.&quot;
              </blockquote>
              <div className="text-2xl font-bold text-blue-600">-76% No-shows</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">R</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Raj Patel</h4>
                  <p className="text-sm text-gray-500">Founder, EduTech Pro</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-yellow-400 text-lg">⭐</span>
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                &quot;Lead conversion improved by 247% using WhatsApp nurturing campaigns. The AI chatbot handles enrollment queries 24/7.&quot;
              </blockquote>
              <div className="text-2xl font-bold text-purple-600">+247% Leads</div>
            </div>
          </div>
          
          {/* Partner Logos & Certifications */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp Business API</h3>
              <p className="text-gray-600 mb-4">Official Meta Business Partner with green tick verification and unlimited messaging capabilities.</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">✓ VERIFIED</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">PARTNER</span>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Google RCS Partner</h3>
              <p className="text-gray-600 mb-4">Certified RCS Business Messaging partner delivering rich, interactive experiences on Android devices.</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">✓ CERTIFIED</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">GOOGLE</span>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-600 mb-4">SOC 2 certified with 256-bit encryption, GDPR & DPDP compliance for maximum data protection.</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">✓ SOC2</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">SECURE</span>
              </div>
            </div>
          </div>
          
          {/* Security & Compliance */}
          <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise-Grade Security & Compliance</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">Trusted by enterprises worldwide with bank-level security and comprehensive compliance certifications</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white font-bold text-lg">GDPR</div>
                </div>
                <h4 className="text-white font-semibold mb-2">GDPR Compliant</h4>
                <p className="text-gray-400 text-sm">Full European data protection compliance with right to deletion and data portability</p>
              </div>
              
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white font-bold text-lg">DPDP</div>
                </div>
                <h4 className="text-white font-semibold mb-2">DPDP Act Ready</h4>
                <p className="text-gray-400 text-sm">Compliant with India&apos;s Digital Personal Data Protection Act 2023 requirements</p>
              </div>
              
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white font-bold text-sm">SOC2</div>
                </div>
                <h4 className="text-white font-semibold mb-2">SOC 2 Certified</h4>
                <p className="text-gray-400 text-sm">Audited security controls for availability, processing integrity & confidentiality</p>
              </div>
              
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white font-bold text-lg">256</div>
                </div>
                <h4 className="text-white font-semibold mb-2">256-bit Encryption</h4>
                <p className="text-gray-400 text-sm">Military-grade AES-256 encryption for data at rest and in transit</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-6">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-green-300 text-sm font-medium">99.9% Uptime SLA</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-blue-300 text-sm font-medium">24/7 Security Monitoring</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-purple-300 text-sm font-medium">ISO 27001 Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why We Built Cliona
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We saw businesses struggling to keep up with the shift to conversational commerce. While customers moved to WhatsApp and RCS, businesses were stuck with outdated tools that couldn&apos;t deliver the modern messaging experience customers expect.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Cliona bridges this gap with AI-first technology that makes sophisticated messaging automation accessible to businesses of all sizes.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Built by experienced team from top tech companies</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Backed by leading investors in conversational AI</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Serving 500+ businesses across 20+ countries</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Meet the Team</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <div className="text-blue-600 font-semibold">CEO</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Founder & CEO</div>
                    <div className="text-gray-600">Ex-Senior Engineer at leading tech companies</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <div className="text-green-600 font-semibold">CTO</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Co-founder & CTO</div>
                    <div className="text-gray-600">AI/ML expert with 10+ years experience</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <div className="text-purple-600 font-semibold">CPO</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Head of Product</div>
                    <div className="text-gray-600">Product strategy from unicorn startups</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Lead Capture */}
      <section className="relative px-6 py-20 bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-purple-600/90"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Urgency Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black rounded-full text-lg font-bold animate-pulse mb-4">
              <span className="mr-2">🔥</span>
              LIMITED TIME: 50% OFF + FREE WhatsApp API Setup (Worth $500)
              <span className="ml-2">🔥</span>
            </div>
            <div className="text-yellow-200 font-semibold text-lg">
              Offer expires in: <span className="text-white font-bold">7 days, 14 hours, 32 minutes</span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Value Proposition */}
            <div className="text-left">
              <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🚀</span>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Don&apos;t Let Your Competitors
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Steal Your Customers
                </span>
              </h2>
              
              <p className="text-xl text-pink-100 mb-8 leading-relaxed">
                While you&apos;re reading this, your competitors are already using WhatsApp to recover 35% of abandoned carts and boost revenue by 300%+.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-white">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-lg">Setup completed in 5 minutes</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-lg">No technical knowledge required</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-lg">Cancel anytime, no contracts</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Lead Capture Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-400">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold mb-4">
                  🔥 HOT DEAL - 72% OFF
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Your Free WhatsApp API + 14-Day Trial
                </h3>
                <p className="text-gray-600">
                  Join 500+ businesses already growing with Cliona
                </p>
              </div>
              
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="First Name*" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Last Name*" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <input 
                  type="email" 
                  placeholder="Business Email*" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                
                <input 
                  type="tel" 
                  placeholder="Phone Number*" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                
                <input 
                  type="text" 
                  placeholder="Company Name*" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700">
                  <option value="">Monthly Message Volume</option>
                  <option value="<1000">Less than 1,000</option>
                  <option value="1000-5000">1,000 - 5,000</option>
                  <option value="5000-10000">5,000 - 10,000</option>
                  <option value="10000+">10,000+</option>
                </select>
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2 text-xl">🚀</span>
                    Start My Free Trial + Get $500 FREE Setup
                    <span className="ml-2 text-xl">→</span>
                  </span>
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  No credit card required • Cancel anytime • Free WhatsApp green tick verification
                </p>
              </form>
              
              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg mr-1">⭐</span>
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 text-lg mr-1">✓</span>
                    <span>500+ customers</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-500 text-lg mr-1">🛡️</span>
                    <span>Enterprise security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom testimonial */}
          <div className="mt-16 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="flex space-x-1">
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="text-yellow-400 text-xl">⭐</span>
                </div>
              </div>
              <blockquote className="text-white text-lg italic mb-4">
                &quot;We saw a 312% increase in revenue within 6 months. The WhatsApp cart recovery alone pays for the entire platform.&quot;
              </blockquote>
              <cite className="text-pink-200 font-semibold">Sarah Chen, CMO at TechStyle Fashion</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative px-6 py-16 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-gray-900/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Top section with social proof */}
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Join 500+ Businesses Growing with Cliona
            </h3>
            <div className="flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl mr-2">⭐</span>
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 text-xl mr-2">📱</span>
                <span>500K+ Messages Daily</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 text-xl mr-2">🚀</span>
                <span>20+ Countries Served</span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cliona
                </div>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-lg">
                The most trusted AI-first WhatsApp & RCS engagement platform for growing businesses. Turn conversations into conversions.
              </p>
              
              {/* Contact buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center shadow-lg transform hover:scale-105 transition-all duration-200">
                  <span className="mr-2 text-lg">💬</span>
                  <span className="font-semibold">WhatsApp Support</span>
                </button>
                <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center border border-white/20 transform hover:scale-105 transition-all duration-200">
                  <span className="mr-2 text-lg">📧</span>
                  <span className="font-semibold">Email Us</span>
                </button>
                <button className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg transform hover:scale-105 transition-all duration-200">
                  <span className="mr-2 text-lg">📞</span>
                  <span className="font-semibold">Schedule Call</span>
                </button>
              </div>
              
              {/* Social media links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <span className="text-blue-400 text-lg">🔗</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <span className="text-blue-400 text-lg">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <span className="text-pink-400 text-lg">📷</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6 flex items-center text-lg">
                <span className="mr-2">🚀</span>
                Platform
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  AI Chatbot Builder
                </a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  WhatsApp Business API
                </a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  RCS Rich Messaging
                </a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Multi-Channel Inbox
                </a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Smart Analytics
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6 flex items-center text-lg">
                <span className="mr-2">🎢</span>
                Solutions
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#use-cases" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  E-commerce
                </a></li>
                <li><a href="#use-cases" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Healthcare
                </a></li>
                <li><a href="#use-cases" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  EdTech
                </a></li>
                <li><a href="#use-cases" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Banking & Fintech
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Enterprise
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6 flex items-center text-lg">
                <span className="mr-2">📚</span>
                Resources
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  API Documentation
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Video Tutorials
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  WhatsApp Guides
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Case Studies
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Blog
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6 flex items-center text-lg">
                <span className="mr-2">🏢</span>
                Company
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#about" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  About Us
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Careers
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Press Kit
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Partner Program
                </a></li>
                <li><a href="/privacy" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Privacy Policy
                </a></li>
                <li><a href="/terms" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Terms of Service
                </a></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter signup */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                📧 Stay Updated with WhatsApp Marketing Tips
              </h3>
              <p className="text-gray-300">
                Get weekly insights, case studies, and best practices delivered to your inbox
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your business email" 
                className="flex-1 px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              No spam. Unsubscribe anytime. Used by 10,000+ marketers.
            </p>
          </div>
          
          <div className="border-t border-gray-700/50 pt-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-gray-400 text-center md:text-left">
                <p className="flex items-center justify-center md:justify-start mb-2">
                  <span className="mr-2">©</span>
                  2024 Cliona Inc. All rights reserved.
                </p>
                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                  <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Privacy</a>
                  <span className="text-gray-600">|</span>
                  <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Terms</a>
                  <span className="text-gray-600">|</span>
                  <a href="mailto:legal@cliona.ai" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Legal</a>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-green-400">All systems operational</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end space-x-4 mb-2">
                  <span className="text-gray-400 text-sm">Contact:</span>
                  <a href="mailto:contact@cliona.ai" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm">
                    contact@cliona.ai
                  </a>
                </div>
                <div className="text-xs text-gray-500">
                  Response time: &lt; 2 hours during business hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
