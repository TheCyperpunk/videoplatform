import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Desimallu",
  description: "Contact Desimallu - Get in touch with us for inquiries, feedback, or support",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>

      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <p>
          We value your feedback and inquiries. Whether you have suggestions, need assistance, or have a specific question, you are welcome to reach out to us at any time. Please include a clear and relevant subject line so we can address your message efficiently.
        </p>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">How to Reach Us</h2>
        <p>
          You can contact us using the email address below. To help us respond quickly and accurately, please ensure your message includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Your full name and contact information</li>
          <li>A clear subject line summarizing your request</li>
          <li>Detailed information about your inquiry, issue, or suggestion</li>
        </ul>

        <div className="bg-[#111] border border-[#2E2E2E] rounded-lg p-4 mt-6">
          <p className="text-white font-semibold">Email: Malludesi@protonmail.com</p>
        </div>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Guidelines for a Proper Subject Line</h2>
        <p>
          To ensure your message is processed without delay, please use a specific and concise subject line. Examples include:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>"Suggestion for website improvement"</li>
          <li>"Inquiry regarding content or services"</li>
          <li>"Technical issue or bug report"</li>
          <li>"DMCA or content removal request"</li>
        </ul>

        <h2 className="text-lg font-normal text-white mt-8 mb-4">Response Time</h2>
        <p>
          We aim to respond to all inquiries within 1–2 business days. Response times may vary depending on the nature of the request.
        </p>
        <p className="mt-4">
          If your inquiry is urgent, please include the word "Urgent" in the subject line so it can be prioritized accordingly.
        </p>

        <div className="border-t border-neutral-700 mt-8 pt-6">
          <p className="font-semibold">
            By contacting us, you acknowledge that you are providing information voluntarily and that your communication may be used to respond to your request.
          </p>
        </div>
      </div>
    </div>
  );
}
