import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { SALON_INFO } from '../data/salonData';
import { X, Calendar, Clock, User, Phone, CheckCircle, MessageSquare, Sparkles } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    cart,
    selectedServiceForBooking,
    finalTotal,
    baseTotal,
    flatDiscount,
    earnCoins,
    clearCart,
  } = useSalon();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('11:00 AM');
  const [stylist, setStylist] = useState('Any Available Expert');
  const [notes, setNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!isBookingModalOpen) return null;

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setBookingConfirmed(false);
  };

  const servicesToBook = cart.length > 0
    ? cart
    : selectedServiceForBooking
    ? [selectedServiceForBooking]
    : [];

  const handleConfirmAndWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    // Simulate saving appointment
    setBookingConfirmed(true);
    earnCoins(25, 'Appointment Booking Reward (+25 Coins)');

    // Build WhatsApp message
    const serviceNames = servicesToBook.map(s => s.name).join(', ') || 'Custom Salon Visit';
    const message = `Hello Hair Adda Unisex Salon!\nI want to book an appointment.\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📅 Date: ${date}\n⏰ Time: ${time}\n✂️ Stylist: ${stylist}\n💇 Services: ${serviceNames}\n💰 Estimated Amount: ₹${finalTotal || Math.round(baseTotal * 0.9)}\n${notes ? `📝 Note: ${notes}\n` : ''}\nThank you!`;

    const whatsappUrl = `${SALON_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingConfirmed ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-2xl text-neutral-100">
                Appointment Requested!
              </h3>
              <p className="text-xs text-neutral-400">
                A confirmation has been sent to Hair Adda on WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Client:</span>
                <span className="font-semibold text-neutral-200">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Date & Slot:</span>
                <span className="font-semibold text-neutral-200">{date} · {time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Stylist:</span>
                <span className="font-semibold text-neutral-200">{stylist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Branch:</span>
                <span className="font-semibold text-neutral-200">Turkayamjal X Road</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-amber-400">
                <span>Payable at Salon:</span>
                <span className="font-mono tabular-nums">₹{finalTotal || Math.round(baseTotal * 0.9)}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              🎉 <strong>+25 Demo Loyalty Coins</strong> added to your wallet for booking!
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  clearCart();
                  handleClose();
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmAndWhatsApp} className="space-y-5">
            <div>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                Hair Adda Appointments
              </div>
              <h3 className="font-display font-bold text-2xl text-neutral-100 mt-1">
                Book Your Salon Visit
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Turkayamjal X Road · Closes 10:00 PM · Direct WhatsApp Confirmation
              </p>
            </div>

            {/* Selected Services Summary */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs text-neutral-400">
                <span>Services ({servicesToBook.length})</span>
                <span className="text-amber-400 font-bold font-mono">
                  Total: ₹{finalTotal || (servicesToBook[0] ? Math.round(servicesToBook[0].originalPrice * 0.9) : 0)}
                </span>
              </div>
              <div className="text-xs text-neutral-200 font-medium">
                {servicesToBook.length > 0
                  ? servicesToBook.map(s => s.name).join(', ')
                  : 'Select your preferred services below'}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="8:30 PM">8:30 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Stylist Preference
                </label>
                <select
                  value={stylist}
                  onChange={(e) => setStylist(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Any Available Expert">Any Available Expert Stylist</option>
                  <option value="Senior Hair Stylist">Senior Hair Stylist (Creative Cut)</option>
                  <option value="Lady Stylist">Specialist Lady Stylist (Women & Kids)</option>
                  <option value="Master Barber">Master Barber (Beard & Fade)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Special Instructions / Requests
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. skin allergy, urgent styling, bridal guest"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Action Submit Button */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm & Send to Salon WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-neutral-500">
                Salon owner will confirm instantly via WhatsApp · Pay in cash or UPI after service.
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
