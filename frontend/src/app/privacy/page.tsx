import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Desimallu",
  description: "Privacy Policy for Desimallu video platform",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      
      <p className="text-neutral-400 mb-8">
        This document was last modified on: March 28, 2026
      </p>

      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <p>
          At our website, we are committed to protecting your privacy and maintaining transparency about how data is handled. This Privacy Policy explains how we interact with user data, third-party services, analytics, and advertisements while prioritizing minimal data collection.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">No Data Storage or Logs</h2>
        <p>
          We do not store personal data or maintain logs of user activity where possible, and our platform is designed as a content aggregation and sharing service with minimal direct data collection. Certain technical data (such as temporary server logs for security or performance) may be processed automatically, but this information is not used to personally identify users.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Third-Party Services</h2>
        <p>
          Our website may use third-party services, including but not limited to analytics providers, advertising networks, embedded media platforms, and external links or content providers. These third parties may collect data independently in accordance with their own privacy policies, and we do not control how they collect, use, or store your information. Users are encouraged to review the privacy policies of any third-party services they interact with.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Cookies and Tracking Technologies</h2>
        <p>
          Third-party services may use cookies, web beacons, or similar technologies to analyze traffic, deliver advertisements, and improve performance. You can control or disable cookies through your browser settings, although doing so may affect certain functionalities of the website.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Your Rights</h2>
        <p>As a user, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Understand what data may be collected by third-party services</li>
          <li>Opt out of personalized advertising through browser or ad settings</li>
          <li>Manage cookie preferences</li>
          <li>Use privacy tools such as VPNs or tracker blockers if desired</li>
        </ul>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Data Security</h2>
        <p>We take reasonable measures to maintain the security of the website; however:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>We do not store personal data directly where possible</li>
          <li>Third-party services are responsible for their own data protection practices</li>
          <li>No system can guarantee 100% security</li>
          <li>Users access the website at their own risk</li>
        </ul>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">External Links</h2>
        <p>
          Our website contains links to third-party websites, and we are not responsible for their privacy practices, content, or policies. Visiting such links is done at your own discretion.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Children's Privacy</h2>
        <p>
          This website is intended strictly for users who are at least 18 years old or the age of majority in their jurisdiction. We do not knowingly collect or store data from minors, and guardians are responsible for restricting access where necessary.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Policy Updates</h2>
        <p>
          We may update or modify this Privacy Policy at any time without prior notice to reflect changes in practices, technologies, or legal requirements. Continued use of the website constitutes acceptance of the revised policy, and users are encouraged to review this page regularly.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy, you may contact us at:
        </p>
        <p className="font-semibold">Email: Malludesi@protonmail.com</p>
        <p className="mt-4">
          We will make reasonable efforts to respond to all legitimate inquiries.
        </p>

        <div className="border-t border-neutral-700 mt-8 pt-6">
          <p className="font-semibold">
            By continuing to use this website, you acknowledge that you have read, understood, and agreed to this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
