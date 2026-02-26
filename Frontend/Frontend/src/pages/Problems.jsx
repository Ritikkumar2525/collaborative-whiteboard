import React from "react";

const Problems = () => {
  const items = [
    {
      number: "01",
      title: "Scattered Communication",
      desc: "Messages, files, and decisions spread across multiple tools create confusion and slow execution."
    },
    {
      number: "02",
      title: "Version Conflicts",
      desc: "Outdated documents and overlapping edits disrupt alignment and waste valuable time."
    },
    {
      number: "03",
      title: "Lack of Visibility",
      desc: "Without clear oversight, teams struggle to track progress and stay accountable."
    },
  ];

  return (
    <section className="py-28 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-20">

          {/* LEFT SIDE – Strong Statement */}
          <div>
            <h2 className="text-4xl font-semibold tracking-tight leading-tight">
              Modern teamwork
              <br />
              <span className="text-zinc-400">is fragmented.</span>
            </h2>

            <p className="mt-6 text-lg text-zinc-600 max-w-md leading-relaxed">
              Teams jump between tools, lose context, and spend more time
              managing systems than building meaningful work.
            </p>
          </div>

          {/* RIGHT SIDE – Stacked Problems */}
          <div className="space-y-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="group p-8 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 transition"
              >
                <div className="flex items-start gap-6">

                  <span className="text-sm font-medium text-zinc-400">
                    {item.number}
                  </span>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
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

export default Problems;