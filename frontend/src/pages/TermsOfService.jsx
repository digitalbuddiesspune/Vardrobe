import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using SANSKRUTEE's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Permission is granted to temporarily access the materials on SANSKRUTEE's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              To access certain features of our website, you may be required to register for an account. When you register, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and identification</li>
              <li>Accept all responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Products and Pricing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Product Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions, images, or other content on the website is accurate, complete, reliable, current, or error-free.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Pricing</h3>
                <p className="text-gray-700 leading-relaxed">
                  All prices are listed in Indian Rupees (INR) and are subject to change without notice. We reserve the right to modify prices at any time. In the event of a pricing error, we reserve the right to cancel or refuse any orders placed at the incorrect price.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Availability</h3>
                <p className="text-gray-700 leading-relaxed">
                  Product availability is subject to change. We reserve the right to limit the quantity of items purchased per person, per household, or per order. We also reserve the right to discontinue any product at any time.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Orders and Payment</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Order Acceptance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your order is an offer to purchase products from us. We reserve the right to accept or reject your order for any reason, including product availability, errors in pricing or product information, or suspected fraud.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Payment</h3>
                <p className="text-gray-700 leading-relaxed">
                  Payment must be received by us before we ship your order. We accept various payment methods including credit cards, debit cards, UPI, and Cash on Delivery (COD). All payments are processed securely through our payment gateway partners.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping and Delivery</h2>
            <p className="text-gray-700 leading-relaxed">
              Shipping terms, delivery times, and costs are detailed in our Shipping Policy. We are not responsible for delays caused by shipping carriers or customs. Risk of loss and title for products purchased from us pass to you upon delivery to the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              Our return and refund policy is detailed in our Return Policy. Please review it carefully before making a purchase. We reserve the right to refuse returns that do not comply with our return policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, graphics, logos, images, audio clips, digital downloads, and software, is the property of SANSKRUTEE or its content suppliers and is protected by Indian and international copyright laws. You may not use, reproduce, or distribute any content from this website without our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Prohibited Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-2">You may not use our website:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track the personal information of others</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials on SANSKRUTEE's website are provided on an 'as is' basis. SANSKRUTEE makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall SANSKRUTEE or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SANSKRUTEE's website, even if SANSKRUTEE or a SANSKRUTEE authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless SANSKRUTEE and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from your use of the website or violation of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date. Your continued use of the website after any changes constitutes acceptance of the new Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> legal@sanskrutee.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91-XXXXX-XXXXX</p>
              <p className="text-gray-700"><strong>Address:</strong> SANSKRUTEE, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

