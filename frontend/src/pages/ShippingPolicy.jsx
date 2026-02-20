import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ShippingPolicy = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Shipping Information</h2>
            <p className="text-gray-700 leading-relaxed">
              At SANSKRUTEE, we are committed to delivering your orders safely and on time. This Shipping Policy outlines our shipping procedures, delivery times, and shipping charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Shipping Locations</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We currently ship to all locations within India. We do not currently offer international shipping. If you are located outside India, please contact us to inquire about future shipping options.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Processing Time</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Order Processing</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once your order is confirmed and payment is verified, we typically process orders within 1-2 business days. Processing time may be longer during peak seasons, holidays, or promotional periods.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Custom Orders</h3>
                <p className="text-gray-700 leading-relaxed">
                  Custom or made-to-order items may require additional processing time. You will be notified of the estimated processing time at the time of order placement.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Delivery Time</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Standard Delivery</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Standard delivery times vary by location:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li><strong>Metro Cities:</strong> 3-5 business days</li>
                  <li><strong>Tier 2 Cities:</strong> 5-7 business days</li>
                  <li><strong>Other Locations:</strong> 7-10 business days</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  Delivery times are calculated from the date of shipment, not the date of order placement. Business days exclude weekends and public holidays.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Express Delivery</h3>
                <p className="text-gray-700 leading-relaxed">
                  Express delivery options may be available for select locations. Express delivery typically takes 1-3 business days. Additional charges apply for express delivery.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping Charges</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Free Shipping</h3>
                <p className="text-gray-700 leading-relaxed">
                  We offer free standard shipping on orders above ₹1,000. Free shipping applies to standard delivery only and excludes express delivery options.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Standard Shipping Charges</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  For orders below ₹1,000, standard shipping charges apply:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li><strong>Metro Cities:</strong> ₹99</li>
                  <li><strong>Other Locations:</strong> ₹149</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.3 Express Delivery Charges</h3>
                <p className="text-gray-700 leading-relaxed">
                  Express delivery charges vary by location and order value. Charges will be displayed at checkout before you confirm your order.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping Partners</h2>
            <p className="text-gray-700 leading-relaxed">
              We partner with reputable shipping carriers including India Post, Blue Dart, Delhivery, and other regional courier services to ensure reliable delivery of your orders. The shipping partner for your order will be selected based on your delivery location and may vary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Order Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Once your order is shipped, you will receive:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>A shipping confirmation email with your tracking number</li>
              <li>SMS notifications at key delivery milestones</li>
              <li>Access to track your order through our website using your order number</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can track your order status by logging into your account or using the tracking link provided in your shipping confirmation email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">8.1 Address Accuracy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Please ensure that your delivery address is complete and accurate. We are not responsible for delays or failed deliveries due to incorrect or incomplete addresses provided by you.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">8.2 Address Changes</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you need to change your delivery address, please contact us immediately after placing your order. Once the order has been shipped, address changes may not be possible, and additional charges may apply.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Delivery Attempts</h2>
            <p className="text-gray-700 leading-relaxed">
              Our shipping partners typically make 2-3 delivery attempts. If delivery cannot be completed after multiple attempts, the package may be returned to us. In such cases, you may be charged for return shipping and re-shipping if you wish to receive the order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Delayed or Lost Shipments</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">10.1 Delays</h3>
                <p className="text-gray-700 leading-relaxed">
                  While we strive to deliver orders within the estimated timeframe, delays may occur due to factors beyond our control, including weather conditions, natural disasters, carrier delays, or customs clearance. We will keep you informed of any significant delays.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">10.2 Lost Shipments</h3>
                <p className="text-gray-700 leading-relaxed">
                  If your order appears to be lost in transit, please contact us immediately. We will investigate and work with the shipping carrier to locate your package. If the package cannot be located, we will either reship your order or provide a full refund.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Multiple Items</h2>
            <p className="text-gray-700 leading-relaxed">
              If your order contains multiple items, they may be shipped together or in separate packages depending on availability and warehouse location. You will be notified if your order is split into multiple shipments. Shipping charges apply as per your order total, not per item.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Undeliverable Packages</h2>
            <p className="text-gray-700 leading-relaxed">
              Packages may be considered undeliverable due to incorrect addresses, refusal by the recipient, or inability to contact the recipient. In such cases, the package will be returned to us, and you may be charged for return shipping. We will contact you to arrange re-delivery or refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you have any questions about shipping or need assistance with your order, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> shipping@sanskrutee.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91-XXXXX-XXXXX</p>
              <p className="text-gray-700"><strong>Address:</strong> SANSKRUTEE, India</p>
              <p className="text-gray-700 mt-2"><strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

