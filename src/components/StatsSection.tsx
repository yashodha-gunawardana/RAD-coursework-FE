import React from "react";


const StatsSection: React.FC = () => {

    return (
        <div className="relative py-10 px-4 md:px-8 bg-[#0F0F0F]/80 overflow-hidden font-[Poppins, serif] min-h-[200px]">

            {/* background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(195,153,83,0.1)_0%,transparent_50%]"></div>

                <div className="bokeh-orb absolute w-[300px] h-[300px] rounded-full blur-[60px] opacity-20
                                bg-[#950740] top-[15%] left-[10%]"
                                
                                aria-hidden="true">

                </div>

                <div className="bokeh-orb absolute w-[250px] h-[250px] rounded-full blur-[60px] opacity-25 
                                bg-[#C39953] bottom-[15%] right-[15%]"
                                
                                aria-hidden="true">

                </div>

                <div className="bokeh-orb absolute w-[180px] h-[180px] rounded-full blur-[50px] opacity-15 
                                bg-[#950740] top-[60%] left-[70%]"
            
                                aria-hidden="true">
                    
                </div>

                <div  className="bokeh-orb absolute w-[150px] h-[150px] rounded-full blur-[40px] opacity-20 
                                bg-[#C39953] top-[20%] right-[25%]"
          
                                aria-hidden="true">

                </div>
        
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/30 via-transparent to-[#050505]/30"></div>
            </div>

            {/* main container */}
            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

                    {/* card 1 */}
                    <div className="group h-[140px] md:h-[160px] flex flex-col justify-center items-center text-center relative
                                    bg-white/3 backdrop-blur-[15px] border border-[#C39953]/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] 
                                    transition-all duration-500 ease-out hover:border-[#C39953] hover:bg-white/6 hover:transform 
                                    hover:-translate-y-[8px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.9)] rounded-xl">

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#950740]/0 via-[#950740]/5 to-[#C39953]/0 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        
                        </div>

                        <div className="number-group flex items-start mb-2 relative z-10">
                            <span className="number text-[2.5rem] md:text-[3rem] font-[800] leading-[1] text-[#950740]
                                                text-shadow-[0_0_20px_rgba(149,7,64,0.3)]">

                                    172
                            </span>

                            <span className="symbol text-[0.9rem] text-[#E3E2DF] ml-1.5 mt-3">
                                    n
                            </span>

                        </div>

                        <p className="label text-[0.85rem] text-[#E3E2DF] uppercase tracking-[0.25em] font-[400] relative z-10">
                            Event Done
                        </p>
                    </div>
                
                    
                    {/* card 2 */}
                    <div className="group h-[140px] md:h-[160px] flex flex-col justify-center items-center text-center relative
                                    bg-white/3 backdrop-blur-[15px] border border-[#C39953]/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]
                                    transition-all duration-500 ease-out hover:border-[#C39953] hover:bg-white/6 hover:transform 
                                    hover:-translate-y-[8px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.9)] rounded-xl">

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#950740]/0 via-[#950740]/5 to-[#C39953]/0 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500">

                        </div>
            
                        <div className="number-group flex items-start mb-2 relative z-10">
                            <span className="number text-[2.5rem] md:text-[3rem] font-[800] leading-[1] text-[#950740] 
                                                text-shadow-[0_0_20px_rgba(149,7,64,0.3)]">
                
                                15
                    
                            </span>
              
                            <span className="symbol text-[0.9rem] text-[#E3E2DF] ml-1.5 mt-3">
                                TM
                            </span>

                        </div>
                        
                        <p className="label text-[0.85rem] text-[#E3E2DF] uppercase tracking-[0.25em] font-[400] relative z-10">
                            Years of Experience
                        </p>
                    </div>


                    {/* card 3 */}
                    <div className="group h-[140px] md:h-[160px] flex flex-col justify-center items-center text-center relative
                                    bg-white/3 backdrop-blur-[15px] border border-[#C39953]/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]
                                    transition-all duration-500 ease-out hover:border-[#C39953] hover:bg-white/6 hover:transform 
                                    hover:-translate-y-[8px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.9)] rounded-xl">

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#950740]/0 via-[#950740]/5 to-[#C39953]/0 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        
                        </div>
            
                        <div className="number-group flex items-start mb-2 relative z-10">
                            <span className="number text-[2.5rem] md:text-[3rem] font-[800] leading-[1] text-[#950740] 
                                                text-shadow-[0_0_20px_rgba(149,7,64,0.3)]">
                
                                250

                            </span>
              
                            <span className="symbol text-[0.9rem] text-[#E3E2DF] ml-1.5 mt-3">
                                n
                            </span>

                        </div>

                        <p className="label text-[0.85rem] text-[#E3E2DF] uppercase tracking-[0.25em] font-[400] relative z-10">
                            Happy Client
                        </p>
                    </div>


                    {/* card 4 */}
                    <div className="group h-[140px] md:h-[160px] flex flex-col justify-center items-center text-center relative
                                    bg-white/3 backdrop-blur-[15px] border border-[#C39953]/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]
                                    transition-all duration-500 ease-out hover:border-[#C39953] hover:bg-white/6 hover:transform 
                                    hover:-translate-y-[8px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.9)] rounded-xl">

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#950740]/0 via-[#950740]/5 to-[#C39953]/0 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500">

                        </div>
            
                        <div className="number-group flex items-start mb-2 relative z-10">
                            <span className="number text-[2.5rem] md:text-[3rem] font-[800] leading-[1] text-[#950740] 
                                                text-shadow-[0_0_20px_rgba(149,7,64,0.3)]">
                
                                80
              
                            </span>

                            <span className="symbol text-[0.9rem] text-[#E3E2DF] ml-1.5 mt-3">
                                n
                            </span>

                        </div>

                        <p className="label text-[0.85rem] text-[#E3E2DF] uppercase tracking-[0.25em] font-[400] relative z-10">
                            Trusted Vendor
                        </p>
                    </div>
                </div>

                {/* line */}
                <div className="mt-12 relative">

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C39953]/30 to-transparent"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border border-[#C39953]/50"></div>

                </div>
            </div>
        </div>
    )
}

export default StatsSection