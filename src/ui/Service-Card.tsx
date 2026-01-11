type PriceItem = {
  name: string;
  price: string;
};

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;
  prices: PriceItem[];
};

const ServiceCard = ({
  title,
  description,
  image,
  prices,
}: ServiceCardProps) => (
  <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
    {/* Golden accent border */}
    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-transparent to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

    {/* Image Container */}
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Floating golden accent */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 group-hover:scale-150" />
    </div>

    {/* Content Container */}
    <div className="relative p-8 flex flex-col flex-1 justify-between">
      {/* Title Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-[1px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
          <h3 className="text-2xl font-display font-light text-black tracking-wide group-hover:text-amber-700 transition-colors duration-300">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 leading-relaxed font-light text-sm">
          {description}
        </p>
      </div>

      {/* Prices Section */}
      {prices.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 border border-amber-400 rotate-45 opacity-60" />
            <span className="text-xs font-medium tracking-wider text-amber-700 uppercase">
              Services & Pricing
            </span>
          </div>

          <ul className="space-y-3">
            {prices.map((item, index) => (
              <li
                key={item.name}
                className="flex justify-between items-center py-2 border-b border-gray-100/50 last:border-none group-hover:border-amber-100 transition-colors duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <span className="text-sm text-gray-700 font-light">
                  {item.name}
                </span>
                <span className="text-sm font-medium text-black bg-gradient-to-r from-amber-50 to-amber-100/50 px-3 py-1 rounded-full border border-amber-200/30">
                  ${item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Accent */}
      <div className="mt-8 pt-4">
        <div className="w-12 h-[1px] bg-gradient-to-r from-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300" />
      </div>
    </div>

    {/* Subtle corner decoration */}
    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </div>
);

export default ServiceCard;
