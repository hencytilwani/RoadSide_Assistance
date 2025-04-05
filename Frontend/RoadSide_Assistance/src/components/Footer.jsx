import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { HiOutlineChevronRight } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-[#1f2d3d] text-white pt-12 border-t-4 border-orange-500">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: RoadAssist Pro */}
        <div>
          <h3 className="text-lg font-semibold mb-4">RoadAssist Pro</h3>
          <p className="text-sm text-gray-300">
            Your trusted partner for roadside assistance and vehicle maintenance.
          </p>
          <div className="flex gap-4 mt-4 text-gray-400 text-lg">
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaLinkedinIn className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="text-sm text-gray-300 space-y-3">
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> Home
            </li>
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> Services
            </li>
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> About Us
            </li>
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> Contact
            </li>
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> FAQ
            </li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="text-sm text-gray-300 space-y-3">
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> Towing
            </li>
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> Fuel Delivery
            </li>
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> Battery Jump Start
            </li>
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> Tire Replacement
            </li>
            <li className="flex items-center hover:text-orange-400 cursor-pointer">
              <HiOutlineChevronRight className="text-orange-400 mr-2" /> Lockout Assistance
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="flex items-center text-sm text-gray-300">
            <FaMapMarkerAlt className="text-orange-400 mr-2" /> 123 Roadside Ave, Carville
          </p>
          <p className="flex items-center text-sm text-gray-300 mt-3">
            <FaPhoneAlt className="text-orange-400 mr-2" /> +1 (800) 555-ROAD
          </p>
          <p className="flex items-center text-sm text-gray-300 mt-3">
            <FaEnvelope className="text-orange-400 mr-2" /> help@roadassistpro.com
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 text-center text-gray-400 text-sm border-t border-gray-600 py-4">
        <p>© 2023 RoadAssist Pro. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-orange-400">Privacy Policy</a>
          <a href="#" className="hover:text-orange-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
