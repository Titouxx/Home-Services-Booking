import "../styles/TermsPage.css";
import Layout from "./Layout";

const TermsPage = () => {
  return (
    <div className="terms-container">
      <Layout>
        <h1 className="terms-title">Terms of Service</h1>

        <div>
          <h2 className="terms-section-title">1. General Terms</h2>
          <p className="terms-paragraph">
            By accessing and using the PLANITY platform, you accept and agree to
            be bound by these Terms of Service.
          </p>

          <h2 className="terms-section-title">2. Services</h2>
          <p className="terms-paragraph">
            PLANITY connects users with home service professionals for cleaning,
            plumbing, electrical work, and other services.
          </p>

          <h2 className="terms-section-title">3. Booking Policy</h2>
          <p className="terms-paragraph">
            All service bookings require payment authorization. Cancellations
            must be made at least 24 hours before the scheduled service.
          </p>

          <h2 className="terms-section-title">4. Liability</h2>
          <p className="terms-paragraph">
            PLANITY acts as an intermediary between users and service providers.
            We are not liable for any damages occurring during service
            provision.
          </p>

          <h2 className="terms-section-title">5. Privacy</h2>
          <p className="terms-paragraph">
            Your personal data is processed according to our Privacy Policy. We
            never share your information with third parties without consent.
          </p>

          <h2 className="terms-section-title">6. Changes to Terms</h2>
          <p className="terms-paragraph">
            We may modify these terms at any time. Continued use of the platform
            constitutes acceptance of the modified terms.
          </p>

          <p className="terms-last-updated">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </Layout>
    </div>
  );
};

export default TermsPage;
