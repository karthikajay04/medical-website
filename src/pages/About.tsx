import { Users, Heart, Shield, ArrowRight } from 'lucide-react';
import { TestimonialCarousel } from '@/components/ui/profile-card-testimonial-carousel';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

export default function About() {
  return (
    <div className="relative z-10 w-full px-6 pb-32 pt-16 md:pt-24 max-w-7xl mx-auto flex-1">

      {/* Header Section */}
      <div className="text-center mb-20 opacity-0 animate-fade-rise">
        <h2 className="font-instrument text-5xl md:text-7xl mb-6 tracking-tight">
          About <i className="text-[#C8A96B]">Aethera</i>
        </h2>
        <p className="font-inter text-[#6F6F6F] max-w-2xl mx-auto text-lg leading-relaxed">
          Providing compassionate, state-of-the-art medical care to our local community. We believe in healthcare that is accessible, personal, and profoundly effective.
        </p>
      </div>

      {/* Main Content & Image Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 opacity-0 animate-fade-rise-delay">
        <div className="space-y-8">
          <h3 className="font-instrument text-4xl leading-tight">
            Our commitment to your <br className="hidden md:block" />
            <span className="text-[#C8A96B]">health and well-being</span>
          </h3>
          <div className="space-y-6 font-inter text-[#6F6F6F] leading-relaxed">
            <p>
              Founded with a vision to redefine community healthcare, Aethera Clinic brings together a team of dedicated professionals and modern medical technology. Our goal is to ensure every patient receives the highest standard of care in a comfortable, welcoming environment.
            </p>
            <p>
              Whether it's a routine check-up, an unexpected illness, or managing a chronic condition, we are here for you every step of the way. We prioritize clear communication, empathy, and evidence-based treatments.
            </p>
          </div>
        </div>
        <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-gray-100 rounded-3xl overflow-hidden group">
          <img
            src="/vd/clinic.png"
            alt="Aethera Clinic"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
        </div>
      </div>

      {/* Doctor Profile Section */}
      <div className="mb-32 opacity-0 animate-fade-rise-delay-2">
        <div className="text-center mb-16">
          <h2 className="font-instrument text-4xl md:text-5xl mb-4">
            Meet our <i className="text-[#C8A96B]">Founder</i>
          </h2>
          <p className="font-inter text-[#6F6F6F] max-w-2xl mx-auto">
            The visionary leadership behind our commitment to excellence.
          </p>
        </div>
        <TestimonialCarousel />
      </div>

      {/* Community Testimonials Section */}
      <div className="mb-32 opacity-0 animate-fade-rise-delay-2">
        <AnimatedTestimonials
          title="What our community says"
          subtitle="We take pride in the lives we touch. Here's what our patients and partners have to say about their experience at Aethera."
          badgeText="Patient Testimonials"
          testimonials={[
            {
              id: 1,
              name: "Sarah Jenkins",
              role: "Local Resident",
              company: "Patient",
              content: "The level of care at Aethera is unmatched. Dr. Chen took the time to listen to my concerns and provided a treatment plan that actually worked. I feel like more than just a number here.",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
            },
            {
              id: 2,
              name: "David Thompson",
              role: "Teacher",
              company: "Patient",
              content: "I've been to many clinics, but the efficiency and warmth of the staff at Aethera are exceptional. From the front desk to the lab techs, everyone is professional and kind.",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            },
            {
              id: 3,
              name: "Elena Rodriguez",
              role: "Healthcare Consultant",
              company: "Community Partner",
              content: "Aethera Clinic is a model for community healthcare. Their commitment to state-of-the-art technology combined with a personal touch is exactly what our neighborhood needed.",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
            },
          ]}
          trustedCompanies={["Local Health Board", "Community Care", "Wellness Trust"]}
          trustedCompaniesTitle="Proudly partnered with community health organizations"
        />
      </div>

      {/* Community CTA Section (WhatsApp) */}
      <div className="bg-[#f0f9f4] border border-[#d1f0df] rounded-3xl p-10 md:p-16 relative overflow-hidden group opacity-0 animate-fade-rise-delay-2">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-64 h-64 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="font-instrument text-3xl md:text-4xl text-[#0d5939] mb-4">
              Join our Health Community
            </h3>
            <p className="font-inter text-[#247b53] text-lg">
              Stay updated with clinic news, health tips, and direct announcements from our specialists by joining our official WhatsApp group.
            </p>
          </div>

          <a
            href="#"
            className="flex items-center gap-3 bg-[#25D366] text-white hover:bg-[#20b858] rounded-full px-8 py-4 text-base font-inter font-medium shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:-translate-y-1 transition-all duration-300 shrink-0"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Join WhatsApp Group
            <ArrowRight className="w-5 h-5 ml-1" />
          </a>
        </div>
      </div>

    </div>
  );
}
