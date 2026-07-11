import { Link } from "react-router-dom";
import { InstagramIcon, FacebookIcon, YoutubeIcon, LinkedinIcon } from "./SocialIcons";

const shopLinks = ["Rings", "Necklaces", "Earrings", "Bracelets", "Wedding Collection", "New Arrivals"];
const companyLinks = ["About Us", "Craftsmanship", "Sustainability", "Careers"];
const careLinks = ["Contact Us", "Shipping & Returns", "Size Guide", "FAQs"];
const paymentMethods = ["Visa", "Mastercard", "Amex", "UPI", "Razorpay", "Stripe"];

const Footer = () => {
  return (
    <footer className="bg-noir border-t border-ivory/10 pt-20 pb-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 pb-16">
        <div className="col-span-2 md:col-span-1">
          <span className="font-heading text-ivory text-xl tracking-[0.2em]">LUMIÈRE</span>
          <p className="font-body text-ivory/50 text-[13px] leading-relaxed mt-4 max-w-[220px]">
            Fine jewelry cast in gold, worn like quiet confidence.
          </p>
          <div className="flex items-center gap-4 mt-6 text-ivory/70">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-champagne transition-colors">
              <InstagramIcon size={18} strokeWidth={1.5} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-champagne transition-colors">
              <FacebookIcon size={18} strokeWidth={1.5} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-champagne transition-colors">
              <YoutubeIcon size={18} strokeWidth={1.5} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-champagne transition-colors">
              <LinkedinIcon size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-body text-ivory text-[13px] tracking-[0.15em] uppercase mb-5">Shop</h4>
          <ul className="flex flex-col gap-3">
            {shopLinks.map((link) => (
              <li key={link}>
                <Link
                  to={`/category/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="font-body text-ivory/50 text-[13px] hover:text-champagne transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-body text-ivory text-[13px] tracking-[0.15em] uppercase mb-5">Company</h4>
          <ul className="flex flex-col gap-3">
            {companyLinks.map((link) => (
              <li key={link}>
                <Link to="/" className="font-body text-ivory/50 text-[13px] hover:text-champagne transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-body text-ivory text-[13px] tracking-[0.15em] uppercase mb-5">Customer Care</h4>
          <ul className="flex flex-col gap-3">
            {careLinks.map((link) => (
              <li key={link}>
                <Link to="/" className="font-body text-ivory/50 text-[13px] hover:text-champagne transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-ivory/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-body text-ivory/40 text-[12px] order-2 md:order-1">
          © {new Date().getFullYear()} Lumière. All rights reserved.
        </p>
        <div className="flex items-center gap-2 order-1 md:order-2">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="border border-ivory/15 text-ivory/50 text-[10px] tracking-wide px-2.5 py-1 rounded"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
