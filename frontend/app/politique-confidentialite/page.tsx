import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PolitiquePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">POLITIQUE DE CONFIDENTIALITÉ</h1>
          <div className="space-y-6">
            <section><h2 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Collecte des données</h2><p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">CapAuto collecte uniquement les données nécessaires au traitement de vos demandes : nom, email, téléphone et messages. Ces données sont conservées 3 ans.</p></section>
            <section><h2 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Vos droits (RGPD)</h2><p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Contactez-nous à: privacy@capauto.fr</p></section>
            <section><h2 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Cookies</h2><p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Ce site utilise uniquement des cookies fonctionnels essentiels (préférences utilisateur). Aucun cookie publicitaire tiers n&apos;est utilisé.</p></section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
