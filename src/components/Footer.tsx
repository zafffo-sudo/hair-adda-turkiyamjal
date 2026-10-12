import React from 'react';
import { SALON_INFO } from '../data/salonData';
import { Star, Phone, MessageCircle, MapPin, Instagram, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-neutral-950 font-display font-extrabold text-base">
                HA
              </div>
              <span className="font-display font-bold text-lg text-neutral-100 tracking-wider">
                HAIR ADDA UNISEX SALON
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Style · Beauty · Elegance. Expert haircut, styling, colour aur grooming for men, women & kids in Turkayamjal.
            </p>
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.8 Rating (240 Verified Google Reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Services & Pricing
                </a>
              </li>
              <li>
                <a href="#coins" className="hover:text-amber-400 transition-colors">
                  Visit karo, Coins kamao!
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-amber-400 transition-colors">
                  Offers, Membership & Vouchers
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-amber-400 transition-colors">
                  Turkayamjal Branch & Map
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <div className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">
              Contact & Hours
            </div>
            <ul className="space-y-2 text-neutral-400">
              <li>Open daily: Closes 10:00 PM</li>
              <li>
                <a href={SALON_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  WhatsApp: {SALON_INFO.ownerPhoneDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:${SALON_INFO.salonLandline}`} className="hover:text-amber-400 transition-colors">
                  Desk: {SALON_INFO.salonLandlineDisplay}
                </a>
              </li>
              <li>
                <span className="text-neutral-500">Franchise: </span>
                <span className="text-neutral-300 font-mono">{SALON_INFO.franchiseContact}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Hair Adda Unisex Salon. All rights reserved.
          </div>
          <div>
            Demo mode – data sirf is device me save hota hai.
          </div>
        </div>

      </div>
    </footer>
  );
};
