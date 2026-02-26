import React from "react";
import gama from "../assets/gama.png";

const Hero = () => {
  return (
    <section className="w-full pt-28 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div className="font-poppins">

            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 mb-8">
              <span className="text-xs font-medium tracking-wide text-zinc-600">
                Built for High-Performance Teams
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
              Work smarter.
              <br />
              <span className="text-zinc-400">Move faster.</span>
            </h1>

            <p className="mt-6 text-lg text-zinc-600 leading-relaxed max-w-xl">
              InteractX centralizes communication, tasks, and documentation
              into a single intelligent workspace built for clarity and speed.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <button className="px-6 py-3 bg-black text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition">
                Start Free Trial
              </button>

              <button className="text-sm font-medium text-zinc-700 hover:text-black transition">
                View Product →
              </button>
            </div>

            {/* Micro social proof */}
            <div className="mt-12 flex items-center gap-8 text-sm text-zinc-500">
              <span>2,000+ teams</span>
              <span>•</span>
              <span>No credit card required</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>

          </div>

          {/* RIGHT SIDE – PRODUCT FRAME */}
          <div className="relative">

            <div className="border border-zinc-200 rounded-2xl bg-white shadow-sm p-6">
              <div className="h-80 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 text-sm">
              <img src={gama} alt="" className=""/>
              </div>
            </div>

            {/* Floating small card */}
            <div className="absolute -bottom-6 -left-6 border border-zinc-200 bg-white rounded-xl p-4 shadow-sm hidden md:block">
              <p className="text-xs text-zinc-500">Active Project</p>
              <p className="text-sm font-medium mt-1">Q1 Product Launch</p>
            </div>

          </div>

        </div>

        {/* Bottom divider strip */}
        <div className="mt-24 border-t border-zinc-200 pt-10 flex justify-between text-sm text-zinc-500">
          <span>Product Teams</span>
          <span>Startups</span>
          <span>Remote Companies</span>
          <span>Agencies</span>
          <span>Enterprise</span>
        </div>

      </div>
    </section>
  );
};

export default Hero;