
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
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              AI-First WhatsApp & RCS
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Engagement Platform
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Automate conversations, grow sales, and support customers with AI across WhatsApp & RCS
            </p>
            
            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center">
                  <span className="mr-2 text-sm">📞</span>
                  Book a Demo
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button className="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 transform hover:scale-105 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center">
                  <span className="mr-2 text-sm">🚀</span>
                  Start Free Trial
                </span>
              </button>
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

            {/* Stats row */}
            <div className="grid md:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                <div className="text-xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Message Open Rate</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                <div className="text-xl font-bold text-green-600">500K+</div>
                <div className="text-sm text-gray-600">Messages Processed Daily</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                <div className="text-xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime SLA</div>
              </div>
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
                  Businesses lose leads because customers prefer WhatsApp & RCS, but traditional tools can't keep up with modern messaging demands.
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
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">AI Chatbot Builder</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  Drag & drop interface to create intelligent chatbots that understand context and provide human-like responses
                </p>
                <div className="mt-3 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-medium">Learn more</span>
                  <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">WhatsApp Business API</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  Direct integration with WhatsApp Business API for verified business messaging and automated customer support
                </p>
                <div className="mt-3 flex items-center text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-medium">Learn more</span>
                  <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">RCS Rich Messaging</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  Send interactive messages with buttons, carousels, and payment options directly through RCS
                </p>
                <div className="mt-4 flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">Multi-Channel Inbox</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  Manage WhatsApp, SMS, and RCS conversations from one unified interface with smart routing
                </p>
                <div className="mt-4 flex items-center text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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
      <section id="use-cases" className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Built for Every Industry
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how businesses across different verticals use Cliona to drive growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">E-commerce</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Recover abandoned carts via WhatsApp, send order updates through RCS, and provide instant customer support
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Cart recovery automation</li>
                <li>• Order tracking & updates</li>
                <li>• Product recommendations via AI</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="w-6 h-6 bg-green-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Healthcare</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Automated appointment booking, prescription reminders, and secure patient communication
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Appointment scheduling</li>
                <li>• Medication reminders</li>
                <li>• Secure patient messaging</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="w-6 h-6 bg-purple-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">EdTech</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Lead capture & nurturing, course enrollment, and student engagement through interactive messaging
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Lead qualification automation</li>
                <li>• Course enrollment reminders</li>
                <li>• Student progress tracking</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="w-6 h-6 bg-orange-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Banking & Fintech</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Smart RCS alerts, WhatsApp customer service, and secure transaction notifications
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Transaction alerts via RCS</li>
                <li>• Account balance inquiries</li>
                <li>• Fraud prevention notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Trusted & Secure
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade security and compliance with seamless integrations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp Business API</h3>
              <p className="text-gray-600">Official WhatsApp partner with verified business messaging</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Google RCS</h3>
              <p className="text-gray-600">Certified RCS Business Messaging partner for rich experiences</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">UPI Payments</h3>
              <p className="text-gray-600">Secure payment processing with major Indian payment gateways</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliance & Security</h3>
              <p className="text-gray-600">Built with enterprise-grade security and privacy standards</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 border">
                  <div className="text-xs font-bold text-gray-700">GDPR</div>
                </div>
                <p className="text-sm text-gray-600">GDPR Compliant</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 border">
                  <div className="text-xs font-bold text-gray-700">DPDP</div>
                </div>
                <p className="text-sm text-gray-600">DPDP Act Ready</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 border">
                  <div className="text-xs font-bold text-gray-700">SOC2</div>
                </div>
                <p className="text-sm text-gray-600">SOC 2 Certified</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 border">
                  <div className="text-xs font-bold text-gray-700">256</div>
                </div>
                <p className="text-sm text-gray-600">256-bit Encryption</p>
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
                We saw businesses struggling to keep up with the shift to conversational commerce. While customers moved to WhatsApp and RCS, businesses were stuck with outdated tools that couldn't deliver the modern messaging experience customers expect.
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

      {/* CTA Section */}
      <section className="relative px-6 py-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white/5 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-white/3 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-12 h-12 bg-white/10 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-20 right-16 w-8 h-8 bg-white/15 rounded-full animate-bounce opacity-40" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-6 h-6 bg-white/20 rounded-full animate-bounce opacity-50" style={{animationDelay: '2.5s'}}></div>
          
          {/* Main content */}
          <div className="relative">
            <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🚀</span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Customer Engagement?
              </span>
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of businesses already using Cliona to automate conversations and drive growth
            </p>
            
            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="group bg-white hover:bg-gray-50 text-blue-600 px-10 py-5 rounded-xl text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                <span className="mr-3">🚀</span>
                Start Free Trial
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="group border-2 border-white/50 hover:border-white hover:bg-white/10 text-white px-10 py-5 rounded-xl text-lg font-semibold backdrop-blur-sm transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                <span className="mr-3">📞</span>
                Book a Demo
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">✓</span>
                </div>
                <span className="text-white font-semibold">14-day free trial</span>
                <span className="text-blue-200 text-sm">No commitment required</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">💳</span>
                </div>
                <span className="text-white font-semibold">No credit card required</span>
                <span className="text-blue-200 text-sm">Start instantly</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <span className="text-white font-semibold">Setup in 5 minutes</span>
                <span className="text-blue-200 text-sm">Quick integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-8 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-gray-900/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/5 to-blue-500/5 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cliona
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                AI-first WhatsApp & RCS engagement platform helping businesses automate conversations and drive growth.
              </p>
              <div className="flex space-x-4">
                <button className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center shadow-lg transform hover:scale-105 transition-all duration-200">
                  <span className="mr-2 text-lg">💬</span>
                  <span className="font-semibold">WhatsApp</span>
                </button>
                <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center border border-white/20 transform hover:scale-105 transition-all duration-200">
                  <span className="mr-2 text-lg">📧</span>
                  <span className="font-semibold">Email</span>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6 flex items-center">
                <span className="mr-2">🚀</span>
                Product
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Features
                </a></li>
                <li><a href="#use-cases" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Use Cases
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Pricing
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Integrations
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6 flex items-center">
                <span className="mr-2">🏢</span>
                Company
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  About Us
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Careers
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
          
          <div className="border-t border-gray-700/50 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0 text-center md:text-left">
                <p className="flex items-center justify-center md:justify-start">
                  <span className="mr-2">©</span>
                  2024 Cliona. All rights reserved. | 
                  <a href="mailto:contact@cliona.ai" className="text-blue-400 hover:text-blue-300 ml-2 flex items-center">
                    <span className="mr-1">📧</span>
                    contact@cliona.ai
                  </a>
                </p>
                <div className="mt-2 flex items-center justify-center md:justify-start space-x-4">
                  <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Privacy Policy</a>
                  <span className="text-gray-600">|</span>
                  <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Terms of Service</a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-gray-500 text-sm">Powered by AI</div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
