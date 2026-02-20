import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { api } from '../utils/api';

const PrivacyPolicy = () => {
  const [title, setTitle] = useState('Privacy Policy');
  const [content, setContent] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        const data = await api.getPolicy('privacy');
        if (data && data.title && data.content) {
          setTitle(data.title);
          setContent(data.content);
          setLastUpdated(data.lastUpdated || data.updatedAt);
        }
      } catch (e) {
        // Use default content on error
      } finally {
        setLoading(false);
      }
    };
    loadPolicy();
  }, []);

  // Render content - if API content exists, render as HTML, otherwise render default
  const renderContent = () => {
    if (content && typeof content === 'string') {
      // Check if content contains HTML tags
      const hasHtml = /<[^>]+>/.test(content);
      if (hasHtml) {
        return <div dangerouslySetInnerHTML={{ __html: content }} className="space-y-6" />;
      } else {
        // Render as plain text with line breaks
        return content.split('\n').map((para, idx) => {
          if (!para.trim()) return <br key={idx} />;
          return <p key={idx} className="text-gray-700 leading-relaxed mb-4">{para}</p>;
        });
      }
    }
    
    // Default content
    return (
      <>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to SANSKRUTEE ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                <li>Register for an account</li>
                <li>Place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for customer support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                This information may include your name, email address, phone number, shipping address, billing address, payment information, and other details necessary to process your orders.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed">
                When you visit our website, we automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages you visit and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-2">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Process and fulfill your orders</li>
            <li>Send you order confirmations and updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and user experience</li>
            <li>Detect and prevent fraud and abuse</li>
            <li>Comply with legal obligations</li>
            <li>Analyze website usage and trends</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf, such as payment processing, shipping, and data analytics.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
            <li><strong>With Your Consent:</strong> We may share your information with your explicit consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-2">Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Right to access your personal information</li>
            <li>Right to rectify inaccurate information</li>
            <li>Right to request deletion of your information</li>
            <li>Right to object to processing of your information</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our website is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Email:</strong> privacy@sanskrutee.com</p>
            <p className="text-gray-700"><strong>Phone:</strong> +91-XXXXX-XXXXX</p>
            <p className="text-gray-700"><strong>Address:</strong> SANSKRUTEE, India</p>
          </div>
        </section>
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
