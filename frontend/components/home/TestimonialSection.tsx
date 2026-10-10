import { Star } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const TESTIMONIALS = [
  {
    name: 'Alexandre Dubois',
    role: 'Chef d\'entreprise',
    text: 'Service exceptionnel, équipe professionnelle et à l\'écoute. Mon Porsche 911 GTS est absolument parfaite. Je recommande vivement CapAuto.',
    rating: 5,
    vehicle: 'Porsche 911 GTS',
  },
  {
    name: 'Sophie Marchetti',
    role: 'Avocate',
    text: 'J\'ai trouvé la Ferrari Roma de mes rêves grâce à leur équipe. Le processus d\'achat a été fluide, transparent et sans surprise. Un service 5 étoiles.',
    rating: 5,
    vehicle: 'Ferrari Roma',
  },
  {
    name: 'Philippe Laurent',
    role: 'Entrepreneur',
    text: 'Troisième achat chez CapAuto. Toujours la même qualité, la même attention aux détails. Une confiance totale dans leur sélection.',
    rating: 5,
    vehicle: 'Bentley Continental GT',
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-[#0d0d10]">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-14">
          <ScrollReveal direction="up" distance={20} once={false}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#dc2626]" />
            <span className="text-[#dc2626] text-xs tracking-[0.35em] uppercase font-bold">Témoignages</span>
            <span className="w-8 h-px bg-[#dc2626]" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            ILS NOUS FONT <span className="text-[#dc2626]">CONFIANCE</span>
          </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, text, rating, vehicle }, i) => (
            <ScrollReveal key={name} direction="up" distance={20} delay={i * 100} once={false}>
            <div className="bg-gray-100 dark:bg-[#16161a] border border-black/10 dark:border-white/5 rounded-xl p-7 flex flex-col gap-4 hover:border-black/20 dark:hover:border-white/10 hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_10px_40px_rgba(220,38,38,0.1)] transition-all duration-300">
              <div className="flex items-center gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#dc2626] text-[#dc2626]" />
                ))}
              </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
          <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/30 flex items-center justify-center">
              <span className="text-[#dc2626] font-black">{name[0]}</span>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-bold text-sm">{name}</p>
              <p className="text-gray-600 dark:text-gray-500 text-xs">{role} · {vehicle}</p>
                </div>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
