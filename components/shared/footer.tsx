/* eslint-disable react/no-unescaped-entities */
// components/shared/footer.tsx
// "use client"; // Pas nécessaire pour un footer statique sans interaction client-side spécifique

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  // Fonctions utilitaires pour obtenir les variables CSS de couleur
  // Ces fonctions sont utiles si vous avez défini des variables CSS comme --primary-400
  const getPrimaryColor = (shade: number) => `var(--primary-${shade})`;
  const getNeutralColor = (shade: number) => `var(--neutral-${shade})`;

  return (
    <footer className="py-10" style={{ backgroundColor: getNeutralColor(900), color: getNeutralColor(100) }}> {/* bg-neutral-900 -> neutral-900, text-white -> neutral-100 */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="col-span-full md:col-span-1 mb-6 md:mb-0">
          <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/favicon.ico" // Assurez-vous que votre favicon est bien dans le dossier /public
                alt="HireMatch Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-bold">HireMatch</span>
          </Link>
          <p className="text-sm" style={{ color: getNeutralColor(400) }}> {/* text-neutral-400 -> neutral-400 */}
            Connect Talent With Opportunity.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4" style={{ color: getPrimaryColor(400) }}> {/* text-indigo-400 -> primary-400 */}
            Liens Rapides
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: getNeutralColor(400) }}> {/* text-neutral-400 -> neutral-400 */}
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/about">À propos</Link></li>
            <li><Link href="/features">Fonctionnalités</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-lg mb-4" style={{ color: getPrimaryColor(400) }}> {/* text-indigo-400 -> primary-400 */}
            Légal
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: getNeutralColor(400) }}> {/* text-neutral-400 -> neutral-400 */}
            <li><Link href="/terms">Conditions Générales d'Utilisation</Link></li>
            <li><Link href="/privacy">Politique de Confidentialité</Link></li>
            <li><Link href="/cookies">Politique de Cookies</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4" style={{ color: getPrimaryColor(400) }}> {/* text-indigo-400 -> primary-400 */}
            Contact
          </h3>
          <p className="text-sm" style={{ color: getNeutralColor(400) }}> {/* text-neutral-400 -> neutral-400 */}
            Email: contact@hirematch.com<br />
            Téléphone: +33 1 23 45 67 89<br />
            Adresse: 123 Rue de l'Emploi, 75001 Paris, France
          </p>
        </div>
      </div>
      <div
        className="mt-8 pt-6 text-center text-sm"
        style={{ borderTop: `1px solid ${getNeutralColor(700)}`, color: getNeutralColor(500) }} // border-neutral-700 -> neutral-700, text-neutral-500 -> neutral-500
      >
        &copy; {new Date().getFullYear()} HireMatch. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;