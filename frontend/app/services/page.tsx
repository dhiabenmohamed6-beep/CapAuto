import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, TrendingUp, Truck, CreditCard, Wrench, RefreshCw } from 'lucide-react';

const SERVICES = [
  { icon: TrendingUp, title: 'Achat & Vente', desc: 'Nous vous accompagnons dans l\'achat ou la vente de votre véhicule de prestige avec une expertise unique du marché du luxe.' },
  { icon: RefreshCw, title: 'Reprise de véhicule', desc: 'Vous souhaitez changer de véhicule ? Nous reprenons votre actuel à sa juste valeur avec une estimation gratuite et immédiate.' },
  { icon: CreditCard, title: 'Financement', desc: 'Nos experts financiers vous proposent des solutions de financement adaptées : crédit, LOA, crédit-bail ou financement professionnel.' },
  { icon: Truck, title: 'Import de véhicules', desc: 'Vous souhaitez un modèle introuvable en France ? Nous nous chargeons de l\'importer depuis l\'Europe ou le monde entier.' },
  { icon: Shield, title: 'Extension de garantie', desc: 'Protégez votre investissement avec nos extensions de garantie jusqu\'à 5 ans, couvrant tous les composants mécaniques.' },
  { icon: Wrench, title: 'Entretien & préparation', desc: 'Nos techniciens spécialisés assurent l\'entretien de vos véhicules de prestige dans nos ateliers équipés.' },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="bg-gray-100 dark:bg-[#111114] border-b border-black/10 dark:border-white/5 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center gap-3 mb-2"><span className="w-6 h-px bg-[#dc2626]" /><span className="text-[#dc2626] text-xs tracking-[0.3em] uppercase font-bold">Ce que nous proposons</span></div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">NOS SERVICES</h1>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-100 dark:bg-[#16161a] border border-black/10 dark:border-white/5 rounded-2xl p-8 hover:border-[#dc2626]/20 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 flex items-center justify-center mb-5 group-hover:bg-[#dc2626]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#dc2626]" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-black text-lg mb-3">{title}</h3>
                <p className="text-gray-600 dark:text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
