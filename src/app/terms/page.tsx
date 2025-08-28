export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">
            <a href="/">Cliona</a>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="/#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="/#use-cases" className="text-gray-600 hover:text-gray-900">Use Cases</a>
            <a href="/#about" className="text-gray-600 hover:text-gray-900">About</a>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
            <a href="/">Get Early Access</a>
          </button>
        </div>
      </nav>

      {/* Terms of Service Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-800">
            <strong>Last updated:</strong> December 2024
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing and using Cliona's AI-first WhatsApp & RCS engagement platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Service Description</h2>
          <p className="text-gray-600 mb-4">
            Cliona provides an AI-powered conversational platform that enables businesses to:
          </p>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>Send and receive messages via WhatsApp Business API</li>
            <li>Create and deploy AI chatbots</li>
            <li>Utilize RCS (Rich Communication Services) messaging</li>
            <li>Manage multi-channel customer conversations</li>
            <li>Access analytics and reporting tools</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Account Registration & Eligibility</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Account Requirements</h3>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>You must be at least 18 years old to create an account</li>
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining account security</li>
            <li>One person or legal entity may maintain only one account</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Business Use</h3>
          <p className="text-gray-600 mb-6">
            Our Service is intended for legitimate business use only. You must comply with all applicable laws, regulations, and third-party terms (including WhatsApp Business Policy and Google RCS Business Messaging Guidelines).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Acceptable Use Policy</h2>
          <p className="text-gray-600 mb-4">
            You agree NOT to use our Service to:
          </p>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>Send spam, unsolicited messages, or promotional content without consent</li>
            <li>Violate any laws, regulations, or third-party rights</li>
            <li>Transmit harmful, malicious, or illegal content</li>
            <li>Impersonate others or provide false information</li>
            <li>Attempt to hack, reverse engineer, or compromise our systems</li>
            <li>Use our Service for any fraudulent or abusive activities</li>
            <li>Send messages that contain hate speech, harassment, or threats</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Subscription Plans & Billing</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Pricing</h3>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Current pricing is available on our website</li>
            <li>Prices are subject to change with 30 days notice</li>
            <li>Additional charges may apply for premium features</li>
            <li>WhatsApp and RCS message costs are charged separately</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Payment Terms</h3>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>Subscription fees are billed in advance on a monthly/annual basis</li>
            <li>All fees are non-refundable except as required by law</li>
            <li>Failed payments may result in service suspension</li>
            <li>You are responsible for all applicable taxes</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data & Privacy</h2>
          <p className="text-gray-600 mb-4">
            Your privacy is important to us. Our data practices are governed by our Privacy Policy, which includes:
          </p>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>How we collect, use, and protect your data</li>
            <li>Your rights regarding your personal information</li>
            <li>Our security measures and compliance standards</li>
            <li>Data retention and deletion policies</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Our Rights</h3>
          <p className="text-gray-600 mb-4">
            Cliona owns all rights to the platform, including software, algorithms, trademarks, and content. You may not copy, modify, or distribute our proprietary technology.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Your Content</h3>
          <p className="text-gray-600 mb-6">
            You retain ownership of your content and data. By using our Service, you grant us a license to process your content solely for providing our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Service Level Agreement</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <ul className="text-green-800 list-disc pl-6">
              <li><strong>Uptime:</strong> 99.9% monthly uptime guarantee</li>
              <li><strong>Support:</strong> 24/7 technical support for paid plans</li>
              <li><strong>Response Time:</strong> Critical issues addressed within 2 hours</li>
              <li><strong>Data Backup:</strong> Daily automated backups with 99.99% durability</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Third-Party Services</h2>
          <p className="text-gray-600 mb-4">
            Our platform integrates with third-party services including:
          </p>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>WhatsApp Business API (subject to WhatsApp Business Policy)</li>
            <li>Google RCS Business Messaging (subject to Google's terms)</li>
            <li>Payment processors and banking partners</li>
            <li>Analytics and monitoring services</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            To the maximum extent permitted by law, Cliona shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability for any claim shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Termination</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 By You</h3>
          <p className="text-gray-600 mb-4">
            You may terminate your account at any time by contacting our support team or through your account settings.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 By Us</h3>
          <p className="text-gray-600 mb-6">
            We may suspend or terminate your account for violation of these terms, non-payment, or if required by law. We will provide reasonable notice when possible.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Dispute Resolution</h2>
          <p className="text-gray-600 mb-6">
            Any disputes arising from these terms will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration will be conducted in English and shall take place in Delaware, USA.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We may modify these terms at any time. Material changes will be communicated via email or platform notification at least 30 days before taking effect. Continued use of the Service after changes indicates acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 mb-2"><strong>Legal Department:</strong> legal@cliona.ai</p>
            <p className="text-gray-700 mb-2"><strong>Support Team:</strong> support@cliona.ai</p>
            <p className="text-gray-700 mb-2"><strong>Business Address:</strong> Cliona Inc., Delaware, USA</p>
            <p className="text-gray-700"><strong>Emergency Contact:</strong> Available 24/7 through platform</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 font-semibold mb-2">Important Notice:</p>
            <p className="text-blue-700">
              These terms constitute a legally binding agreement. Please read carefully and contact us if you have any questions before accepting these terms.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">Cliona</div>
          <p className="text-gray-400 mb-6">
            AI-first WhatsApp & RCS engagement platform
          </p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">
              © 2024 Cliona. All rights reserved. | 
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 ml-2">Privacy Policy</a> | 
              <a href="/terms" className="text-blue-400 hover:text-blue-300 ml-2">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}