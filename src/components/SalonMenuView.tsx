import React, { useState, useMemo } from 'react';
import { SALON_SERVICES, ServiceItem, SALON_INFO } from '../data/salonData';
import { Clock, Search, Sparkles, Crown, Tag, Phone, MessageCircle } from 'lucide-react';

export const SalonMenuView: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const menCategories = ['All', 'Grooming', 'De-Tan', 'Facials', 'Clean Ups', 'Colour', 'Oil Massage', 'Hair Spa'];
  const womenCategories = [
    'All',
    'Threading',
    'De-Tan',
    'Hair Cuts',
    'Hair Spa',
    'Mani & Pedi',
    'Oil Massage',
    'Colour',
    'Smoothening & Keratin',
    'Bridal & Makeup',
    'Nails',
    'Mehendi',
  ];

  const currentCategories = selectedGender === 'men' ? menCategories : womenCategories;

  const handleGenderChange = (gender: 'men' | 'women') => {
    setSelectedGender(gender);
    setSelectedCategory('All');
  };

  const filteredServices = useMemo(() => {
    return SALON_SERVICES.filter(service => {
      if (service.gender !== selectedGender && service.gender !== 'unisex') {
        return false;
      }
      if (selectedCategory !== 'All' && service.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesCat = service.category.toLowerCase().includes(query);
        const matchesDesc = service.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedGender, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span>{SALON_INFO.branch} Branch Rate Card</span>
            <span className="text-slate-600">·</span>
            <span>Closes 10:00 PM</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Official Services & Price List
          </h2>
          <p className="text-xs text-slate-300">
            All prices in Indian Rupees (₹). <strong className="text-amber-400">Flat 10% OFF</strong> applied on every service!
          </p>
        </div>

        {/* WhatsApp Consultation */}
        <a
          href={SALON_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Inquiry: {SALON_INFO.ownerPhoneDisplay}</span>
        </a>
      </div>

      {/* Offer Highlight Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Default Offer</div>
            <div className="text-sm font-bold text-white">FLAT 10% OFF ON ALL SERVICES</div>
            <div className="text-[11px] text-slate-400">Discount automatically reflected in pricing</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">VIP Pass ₹499</div>
            <div className="text-sm font-bold text-white">Hair Adda Annual Membership</div>
            <div className="text-[11px] text-slate-400">15% OFF on overall bill · 1 Year · All branches</div>
          </div>
        </div>
      </div>

      {/* Gender Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="inline-flex p-1 bg-slate-900 rounded-2xl border border-slate-800 self-start">
          <button
            onClick={() => handleGenderChange('men')}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              selectedGender === 'men'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>👨 Men's Menu</span>
            <span className="text-[11px] opacity-75 font-normal">
              ({SALON_SERVICES.filter(s => s.gender === 'men').length})
            </span>
          </button>

          <button
            onClick={() => handleGenderChange('women')}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              selectedGender === 'women'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>👩 Girl / Women's Menu</span>
            <span className="text-[11px] opacity-75 font-normal">
              ({SALON_SERVICES.filter(s => s.gender === 'women').length})
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedGender === 'men' ? 'men' : 'girl'} services...`}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

      </div>

      {/* Subcategories Filter Chips */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
        {currentCategories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(service => {
          const discountedPrice = Math.round(service.originalPrice * 0.9);

          return (
            <div
              key={service.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 block">
                      {service.category}
                    </span>
                    <h3 className="font-display font-bold text-base text-white">
                      {service.name}
                    </h3>
                  </div>
                  {service.isPopular && (
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded shrink-0">
                      Popular
                    </span>
                  )}
                </div>

                {service.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 line-through tabular-nums font-mono">
                      ₹{service.originalPrice}/-
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold">
                      -10% OFF
                    </span>
                  </div>
                  <div className="font-display font-extrabold text-xl text-amber-400 tabular-nums font-mono">
                    ₹{discountedPrice}/-
                  </div>
                </div>

                {service.duration && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{service.duration}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
