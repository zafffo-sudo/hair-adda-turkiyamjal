import React from 'react';
import { SALON_INFO } from '../data/salonData';
import {
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Clock,
  Instagram,
  Briefcase,
  ExternalLink,
  Star,
  Tag,
  Crown,
  Camera,
  Ticket,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          <MapPin className="w-4 h-4" />
          <span>{SALON_INFO.branch} Branch Details</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl text-white">
          Hair Adda Unisex Salon · Turkayamjal
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Sri Sai Nagar, Turkayamjal X Road beside Bank Of Baroda. Expert haircuts, styling, colours, facials & grooming with loyalty coin rewards on every visit!
        </p>
      </div>

      {/* Main Location & Contact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Address Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">
                  {SALON_INFO.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-amber-400 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-semibold">{SALON_INFO.rating} / 5.0</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300">({SALON_INFO.reviewCount} Verified Google Reviews)</span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Closes 10:00 PM</span>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5 text-xs">
              <div className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Physical Address</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed pl-5 font-medium">
                {SALON_INFO.address}
              </p>
              <div className="pl-5 text-slate-400 font-mono text-[11px]">
                Google Plus Code: <span className="text-amber-400 font-bold">{SALON_INFO.plusCode}</span>
              </div>
            </div>

            {/* Timings */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-200">Opening Hours</div>
              <div className="flex justify-between text-slate-400">
                <span>Monday – Sunday (Open All 7 Days)</span>
                <span className="text-slate-200 font-mono font-bold">08:00 AM – 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Direct Navigation Button */}
          <div>
            <a
              href={SALON_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps / Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Direct Contacts & Franchise (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Owner Direct WhatsApp & Call */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Direct Owner Contact
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Salon Owner</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{SALON_INFO.ownerPhoneDisplay}</div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${SALON_INFO.ownerPhone}`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
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

          {/* Salon Reception Desk */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Salon Front Desk Landline
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Front Desk Reception</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{SALON_INFO.salonLandlineDisplay}</div>
              </div>
              <a
                href={`tel:${SALON_INFO.salonLandline}`}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>

          {/* Instagram Handle */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Instagram Reel Collab
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Official Instagram</div>
                <div className="text-xs text-amber-400 font-mono mt-0.5">{SALON_INFO.instagramHandle}</div>
              </div>
              <a
                href={SALON_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Visit Page</span>
              </a>
            </div>
          </div>

          {/* Franchise Inquiry */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/30 space-y-2 shadow-lg">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Hair Adda Franchise Inquiry</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Contact Hotline:</span>
              <a
                href={`tel:${SALON_INFO.franchiseContact.replace(/-/g, '')}`}
                className="font-mono text-amber-400 font-extrabold hover:underline text-sm"
              >
                {SALON_INFO.franchiseContact}
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Special Salon Offers Strip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl text-white">
            Hair Adda Privileges & Offers
          </h3>
          <p className="text-xs text-slate-400">
            Available at Turkayamjal branch for all customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold text-xs uppercase flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>Flat 10% OFF</span>
            </div>
            <p className="text-xs text-slate-300">
              On all haircuts, grooming, colour, facial, threading, and spa services.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 uppercase">
              <Crown className="w-4 h-4" />
              <span>Membership ₹499</span>
            </div>
            <p className="text-xs text-slate-300">
              15% off overall bill for 1 full year across all Hair Adda branches.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 uppercase">
              <Camera className="w-4 h-4" />
              <span>Reel Collab (15%)</span>
            </div>
            <p className="text-xs text-slate-300">
              Salon me haircut karwa kar reel upload + collaborate karo → next visit par 15% off.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 uppercase">
              <Ticket className="w-4 h-4" />
              <span>Lucky 50% Vouchers</span>
            </div>
            <p className="text-xs text-slate-300">
              Owner issue karta hai ID verified customers ko (50% sirf 2 lucky customers ko).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
