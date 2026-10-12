import React from 'react';
import { SALON_INFO } from '../data/salonData';
import { MapPin, Navigation, Phone, MessageCircle, Clock, Instagram, Briefcase, ExternalLink, Star } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-16 lg:py-24 bg-neutral-900/60 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Visit Us in Turkayamjal
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            Salon Location & Contact
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Conveniently located at Turkayamjal X Road beside Bank Of Baroda. Ample parking and air-conditioned luxury lounge.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Main Salon Address & Hours (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-950 rounded-2xl border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="font-display font-bold text-xl text-neutral-100">
                    {SALON_INFO.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-amber-400 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-semibold">{SALON_INFO.rating} / 5.0</span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-400">({SALON_INFO.reviewCount} Verified Google Reviews)</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Closes 10:00 PM</span>
                </div>
              </div>

              {/* Physical Address */}
              <div className="space-y-2 text-xs">
                <div className="text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Full Address</span>
                </div>
                <p className="text-neutral-200 text-sm leading-relaxed pl-5 font-normal">
                  {SALON_INFO.address}
                </p>
                <div className="pl-5 text-neutral-400 font-mono text-[11px]">
                  Google Plus Code: <span className="text-amber-400">{SALON_INFO.plusCode}</span>
                </div>
              </div>

              {/* Hours Breakdown */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-2">
                <div className="font-semibold text-neutral-200">Opening Hours</div>
                <div className="flex justify-between text-neutral-400">
                  <span>Monday – Sunday (All 7 Days)</span>
                  <span className="text-neutral-200 font-mono">08:00 AM – 10:00 PM</span>
                </div>
              </div>

            </div>

            {/* Direct Google Maps Navigation Button */}
            <div className="pt-2">
              <a
                href={SALON_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps / Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Card 2: Direct Contact Channels & Franchise (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Owner WhatsApp & Direct Call */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Direct Owner Contact
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-neutral-100">Salon Owner</div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">{SALON_INFO.ownerPhoneDisplay}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${SALON_INFO.ownerPhone}`}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 transition-colors"
                    title="Call Owner"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={SALON_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                    title="WhatsApp Owner"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Salon Desk Call */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Salon Reception Desk
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-neutral-100">Landline / Front Desk</div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">{SALON_INFO.salonLandlineDisplay}</div>
                </div>
                <a
                  href={`tel:${SALON_INFO.salonLandline}`}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Desk</span>
                </a>
              </div>
            </div>

            {/* Instagram Profile */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Follow & Reel Collab
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-neutral-100">Instagram</div>
                  <div className="text-xs text-amber-400 font-mono mt-0.5">{SALON_INFO.instagramHandle}</div>
                </div>
                <a
                  href={SALON_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>View Instagram</span>
                </a>
              </div>
            </div>

            {/* Franchise Inquiries */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Franchise Opportunity</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">Hair Adda Franchise Inquiry:</span>
                <a
                  href={`tel:${SALON_INFO.franchiseContact.replace(/-/g, '')}`}
                  className="font-mono text-amber-400 font-bold hover:underline"
                >
                  {SALON_INFO.franchiseContact}
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
