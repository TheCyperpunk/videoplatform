import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Desimallu",
  description: "Terms of Service for Desimallu video platform",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
      
      <p className="text-neutral-400 mb-8">
        This document was last modified on: March 28, 2026
      </p>

      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <p>
          Our website operates as a content aggregation and sharing platform that provides thumbnails, links, and references to third-party websites and content (hereafter referred to as "Third-Party Sites"). We do not create, host, or act as the primary or secondary producer of any content displayed, and any inquiries regarding 18 U.S.C. § 2257 record-keeping requirements must be directed to the original content producers.
        </p>

        <p>
          By accessing or using this website, you agree to be bound by these Terms of Service and confirm that you are at least 18 years of age or the age of majority in your jurisdiction. You acknowledge that access to this website is strictly prohibited for minors and agree to take all necessary steps to prevent minors from accessing the content.
        </p>

        <p>
          You are granted a limited, non-exclusive, non-transferable, and revocable license to access and use the website solely for personal and non-commercial purposes. You agree not to copy, reproduce, distribute, modify, scrape, extract data, reverse engineer, or exploit any part of the website or its content without prior written permission.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Prohibited Activities</h2>
        <p>You further agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Attempt unauthorized access to any part of the website, servers, or systems</li>
          <li>Bypass, disable, or interfere with security-related features</li>
          <li>Use bots, scrapers, or automated systems to access or collect data</li>
          <li>Disrupt or interfere with the website's functionality or infrastructure</li>
        </ul>
        <p className="mt-4">Any unauthorized use may result in immediate termination of access.</p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Third-Party Content</h2>
        <p>
          The website may contain advertisements, third-party links, and external services that are not owned or controlled by us. We assume no responsibility for the content, policies, or practices of any Third-Party Sites, and any interactions or disputes with such parties are solely between you and the third party.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Content Removal Policy</h2>
        <p>
          We enforce a strict zero-tolerance policy toward non-consensual sexually explicit imagery (NCSEI), exploitation, coercion, or any violation of privacy. If you believe that any content violates this policy or involves you without consent, you may request removal by providing your legal name, identification (with sensitive details masked), relevant URLs, and a signed request. Verified requests are processed promptly, typically within 48 hours.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">DMCA Compliance</h2>
        <p>
          We comply with the Digital Millennium Copyright Act (DMCA) and respect the intellectual property rights of others. If you believe that any content linked on our website infringes your copyright, you may submit a valid takedown request including required legal details such as identification of the copyrighted work, your contact information, and a statement of good faith belief. Upon receipt of valid notice, we will act expeditiously to remove or disable access to the infringing material.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Content Disclaimer</h2>
        <p>
          All content available on this website is sourced from third-party platforms, and we do not guarantee the accuracy, legality, or authenticity of such content. We reserve the right to remove any content, restrict access, or terminate users at our sole discretion without prior notice.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Limitation of Liability</h2>
        <p>
          The website is provided on an "as is" and "as available" basis without warranties of any kind. We make no guarantees regarding availability, reliability, or uninterrupted access and shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the website.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Security</h2>
        <p>
          While we implement reasonable security measures, no system is completely secure. We do not guarantee that the website will be free from unauthorized access, cyber threats, or vulnerabilities, and users access the website at their own risk.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Changes to Terms</h2>
        <p>
          We may update, modify, maintain, suspend, or discontinue any part of the website or these Terms at any time without prior notice. Features or functionalities may be added, changed, or removed at our sole discretion. Continued use of the website after any changes constitutes acceptance of the revised Terms, and users are encouraged to review this page regularly.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Privacy</h2>
        <p>
          We do not store personal user data or maintain activity logs where possible; however, third-party services such as analytics or advertising providers may collect data independently. Users are responsible for managing their own privacy preferences.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Severability</h2>
        <p>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. We reserve the right to transfer or assign our rights and obligations under these Terms to any third party as part of a business transfer or restructuring.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Contact</h2>
        <p>
          For DMCA notices, content removal requests, or general inquiries, you may contact us at:
        </p>
        <p className="font-semibold">Email: Malludesi@protonmail.com</p>
        <p className="mt-4">
          We will make reasonable efforts to respond promptly to all valid requests.
        </p>

        <div className="border-t border-neutral-700 mt-8 pt-6">
          <p className="font-semibold">
            By continuing to access or use this website, you explicitly acknowledge that you have read, understood, and agreed to these Terms of Service in full, and that your continued use constitutes a legally binding acceptance of this agreement.
          </p>
        </div>
      </div>
    </div>
  );
}
