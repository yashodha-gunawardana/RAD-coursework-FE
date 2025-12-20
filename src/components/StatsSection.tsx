import React from "react";


const StatsSection: React.FC = () => {

    return (
        <div className="relative py-16 px-4 md:px-8 bg-[#0F0F0F]/80 overflow-hidden font-[Poppins, serif] min-h-[250px]">

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

            
        </div>
    )
}

export default StatsSection