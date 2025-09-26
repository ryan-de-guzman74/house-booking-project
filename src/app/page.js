"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: result.message });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: result.error });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-gray-900">Send us a Message</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:bg-gray-50"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:bg-gray-50"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-vertical bg-white/50 backdrop-blur-sm hover:bg-white/80"
            placeholder="Tell us how we can help you..."
          />
        </div>

        {submitStatus && (
          <div className={`p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 px-8 rounded-2xl font-bold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Message
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);

      // Check for elements in viewport
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
          element.classList.add('visible');
          setVisibleElements(prev => new Set([...prev, index]));
        }
      });
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const properties = [
    {
      id: "29-shoreditch-heights",
      name: "2B N1 A - 29 Shoreditch Heights",
      address: "29 Shoreditch Heights, London E1 6JQ",
      price: "£120/night",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      description: "Beautiful 2-bedroom apartment in the heart of Shoreditch. Perfect for business travelers and tourists exploring East London."
    },
    {
      id: "15-camden-square",
      name: "1B N2 B - 15 Camden Square",
      address: "15 Camden Square, London NW1 7JX",
      price: "£95/night",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      description: "Cozy 1-bedroom apartment in Camden. Great for couples looking to explore London's vibrant music scene."
    },
    {
      id: "42-kings-cross",
      name: "Studio N3 C - 42 King's Cross",
      address: "42 King's Cross, London N1C 4AG",
      price: "£85/night",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      description: "Modern studio apartment near King's Cross station. Ideal for solo travelers and short stays."
    },
    {
      id: "88-notting-hill",
      name: "3B N4 D - 88 Notting Hill",
      address: "88 Notting Hill, London W11 3QA",
      price: "£180/night",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      description: "Spacious 3-bedroom house in Notting Hill. Perfect for families or groups visiting London."
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      {/* Modern Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/80 shadow-2xl py-5' 
          : 'bg-transparent py-10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isScrolled ? 'bg-blue-600 shadow-lg' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <button 
                onClick={scrollToTop}
                className={`font-bold tracking-tight transition-all duration-500 hover:scale-105 ${
                  isScrolled 
                    ? 'text-white text-3xl' 
                    : 'text-white text-4xl drop-shadow-2xl'
                }`}
              >
                Flex Living
              </button>
            </div>
            <nav className="hidden md:flex space-x-12 ml-auto">
              <Link href="#properties" className={`font-bold transition-all duration-300 hover:scale-105 relative group pb-2 ${
                isScrolled ? 'text-xl text-white hover:text-blue-400' : 'text-2xl text-white drop-shadow-lg hover:text-blue-400'
              }`}>
                Properties
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
              <Link href="#about" className={`font-bold transition-all duration-300 hover:scale-105 relative group pb-2 ${
                isScrolled ? 'text-xl text-white hover:text-blue-400' : 'text-2xl text-white drop-shadow-lg hover:text-blue-400'
              }`}>
                About
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
              <Link href="#contact" className={`font-bold transition-all duration-300 hover:scale-105 relative group pb-2 ${
                isScrolled ? 'text-xl text-white hover:text-blue-400' : 'text-2xl text-white drop-shadow-lg hover:text-blue-400'
              }`}>
                Contact
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3840&q=100"
            alt="Luxury London apartment with modern interior and city skyline view"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8 animate-on-scroll">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 rounded-full border border-white/30 mb-6">
                <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white font-semibold">Premium London Properties</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight animate-on-scroll drop-shadow-2xl">
              <span className="text-white">
                Redefining
              </span>
              <br />
              <span className="text-white">London Living</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 mb-16 leading-relaxed animate-on-scroll drop-shadow-lg max-w-4xl mx-auto">
              Experience the pinnacle of luxury short-term rentals in London&apos;s most prestigious neighborhoods. 
              Our carefully curated properties combine exceptional design, prime locations, and unmatched service 
              to create unforgettable stays for discerning guests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-on-scroll">
              <Link 
                href="#properties"
                className="group bg-blue-600 text-white px-12 py-5 text-lg font-bold hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-2xl border border-white/20"
              >
                <span className="flex items-center justify-center">
                  Explore Properties
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link 
                href="#about"
                className="group bg-white/20 border-2 border-white/40 text-white px-12 py-5 text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-2xl"
              >
                <span className="flex items-center justify-center">
                  Learn More
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Properties Section */}
      <section id="properties" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 rounded-full border border-blue-200 mb-8">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-blue-800 font-semibold">Premium Collection</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 animate-on-scroll">
              Our Properties
            </h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto animate-on-scroll leading-relaxed">
              Handpicked accommodations for every need, carefully selected in London&apos;s most desirable neighborhoods. 
              Each property is meticulously curated to provide an exceptional living experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map((property, index) => (
              <div 
                key={property.id} 
                className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col group animate-on-scroll border border-gray-100 hover:border-blue-200"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold text-gray-900">{property.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{property.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.address}
                  </p>
                  <p className="text-gray-700 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">{property.description}</p>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-3xl font-bold text-blue-600">
                      {property.price}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/property/${property.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn w-full bg-blue-600 text-white text-center py-4 px-6 font-bold hover:bg-blue-700 transition-all duration-300 mt-auto rounded-2xl hover:scale-105 hover:shadow-xl flex items-center justify-center"
                  >
                    <span>View Details & Reviews</span>
                    <svg className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern About Section */}
      <section id="about" className="py-32 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 rounded-full border border-white/30 mb-8">
              <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-white font-semibold">Our Values</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold text-white mb-8 animate-on-scroll">
              <span className="text-white">
                Flex Living
              </span>
              <br />
              <span className="text-white">Values</span>
            </h3>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto animate-on-scroll leading-relaxed">
              Performance, partnership, integrity, and trust. These core values are crucial to our philosophy, 
              service approach, and culture. They guide every decision we make and every interaction we have.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                title: "Premium Properties",
                description: "Carefully selected accommodations in London's best neighborhoods, ensuring every stay exceeds expectations."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Verified Reviews",
                description: "Real guest experiences to help you make the perfect choice, with transparent and honest feedback."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Perfect Locations",
                description: "Prime locations with easy access to London's top attractions, business districts, and cultural landmarks."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="text-center animate-on-scroll group"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border border-gray-100">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {value.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Contact Section */}
      <section id="contact" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 rounded-full border border-blue-200 mb-8">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-blue-800 font-semibold">Contact Us</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 animate-on-scroll">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto animate-on-scroll leading-relaxed">
              Have questions about our properties or need assistance with your booking? 
              We&apos;re here to help you find the perfect London accommodation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="animate-on-scroll">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">hello@flexliving.co.uk</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+44 20 7123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600">123 London Street<br />London, EC1A 4HD<br />United Kingdom</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-white">Flex Living</h4>
              </div>
              <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
                Your gateway to London&apos;s finest short-term rentals. We believe in creating real value for our guests 
                and supporting the communities we work in.
              </p>
            </div>
            
            <div>
              <h5 className="text-xl font-bold mb-6 text-white">Properties</h5>
              <ul className="space-y-3">
                <li><Link href="/property/29-shoreditch-heights" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Shoreditch Heights</Link></li>
                <li><Link href="/property/15-camden-square" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Camden Square</Link></li>
                <li><Link href="/property/42-kings-cross" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">King&apos;s Cross</Link></li>
                <li><Link href="/property/88-notting-hill" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Notting Hill</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-xl font-bold mb-6 text-white">Company</h5>
              <ul className="space-y-3">
                <li><Link href="#about" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">&copy; 2024 Flex Living. All rights reserved.</p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">Authorised and regulated by the Financial Conduct Authority</p>
            </div>
            
            {/* Developer Credit */}
            <div className="mt-8 pt-8 border-t border-gray-700/50">
      <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Website built by{' '}
                  <a 
                    href="mailto:ryanlink74@outlook.com?subject=Website Inquiry" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline font-medium"
                  >
                    ryanlink74@outlook.com
                  </a>
                </p>
              </div>
            </div>
          </div>
      </div>
      </footer>

      {/* Floating Developer Button */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <button
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => window.open('mailto:ryanlink74@outlook.com?subject=Website Inquiry', '_blank')}
          className={`group transition-all duration-500 ease-in-out overflow-hidden ${
            isHovering 
              ? 'w-80 h-16 rounded-full' 
              : 'w-20 h-20 rounded-full'
          } bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-2xl transform hover:scale-105`}
        >
          <div className="flex items-center justify-center h-full px-6 relative">
            {/* Icon - always visible */}
            <div className={`flex-shrink-0 transition-all duration-500 ease-in-out ${
              isHovering ? 'mr-4' : 'mr-0'
            }`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
                {/* Text - appears with delay */}
                <div className={`transition-all duration-500 ease-in-out ${
                  isHovering 
                    ? 'opacity-100 translate-x-0 w-auto' 
                    : 'opacity-0 -translate-x-4 w-0'
                }`}>
                  <span className="text-white font-medium text-sm whitespace-nowrap">
                    Built by ryanlink74@outlook.com
                  </span>
                </div>
          </div>
        </button>
      </div>
    </div>
  );
}