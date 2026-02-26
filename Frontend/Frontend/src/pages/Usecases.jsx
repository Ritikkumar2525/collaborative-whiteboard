import React from "react";

const Usecases = () => {
  const cases = [
    {
      title: "Product Teams",
      desc: "Align roadmaps, feedback, and execution in one collaborative space."
    },
    {
      title: "Startups",
      desc: "Move fast without losing clarity across growing teams."
    },
    {
      title: "Remote Companies",
      desc: "Maintain context and communication across distributed workflows."
    },
    {
      title: "Agencies",
      desc: "Coordinate clients, timelines, and deliverables with precision."
    },
    {
      title: "Enterprise Teams",
      desc: "Scale collaboration across departments without fragmentation."
    },
    {
      title: "Educational Groups",
      desc: "Organize learning, assignments, and discussions in structured environments."
    },
  ];

  return (
    <section className="py-28 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-20">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-4xl font-semibold tracking-tight leading-tight">
              Built for teams
              <br />
              <span className="text-zinc-400">that move with intent.</span>
            </h2>

            <p className="mt-6 text-lg text-zinc-600 max-w-md leading-relaxed">
              Whether you're scaling a startup or managing enterprise operations,
              InteractX adapts to your workflow without adding complexity.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="divide-y divide-zinc-200">
            {cases.map((item, i) => (
              <div key={i} className="py-6 group">

                <div className="flex justify-between items-start gap-6 hover:bg-zinc-100 p-4 rounded-lg transition duration-300 cursor-pointer">
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-black transition">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed max-w-md">
                      {item.desc}
                    </p>
                  </div>

                  <span className="text-sm text-zinc-400">
                    0{i + 1}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Usecases;