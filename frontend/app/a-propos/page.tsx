import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="bg-gray-100 dark:bg-[#111114] border-b border-black/10 dark:border-white/5 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center gap-3 mb-2"><span className="w-6 h-px bg-[#dc2626]" /><span className="text-[#dc2626] text-xs tracking-[0.3em] uppercase font-bold">Notre histoire</span></div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">À PROPOS</h1>
          </div>
        </div>
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div>
            <h2 className="text-gray-900 dark:text-white font-black text-2xl mb-4">L&apos;Excellence Automobile Depuis 2009</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">CapAuto est née d&apos;une passion absolue pour l&apos;automobile de prestige. Fondée en 2009 sur les Champs-Élysées, notre maison s&apos;est imposée comme la référence parisienne des véhicules d&apos;exception.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{ v: '15+', l: "Années d'expertise" }, { v: '500+', l: 'Véhicules vendus' }, { v: '98%', l: 'Clients satisfaits' }].map(({ v, l }) => (
              <div key={l} className="bg-gray-100 dark:bg-[#16161a] border border-black/10 dark:border-white/5 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-[#dc2626] mb-1">{v}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{l}</div>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-white font-black text-2xl mb-4">Notre Philosophie</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Nous croyons que l&apos;achat d&apos;un véhicule de luxe est bien plus qu&apos;une transaction financière — c&apos;est une expérience, une émotion, un moment unique. C&apos;est pourquoi chaque véhicule de notre catalogue est soigneusement sélectionné et contrôlé par nos experts.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
