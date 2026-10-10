import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">MENTIONS LÉGALES</h1>
          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section><h2 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Éditeur du site</h2><p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">CapAuto SAS — Capital de 500 000 € — 12 Avenue des Champs-Élysées, 75008 Paris — SIRET: 123 456 789 00010 — TVA: FR00123456789</p></section>
            <section><h2 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Hébergement</h2><p className="text-gray-600 dark:text-gray-400 text-sm">Ce site est hébergé sur des serveurs sécurisés en France.</p></section>
            <section><h2 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Propriété intellectuelle</h2><p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">L&apos;ensemble du contenu de ce site (textes, images, logos) est protégé par le droit d&apos;auteur. Toute reproduction est interdite sans autorisation préalable.</p></section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
