import React from 'react'

const Journey_about = () => {


    return (

        <>
            <section className="py-24">

                <div className="container mx-auto px-4">

                    <h2 className="text-center text-[40px] font-semibold mb-16">
                        Our Journey
                    </h2>

                    <div className="relative bg-[url('/images/jouney-bg.svg')] bg-cover bg-center bg-no-repeat h-[1100px] ">

                        {/* SVG Dotted Path */}
                        <svg
                            className="absolute top-0 left-0 w-full h-full hidden md:block"
                            viewBox="0 0 1200 1000"
                            fill="none"
                        >
                            <path
                                d="
                                        M220 180
                                        C360 120 480 200 600 180
                                        S820 140 940 220

                                        S980 480 880 600
                                        S720 300 580 510

                                        S420 520 115 550
                                        S260 790 340 800

                                       
                                        "
                                stroke="#9CA3AF"
                                strokeWidth="2"
                                strokeDasharray="6 6"
                                fill="none"
                            />
                        </svg>



                        {/* Card 1 */}
                        <div className="relative md:absolute md:top-[120px] md:left-[140px] w-[200px] bg-white rounded-lg shadow-lg p-4">
                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-16'>
                                <h4 className="font-semibold">2011</h4>
                                <h5 className="font-semibold text-sm">Website Started</h5>
                                <p className="text-xs text-gray-500">
                                    Studycafe Website Started in 2011
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="relative md:absolute md:top-[120px] md:left-[600px] w-[200px] bg-white rounded-lg shadow-lg p-4">
                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-14'>
                                <h4 className="font-semibold">2018</h4>
                                <h5 className="font-semibold text-sm">App Launched</h5>
                                <p className="text-xs text-gray-500">
                                    Launched StudyCafe Mobile App on Android Platform
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative md:absolute md:top-[160px] md:right-[180px] w-[200px] bg-white rounded-lg shadow-lg p-4">
                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-12'>
                                <h4 className="font-semibold">2018</h4>
                                <h5 className="font-semibold text-sm">E-Commerce Launched</h5>
                                <p className="text-xs text-gray-500">
                                    Launched Studycafe E-Commerce Portal in 2018
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="relative md:absolute md:top-[490px] md:left-[100px] w-[200px] bg-white rounded-lg shadow-lg p-4">
                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-16'>      <h4 className="font-semibold">2021</h4>
                                <h5 className="font-semibold text-sm">Membership Programmes</h5>
                                <p className="text-xs text-gray-500">
                                    We launched membership programs.
                                </p></div>
                        </div>

                        {/* Card 5 */}
                        <div className="relative md:absolute md:top-[450px] md:left-[580px] w-[200px] bg-white rounded-lg shadow-lg p-4">
                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-12'>
                                <h4 className="font-semibold">2020</h4>
                                <h5 className="font-semibold text-sm">Company Incorporated</h5>
                                <p className="text-xs text-gray-500">
                                    Studycafe Private Limited incorporated July 2020.
                                </p>
                            </div>
                        </div>

                        {/* Card 6 */}
                        <div className="relative md:absolute md:top-[520px] md:right-[320px] w-[200px] bg-white rounded-lg shadow-lg p-4">
                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-16'>
                                <h4 className="font-semibold">2020</h4>
                                <h5 className="font-semibold text-sm">Online Courses</h5>
                                <p className="text-xs text-gray-500">
                                    Started online courses on GST & Income Tax.
                                </p>
                            </div>
                        </div>

                        {/* Card 7 */}
                        <div className="relative md:absolute md:left-[450px] md:bottom-[58px] left-1/2 -translate-x-1/2 w-[220px] bg-white rounded-lg shadow-lg p-4">
                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-16'>
                                <h4 className="font-semibold">2024</h4>
                                <h5 className="font-semibold text-sm">Lifetime Membership</h5>
                                <p className="text-xs text-gray-500">
                                    We launched lifetime membership program.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

            </section>








        </>
    )
}

export default Journey_about;
