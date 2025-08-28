import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">
            <Link href="/">Cliona</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="/#use-cases" className="text-gray-600 hover:text-gray-900">Use Cases</Link>
            <Link href="/#about" className="text-gray-600 hover:text-gray-900">About</Link>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
            <Link href="/">Get Early Access</Link>
          </button>
        </div>
      </nav>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-800">
            <strong>Last updated:</strong> December 2024
          </p>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            At Cliona (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-first WhatsApp & RCS engagement platform.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Personal Information</h3>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Account information (name, email address, phone number)</li>
            <li>Business information (company name, website, industry)</li>
            <li>Billing information (payment details, billing address)</li>
            <li>Contact preferences and communication settings</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Usage Information</h3>
          <ul className="text-gray-600 mb-4 list-disc pl-6">
            <li>Platform usage statistics and analytics</li>
            <li>Message content and conversation data (for service delivery)</li>
            <li>API usage logs and technical information</li>
            <li>Device information and browser details</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Customer Data</h3>
          <p className="text-gray-600 mb-6">
            We process customer conversation data and contact information on behalf of our clients to provide messaging services through WhatsApp Business API, RCS, and SMS channels.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>Provide and maintain our messaging platform services</li>
            <li>Process transactions and manage billing</li>
            <li>Improve our AI algorithms and platform features</li>
            <li>Send service notifications and updates</li>
            <li>Provide customer support and technical assistance</li>
            <li>Ensure security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security & Protection</h2>
          <p className="text-gray-600 mb-4">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>256-bit SSL encryption for data transmission</li>
            <li>End-to-end encryption for message content</li>
            <li>Regular security audits and penetration testing</li>
            <li>SOC 2 Type II compliance</li>
            <li>Role-based access controls and authentication</li>
            <li>Data backup and disaster recovery procedures</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Sharing & Disclosure</h2>
          <p className="text-gray-600 mb-4">
            We do not sell, trade, or rent your personal information. We may share information in the following circumstances:
          </p>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>With your explicit consent</li>
            <li>To comply with legal requirements or court orders</li>
            <li>With trusted service providers who assist in platform operations</li>
            <li>To protect our rights, property, or safety</li>
            <li>In connection with a business transaction (merger, acquisition)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. International Data Transfers</h2>
          <p className="text-gray-600 mb-6">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place through standard contractual clauses and adequacy decisions.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Port your data to another service</li>
            <li>Restrict processing of your information</li>
            <li>Object to certain processing activities</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Data Retention</h2>
          <p className="text-gray-600 mb-6">
            We retain your information for as long as necessary to provide our services and comply with legal obligations. Account information is typically retained for 7 years after account closure. Message data is retained according to our data retention policy and your specific requirements.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Compliance</h2>
          <p className="text-gray-600 mb-6">
            Our privacy practices comply with applicable data protection laws including GDPR (General Data Protection Regulation), India&apos;s DPDP Act (Digital Personal Data Protection Act), CCPA (California Consumer Privacy Act), and other relevant privacy regulations.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@cliona.ai</p>
            <p className="text-gray-700 mb-2"><strong>Address:</strong> Data Protection Officer, Cliona Inc.</p>
            <p className="text-gray-700"><strong>Response Time:</strong> We will respond to privacy requests within 30 days</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Updates to This Policy</h2>
          <p className="text-gray-600 mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
          </p>
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