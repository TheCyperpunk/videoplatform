import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA / Content Removal | Desimallu",
  description: "DMCA and content removal requests for Desimallu",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DMCAPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">DMCA / Content Removal</h1>

      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <p>
          We take content removal requests seriously and are committed to addressing valid concerns in a timely and responsible manner. If you believe any content accessible through our platform should be removed, you may contact us with the appropriate details.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Why Content Removal Matters</h2>
        <p>
          We aim to maintain a respectful and compliant platform. Removing unauthorized, harmful, or policy-violating content helps ensure a safer and more reliable experience for all users. If you encounter content that you believe violates laws, rights, or platform standards, you are encouraged to report it.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Content Source Disclaimer</h2>
        <p>
          We do not create, host, or upload any content displayed on this website. All content is sourced from third-party platforms, websites, or services. We act solely as a content aggregation and linking platform. If you have concerns regarding any content, we will review requests and take appropriate action where necessary.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">How to Request Content Removal</h2>
        <p>
          To submit a content removal or DMCA request, please email us with the following information:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Your full name and contact information</li>
          <li>Direct URL(s) of the content in question</li>
          <li>A clear explanation of why the content should be removed</li>
          <li>A statement confirming that the information provided is accurate and made in good faith</li>
        </ul>

        <div className="bg-[#111] border border-[#2E2E2E] rounded-lg p-4 mt-6">
          <p className="text-white font-semibold">Email: Malludesi@protonmail.com</p>
        </div>

        <p className="mt-4">
          Please ensure your request is complete and accurate to avoid delays in processing.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Our Commitment</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We aim to review and respond to all valid requests within 1–2 business days</li>
          <li>In cases requiring additional verification, response times may vary</li>
          <li>Appropriate actions may include removing links, disabling access, or restricting content where applicable</li>
        </ul>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Need Further Assistance?</h2>
        <p>
          If you have additional questions or require further clarification, feel free to contact us. We are committed to assisting users and maintaining the integrity of the platform.
        </p>

        <div className="border-t border-neutral-700 mt-8 pt-6">
          <p className="font-semibold">
            By submitting a request, you acknowledge that you are authorized to act on the matter and that misuse of this process may result in legal consequences.
          </p>
        </div>
      </div>
    </div>
  );
}
