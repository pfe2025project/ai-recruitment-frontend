/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-[color:var(--neutral-100)] text-[color:var(--primary-800)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-6">Contactez-nous</h2>
        <p className="text-lg mb-12">
          Une question, une suggestion, ou besoin d'assistance ? Remplissez le formulaire et notre équipe vous répondra rapidement.
        </p>

        <form className="space-y-6 text-left">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">Nom</label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full px-4 py-3 bg-[#eee] text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-600)]"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Adresse Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-3 bg-[#eee] text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-600)]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Message</label>
            <textarea
              rows={6}
              placeholder="Votre message..."
              className="w-full px-4 py-3 bg-[#eee] text-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-600)]"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 mt-4 border-b-4 border-indigo-500 text-gray-200 cursor-pointer bg-indigo-400 hover:bg-indigo-500 hover:text-white font-semibold rounded-lg transition duration-300"
            >
              Envoyer le message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
