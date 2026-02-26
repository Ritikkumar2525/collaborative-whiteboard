import React from "react";

const Solutions = () => {
  const items = [
    {
      number: "01",
      title: "Unified Workspace",
      desc: "Bring chat, tasks, and documentation into one seamless environment."
    },
    {
      number: "02",
      title: "Live Collaboration",
      desc: "Work simultaneously without duplication, lag, or version conflicts."
    },
    {
      number: "03",
      title: "Smart Organization",
      desc: "Structure projects with intuitive workflows and real-time visibility."
    },
  ];

  return (
    <section className="py-28 bg-zinc-950 text-white border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-20">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-4xl font-semibold tracking-tight leading-tight">
              A system designed
              <br />
              <span className="text-zinc-500">for momentum.</span>
            </h2>

            <p className="mt-6 text-lg text-zinc-400 max-w-md leading-relaxed">
              InteractX replaces fragmented tools with a focused workspace
              built for clarity, alignment, and execution.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-10">
            {items.map((item, i) => (
              <div key={i} className="border-b border-zinc-800 pb-8">

                <div className="flex items-start gap-6">
                  <span className="text-3xl font-semibold text-zinc-700">
                    {item.number}
                  </span>

                  <div>
                    <h3 className="text-xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-md">
                      {item.desc}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Solutions;