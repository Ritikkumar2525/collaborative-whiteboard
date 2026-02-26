import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const navlink = [
    { name: "Home", link: "/" },
    { name: "Features", link: "/features" },
    { name: "Solution", link: "/Solution" },
    { name: "Demo", link: "/demo" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between font-poppins">
        <h1 className="text-xl font-semibold tracking-tight">
          InteractX
        </h1>

        <div className="flex items-center gap-10 text-sm">
          {navlink.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="text-zinc-600 hover:text-black transition-colors text-sm"
            >
              {item.name}
            </a>
          ))}

          <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-zinc-800 transition">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar