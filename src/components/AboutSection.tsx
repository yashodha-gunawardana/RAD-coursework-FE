import React from 'react';
import { 
  MessageCircle, 
  ArrowRight, 
  Award, 
  Heart, 
  Star, 
  Globe, 
  Check, 
  Users, 
  Clock, 
  Shield } from 'react-feather';


const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E3D8] text-[#0F0F0F] py-20">

      {/* circle */}
      <div className='absolute -top-[200px] -left-[200px] h-[600px] w-[600px] rounded-full border-[120px]
                            border-[rgba(139,0,0,0.04)] pointer-events-none z-0'
        aria-hidden='true'>
      </div>

      <div className='absolute -bottom-[200px] -right-[200px] h-[700px] w-[700px] rounded-full border-[140px] 
                            border-[rgba(139,0,0,0.03)] pointer-events-none z-0'
        aria-hidden='true'>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">

          {/* Left Column - Main Content */}
          <div className="space-y-10">

            {/* Header Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]" />

                <span className="font-[Poppins] text-sm uppercase tracking-[0.3em] font-semibold text-[#9B2D2D]">
                  The Art of Celebration
                </span>

                <div className="w-16 h-px bg-gradient-to-r from-[#9B2D2D] via-[#D4B483] to-[#9B2D2D]" />
              </div>

              <h1 className="font-[Poppins] text-5xl md:text-7xl leading-[1.1] font-semibold">
                Where <span className="text-[#9B2D2D]">Vision</span> Meets<br />
                <span className="text-[#D4B483]">Perfection</span> in Every<br />
                <span className="text-[#0F0F0F]">Detail</span>
              </h1>

              <p className="text-xl text-[#0F0F0F]/80 leading-relaxed max-w-xl">
                At <span className="font-semibold">Eventora</span>, we transform your dreams into breathtaking realities.
                With 15 years of excellence, we craft events that resonate with elegance,
                emotion, and unforgettable moments.
              </p>
            </div>

            {/* Quote Card */}
            <div className="bg-white border border-[#E8E3D8] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 
                              hover:-translate-y-2 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4B483] to-transparent" />
              <div className="flex items-start gap-6">

                <div className="text-5xl text-[#D4B483] opacity-50">
                  <MessageCircle className="w-12 h-12" />
                </div>

                <div>
                  <p className="text-lg text-[#0F0F0F]/80 italic mb-4">
                    "We don't just plan events; we choreograph memories that last a lifetime.
                    Every detail is a brushstroke in the masterpiece of your celebration."
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-px bg-[#D4B483]/30" />
                    <span className="text-sm font-medium text-[#9B2D2D]">— Isabella Rossi, Creative Director</span>
                  </div>

                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="relative bg-gradient-to-br from-[#9B2D2D] to-[#7A1C1C] text-white px-10 py-4 rounded-[50px] 
                                font-semibold tracking-wide overflow-hidden group transition-all duration-400 hover:-translate-y-1 
                                hover:shadow-xl hover:shadow-[#9B2D2D]/20">

                <span className="flex items-center gap-3">
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>

                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                group-hover:translate-x-full transition-transform duration-600" />

              </button>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">

            {/* Card 1 - Excellence */}
            <div className="bg-white border border-[#E8E3D8] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 
                            hover:-translate-y-2 hover:border-[#D4B483] group relative overflow-hidden">

              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4B483] to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4B483]/20 to-[#E8D0AD]/20 flex items-center justify-center">
                    <Award className="w-8 h-8 text-[#D4B483]" />
                  </div>

                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#0F0F0F] mb-3">Award-Winning Excellence</h3>
                  <p className="text-[#0F0F0F]/70">24 international accolades for exceptional event design and execution, recognized globally for our innovative approach.</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Client-Centric */}
            <div className="bg-white border border-[#E8E3D8] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 
                            hover:-translate-y-2 hover:border-[#9B2D2D] group relative overflow-hidden">

              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9B2D2D] to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B2D2D]/20 to-[#B64545]/20 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-[#9B2D2D]" />
                  </div>

                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#0F0F0F] mb-3">Client-Centric Approach</h3>
                  <p className="text-[#0F0F0F]/70">1,847+ personalized celebrations with a 98.7% satisfaction rate. Your vision is our mission.</p>

                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Card 3 - Global Network */}
            <div className="bg-white border border-[#E8E3D8] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 
                            hover:-translate-y-2 hover:border-[#D4B483] group relative overflow-hidden">

              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4B483] to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4B483]/20 to-[#E8D0AD]/20 flex 
                                  items-center justify-center">
                    <Globe className="w-8 h-8 text-[#D4B483]" />
                  </div>

                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#0F0F0F] mb-3">Global Network</h3>
                  <p className="text-[#0F0F0F]/70">Premier venues in 40+ countries worldwide with local expertise and international standards of excellence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );

};

export default AboutSection;