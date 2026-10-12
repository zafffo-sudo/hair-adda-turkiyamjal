import React, { useState, useMemo } from 'react';
import { SALON_SERVICES, ServiceItem, SALON_INFO } from '../data/salonData';
import { useSalon } from '../context/SalonContext';
import { Clock, Plus, Check, Search, Sparkles, Crown, Tag, PhoneCall } from 'lucide-react';

interface ServicesSectionProps {
  onOpenCart: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenCart }) => {
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { cart, addToCart, removeFromCart, openBookingForService, hasMembership, activateMembership } = useSalon();

  // Men categories
  const menCategories = ['All', 'Grooming', 'De-Tan', 'Facials', 'Clean Ups', 'Colour', 'Oil Massage', 'Hair Spa'];

  // Women categories
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

  // Reset category if not in list when switching gender
  const handleGenderChange = (gender: 'men' | 'women') => {
    setSelectedGender(gender);
    setSelectedCategory('All');
  };

  const filteredServices = useMemo(() => {
    return SALON_SERVICES.filter(service => {
      // Gender filter
      if (service.gender !== selectedGender && service.gender !== 'unisex') {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && service.category !== selectedCategory) {
        return false;
      }
      // Search query filter
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

  const isItemInCart = (id: string) => cart.some(item => item.id === id);

  return (
    <section id="services" className="py-16 lg:py-24 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>{SALON_INFO.branch} Branch Menu</span>
              <span className="text-neutral-600">·</span>
              <span>Turkayamjal X Road</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
              Salon Services & Official Price List
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Complete official rate list for Men, Women & Kids. <strong className="text-amber-400">Flat 10% OFF</strong> applied on every service!
            </p>
          </div>

          {/* Quick Review / Cart Action */}
          {cart.length > 0 && (
            <button
              onClick={onOpenCart}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
            >
              <span>{cart.length} service(s) selected</span>
              <span className="text-neutral-500">·</span>
              <span className="font-mono text-amber-400">View Estimated Bill</span>
            </button>
          )}
        </div>

        {/* Membership & Special Offer Highlight Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Flat 10% Off Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Special Offer</div>
                <div className="text-base font-bold text-neutral-100">FLAT 10% OFF ON ALL SERVICES</div>
              </div>
            </div>
            <span className="text-xs text-neutral-400 font-medium hidden sm:inline">Active in Bill</span>
          </div>

          {/* Hair Adda Membership 499 Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">HA Membership ₹499/-</div>
                <div className="text-xs text-neutral-200">15% OFF overall bill · 1 Year · All Branches</div>
              </div>
            </div>
            {hasMembership ? (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-md">
                Active Member
              </span>
            ) : (
              <button
                onClick={activateMembership}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Join ₹499
              </button>
            )}
          </div>
        </div>

        {/* Primary Gender Switcher (Men's Menu vs Girl's Menu) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          
          <div className="inline-flex p-1 bg-neutral-900 rounded-xl border border-neutral-800 self-start">
            <button
              onClick={() => handleGenderChange('men')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                selectedGender === 'men'
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>👨 Men's Menu</span>
              <span className="text-[11px] opacity-75 font-normal">
                ({SALON_SERVICES.filter(s => s.gender === 'men').length})
              </span>
            </button>

            <button
              onClick={() => handleGenderChange('women')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                selectedGender === 'women'
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>👩 Girl / Women's Menu</span>
              <span className="text-[11px] opacity-75 font-normal">
                ({SALON_SERVICES.filter(s => s.gender === 'women').length})
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${selectedGender === 'men' ? 'men' : 'girl'} services...`}
              className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* Subcategories Filter Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900/90 rounded-xl border border-neutral-800 overflow-x-auto no-scrollbar">
          {currentCategories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-800 text-amber-400 shadow-sm border border-neutral-700/60 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Services Count Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <div>
            Showing <strong className="text-neutral-200">{filteredServices.length}</strong> items in{' '}
            <span className="text-amber-400 font-medium">
              {selectedGender === 'men' ? "Men's Menu" : "Girl's Menu"} ({selectedCategory})
            </span>
          </div>
          <div className="text-[11px] text-neutral-500">
            For Franchise inquiries: <strong className="text-neutral-300 font-mono">{SALON_INFO.franchiseContact}</strong>
          </div>
        </div>

        {/* Services Cards Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <p className="text-neutral-300 text-sm">No services found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs text-amber-400 underline cursor-pointer"
            >
              Reset filters & search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredServices.map(service => {
              const discountedPrice = Math.round(service.originalPrice * 0.9);
              const inCart = isItemInCart(service.id);

              return (
                <div
                  key={service.id}
                  className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 block mb-0.5">
                          {service.category}
                        </span>
                        <h3 className="font-display font-bold text-base text-neutral-100 group-hover:text-amber-200 transition-colors">
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
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                    {/* Price with Flat 10% Off */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-neutral-500 line-through tabular-nums font-mono">
                          ₹{service.originalPrice}/-
                        </span>
                        <span className="text-emerald-400 text-[10px] font-bold">
                          -10%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-extrabold text-xl text-amber-400 tabular-nums font-mono">
                          ₹{discountedPrice}/-
                        </span>
                      </div>
                      {service.duration && (
                        <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{service.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Selection & Booking */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => inCart ? removeFromCart(service.id) : addToCart(service)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                          inCart
                            ? 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/60'
                        }`}
                        title={inCart ? 'Remove from bill' : 'Add to bill estimator'}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                            <span>Select</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => openBookingForService(service)}
                        className="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                      >
                        Book
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
