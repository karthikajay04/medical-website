import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="relative z-10 w-full px-6 pb-32 pt-16 md:pt-24 max-w-7xl mx-auto flex-1">
      
      {/* Header Section */}
      <div className="text-center mb-16 opacity-0 animate-fade-rise">
        <h2 className="font-instrument text-5xl md:text-7xl mb-6 tracking-tight">
          Get in <i className="text-[#C8A96B]">Touch</i>
        </h2>
        <p className="font-inter text-[#6F6F6F] max-w-2xl mx-auto text-lg leading-relaxed">
          We're here to answer any questions you have about our services, facilities, or visiting specialists. Reach out to us and we'll respond as soon as we can.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 opacity-0 animate-fade-rise-delay">
        
        {/* Contact Information (Left Col) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 ease-out group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5f7fa] to-[#e6ecf5] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h3 className="font-instrument text-3xl mb-8 group-hover:text-[#C8A96B] transition-colors duration-300">
                Contact Details
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors duration-300">
                    <Phone className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="font-inter font-medium text-black text-sm mb-1">Phone</p>
                    <p className="font-inter text-[#6F6F6F] hover:text-black transition-colors cursor-pointer">+1 (555) 123-4567</p>
                    <p className="font-inter text-[#6F6F6F] hover:text-black transition-colors cursor-pointer">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors duration-300">
                    <Mail className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="font-inter font-medium text-black text-sm mb-1">Email</p>
                    <p className="font-inter text-[#6F6F6F] hover:text-black transition-colors cursor-pointer">hello@aetheraclinic.com</p>
                    <p className="font-inter text-[#6F6F6F] hover:text-black transition-colors cursor-pointer">support@aetheraclinic.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="font-inter font-medium text-black text-sm mb-1">Location</p>
                    <p className="font-inter text-[#6F6F6F] leading-relaxed">
                      123 Healing Way, Medical District<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors duration-300">
                    <Clock className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="font-inter font-medium text-black text-sm mb-1">Clinic Hours</p>
                    <p className="font-inter text-[#6F6F6F]">Mon-Sat: 9:00 AM - 8:00 PM</p>
                    <p className="font-inter text-[#6F6F6F]">Sunday: Emergency Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Col) */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-3xl h-full shadow-lg shadow-gray-100/50">
            <h3 className="font-instrument text-3xl mb-2">Send us a Message</h3>
            <p className="font-inter text-[#6F6F6F] text-sm mb-8">Fill out the form below and our team will get back to you shortly.</p>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="font-inter text-sm font-medium text-black">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-inter text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C8A96B]/50 focus:border-[#C8A96B] transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="font-inter text-sm font-medium text-black">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-inter text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C8A96B]/50 focus:border-[#C8A96B] transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="font-inter text-sm font-medium text-black">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-inter text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C8A96B]/50 focus:border-[#C8A96B] transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="font-inter text-sm font-medium text-black">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-inter text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C8A96B]/50 focus:border-[#C8A96B] transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="font-inter text-sm font-medium text-black">Subject</label>
                <select 
                  id="subject"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-inter text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C8A96B]/50 focus:border-[#C8A96B] transition-all appearance-none"
                >
                  <option value="">Select a subject...</option>
                  <option value="appointment">Book an Appointment</option>
                  <option value="inquiry">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="font-inter text-sm font-medium text-black">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-inter text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C8A96B]/50 focus:border-[#C8A96B] transition-all resize-none"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-black text-white rounded-xl px-8 py-4 text-sm font-inter font-medium hover:bg-[#C8A96B] transition-colors duration-300 flex items-center justify-center gap-2 group">
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
