import React from "react";

const FinalCta = () => {
  return (
    <section className="py-32 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-6">

        <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center">

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Build with clarity.
            <br />
            <span className="text-zinc-400">Scale with confidence.</span>
          </h2>

          <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            InteractX helps teams eliminate chaos, align faster,
            and execute with precision — without adding complexity.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button className="px-8 py-3 bg-black text-white rounded-md font-medium hover:bg-zinc-800 transition">
              Start Free Trial
            </button>

            <button className="px-8 py-3 border border-zinc-300 rounded-md font-medium hover:bg-zinc-100 transition">
              Book a Demo
            </button>
          </div>

          {/* Trust line */}
          <div className="mt-10 text-sm text-zinc-500">
            No credit card required • 14-day free trial • Cancel anytime
          </div>

        </div>

      </div>
    </section>
  );
};

export default FinalCta;