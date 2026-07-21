import { ADDRESS, CIN, COMPANY_NAME, EMAILS, GSTIN, PHONE } from '../constants/companyInfo';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-light tracking-widest mb-6 text-gray-900">
            CONTACT US
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 italic">We'd love to hear from you</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div>
            <h2 className="text-3xl font-light tracking-wider mb-8 text-gray-900 text-center">
              GET IN TOUCH
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Have a question about our products or need assistance with your order? We're here to help! Reach out to us and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl text-amber-600">📧</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                {EMAILS.map((email) => (
                  <p key={email} className="text-gray-700">
                    <a href={`mailto:${email}`} className="hover:text-amber-600 transition-colors">
                      {email}
                    </a>
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl text-amber-600">📞</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-700">
                  <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="hover:text-amber-600 transition-colors">
                    {PHONE}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 md:col-span-2">
              <div className="text-3xl text-amber-600">📍</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-700">{ADDRESS}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Company Name:</strong> {COMPANY_NAME}</p>
              <p><strong>GSTIN:</strong> {GSTIN}</p>
              <p><strong>CIN:</strong> {CIN}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
