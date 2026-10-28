import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/public/legal/LegalPage";

export const metadata: Metadata = { title: "Cookie Policy", description: "How Deca Bookstore uses cookies and browser storage.", alternates: { canonical: "https://decabookstore.co.ke/cookie-policy" } };

export default function CookiePolicy() {
  return <LegalPage title="Cookie Policy" intro="How this website and its service providers use cookies and similar browser technologies.">
    <section><h2>What these technologies do</h2><p>Cookies are small pieces of data stored by your browser. Websites can also use technologies such as local storage and IndexedDB to remember information on your device. These technologies can persist after you close your browser until they expire or you clear them.</p></section>
    <section><h2>How we use browser storage</h2><ul><li><strong>Shopping cart:</strong> the site uses local storage to remember items in your cart on the same browser and hostname. Clearing site data removes the saved cart.</li><li><strong>Sign-in:</strong> Firebase Authentication uses browser storage to maintain your session and support sign-in. Signing out or clearing site data affects your session. Sessions are separate on different hostnames.</li><li><strong>Site operation and security:</strong> our hosting or security providers may use cookies or similar technologies to deliver and protect the service.</li></ul></section>
    <section><h2>Third-party services</h2><p>The Google Maps embed on our contact page may use cookies or similar technologies and receive technical information according to Google’s settings and policies. When you follow a link to YouTube or another external site, that service’s practices apply. You can read <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Google’s information about cookies</a>.</p></section>
    <section><h2>Your choices</h2><p>You can use your browser settings to view, block or delete cookies and site data. Browser controls vary; consult your browser’s help pages. Blocking or clearing site data can sign you out, remove your saved cart or prevent sign-in and other features from working.</p></section>
    <section><h2>Updates and contact</h2><p>We may update this policy when the technologies we use change. For questions, visit our <Link href="/contact">contact page</Link>. For more about personal information, read our <Link href="/privacy-policy">Privacy Policy</Link>.</p></section>
  </LegalPage>;
}
