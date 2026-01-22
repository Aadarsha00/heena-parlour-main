export default function AwardsSection() {
  // Sample awards data - replace with your actual award images
  const awards = [
    {
      id: 1,
      image: "https://via.placeholder.com/300x400/f59e0b/ffffff?text=Award+1",
      title: "Best Bridal Mehndi 2024",
      year: "2024"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300x400/d97706/ffffff?text=Award+2",
      title: "Excellence in Henna Art",
      year: "2023"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300x400/b45309/ffffff?text=Award+3",
      title: "Customer Choice Award",
      year: "2023"
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-20 bg-gradient-to-b from-white via-amber-50/30 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-transparent to-amber-400"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-amber-600" />
            <span className="text-sm font-medium tracking-[0.2em] text-amber-700 uppercase">
              Recognition
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-amber-400 to-amber-600" />
          </div>

          <h2 className="text-4xl font-display lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Our{" "}
            <span className="font-medium bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Awards
            </span>
          </h2>
          
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
          
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Honored to be recognized for our dedication to the art of beauty and customer satisfaction
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <div
              key={award.id}
              className="group relative"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: "fadeInUp 0.8s ease-out forwards",
              }}
            >
              <div className="bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm border border-amber-100/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-700 hover:-translate-y-2">
                {/* Award Image */}
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-6 w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transform -translate-y-0.5"></div>
                </div>

                {/* Award Info */}
                <div className="p-6 text-center">
                  <div className="inline-block px-3 py-1 mb-3 text-xs font-medium text-amber-700 bg-amber-50 rounded-full border border-amber-100">
                    {award.year}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 leading-tight">
                    {award.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}