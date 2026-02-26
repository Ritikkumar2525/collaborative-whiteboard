import React from "react";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-24 pb-10 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-16">

          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-semibold">
              InteractX
            </h3>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              A focused workspace built for modern teams who value clarity,
              structure, and execution.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition">Updates</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-20 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">

          <p>© 2026 InteractX. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;