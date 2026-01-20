const features = [
  {
    title: "Create Invoices",
    description: "Generate professional invoices in seconds.",
  },
  {
    title: "Track Payments",
    description: "Know exactly who has paid and who hasn’t.",
  },
  {
    title: "Business Ready",
    description: "Designed for freelancers and growing teams.",
  },
];

export default function Features() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
