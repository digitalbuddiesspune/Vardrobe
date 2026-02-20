import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ReturnPolicy = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Return & Refund Policy</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              At SANSKRUTEE, we want you to be completely satisfied with your purchase. This Return & Refund Policy explains our procedures for returns, exchanges, and refunds. Please read this policy carefully before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Return Eligibility</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Return Window</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may return eligible items within <strong>7 days</strong> of delivery. The return period starts from the date you receive the product. To be eligible for a return, items must be unused, unwashed, and in their original condition with all tags and packaging intact.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 Non-Returnable Items</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  The following items are not eligible for return:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Items that have been worn, washed, or used</li>
                  <li>Items without original tags or packaging</li>
                  <li>Items damaged due to misuse or negligence</li>
                  <li>Customized or personalized items</li>
                  <li>Items purchased during clearance or final sale</li>
                  <li>Underwear, innerwear, and intimate apparel (for hygiene reasons)</li>
                  <li>Items damaged after delivery due to customer's fault</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Return Process</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Initiating a Return</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  To initiate a return, please follow these steps:
                </p>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                  <li>Log into your account on our website</li>
                  <li>Go to "My Orders" section</li>
                  <li>Select the order containing the item you wish to return</li>
                  <li>Click on "Return" or "Request Return"</li>
                  <li>Select the item(s) you want to return and provide a reason</li>
                  <li>Submit your return request</li>
                </ol>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Alternatively, you can contact our customer service team via email or phone to initiate a return.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Return Authorization</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once your return request is approved, you will receive a Return Authorization (RA) number and return instructions via email. Please include the RA number with your return package. Returns without an RA number may not be processed.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.3 Packaging for Return</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  When returning items, please:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Use the original packaging if possible</li>
                  <li>Include all original tags, labels, and accessories</li>
                  <li>Securely pack the items to prevent damage during transit</li>
                  <li>Include the RA number and return form (if provided)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Return Shipping</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Return Shipping Charges</h3>
                <p className="text-gray-700 leading-relaxed">
                  Return shipping charges depend on the reason for return:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                  <li><strong>Defective/Wrong Item:</strong> Free return shipping (we will arrange pickup or reimburse shipping costs)</li>
                  <li><strong>Size/Color Exchange:</strong> Free return shipping for the first exchange</li>
                  <li><strong>Change of Mind:</strong> Customer bears return shipping charges</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Return Shipping Methods</h3>
                <p className="text-gray-700 leading-relaxed">
                  We recommend using a trackable shipping method for returns. You can use our prepaid return label (if provided) or ship the item yourself using any reliable courier service. Please retain the shipping receipt until your return is processed.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Process</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Refund Eligibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  Refunds will be processed once we receive and inspect the returned item(s). We will notify you via email once we receive your return and again once the inspection is complete.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Refund Timeline</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Refunds are typically processed within 5-10 business days after we receive and approve your return. The refund will be issued to the original payment method used for the purchase:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                  <li><strong>UPI:</strong> 2-5 business days</li>
                  <li><strong>Net Banking:</strong> 5-10 business days</li>
                  <li><strong>Cash on Delivery:</strong> Refund will be processed via bank transfer (7-14 business days)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.3 Refund Amount</h3>
                <p className="text-gray-700 leading-relaxed">
                  The refund amount will include the product price paid. Original shipping charges are non-refundable unless the return is due to our error (wrong item, defective product). If you received free shipping, the standard shipping charges may be deducted from your refund.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Exchange Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.1 Exchange Eligibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  Exchanges are available for size or color changes within 7 days of delivery, subject to product availability. Items must be unused, unwashed, and in original condition with all tags attached.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.2 Exchange Process</h3>
                <p className="text-gray-700 leading-relaxed">
                  To request an exchange, follow the return process and specify that you want an exchange. If the requested size/color is available, we will ship the replacement item. If the requested item is not available, we will process a refund instead.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.3 Price Differences</h3>
                <p className="text-gray-700 leading-relaxed">
                  If the exchange item has a different price, you will be charged or refunded the difference accordingly.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Defective or Damaged Items</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you receive a defective, damaged, or incorrect item:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Contact us immediately (within 48 hours of delivery)</li>
              <li>Provide photos of the defect or damage</li>
              <li>We will arrange a free pickup and replacement or full refund</li>
              <li>No return shipping charges will apply</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cancellation Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">8.1 Order Cancellation</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may cancel your order before it is shipped. Once an order is shipped, it cannot be cancelled, but you can return it following our return policy. To cancel an order, contact us immediately or cancel through your account if the option is available.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">8.2 Cancellation Refund</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you cancel an order before shipment, you will receive a full refund within 5-7 business days. If the order has already been processed for shipping, cancellation may not be possible.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              For any questions about returns, exchanges, or refunds, please contact our customer service team:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> returns@sanskrutee.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91-XXXXX-XXXXX</p>
              <p className="text-gray-700"><strong>Address:</strong> SANSKRUTEE, India</p>
              <p className="text-gray-700 mt-2"><strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify this Return & Refund Policy at any time. Changes will be effective immediately upon posting on this page. We encourage you to review this policy periodically to stay informed about our return and refund procedures.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;

