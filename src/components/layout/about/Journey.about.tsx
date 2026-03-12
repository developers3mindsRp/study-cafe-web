import React from 'react'

const Journey_about = () => {


    return (

        <>
            <section className="md:py-24 ">

                <div className="container mx-auto px-4">

                    <h2 className="text-center text-[40px] font-semibold mb-16">
                        Our Journey
                    </h2>

                    <div className="relative bg-[url('/images/jouney-bg.svg')] bg-cover bg-center bg-no-repeat md:h-[1100px]  ">

                        {/* SVG Dotted Path */}
                        <svg
                            className="absolute top-0 left-0 w-full h-full hidden md:block"
                            viewBox="0 0 1200 1000"
                            fill="none"
                        >
                            <path
                                d="
                                        M220 260
                                        C360 160 430 200 600 180
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
                        <div className="relative md:absolute md:top-[120px] md:left-[8%] xl:left-[10%] 2xl:left-[12%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto">

                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-10 rounded-lg'>
                                <h4 className="font-bold">2011</h4>
                                <h5 className="font-bold text-[18px]">Website Started</h5>
                                <p className="text-[14px] text-gray-500 mt-4 mb-6">
                                    Studycafe Website Started in 2011
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="relative md:absolute md:top-[120px] md:left-[42%] xl:left-[45%] 2xl:left-[42%] w-[230px] bg-white rounded-lg shadow-lg p-4">

                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-6 rounded-lg'>
                                <h4 className="font-bold">2018</h4>
                                <h5 className="font-bold text-[18px]">App Launched</h5>
                                <p className="text-[14px] text-gray-500 mt-4 mb-6">
                                    Launched StudyCafe Mobile App on Android Platform
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative md:absolute md:top-[160px] md:right-[8%] xl:right-[5%] 2xl:right-[12%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto">

                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-6 rounded-lg'>
                                <h4 className="font-bold">2018</h4>
                                <h5 className="font-bold text-[18px]">E-Commerce Launched</h5>
                                <p className="text-[14px] text-gray-500 mt-4">
                                    Launched Studycafe E-Commerce Portal in 2018 to Sell Books and Lectures online
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="relative md:absolute md:top-[490px] md:left-[8%] xl:left-[0%] 2xl:left-[6%] w-[230px] bg-white rounded-lg shadow-lg p-4">

                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-4 rounded-lg'>      <h4 className="font-bold">2021</h4>
                                <h5 className="font-bold text-[18px] ">Membership Programmes</h5>
                                <p className="text-[14px] text-gray-500 mt-4">
                                    For a Better use Experience, we launched a membership Program for Studycafe Members
                                </p></div>
                        </div>

                        {/* Card 5 */}
                        <div className="relative md:absolute md:top-[450px] md:left-[40%] xl:left-[38%] 2xl:left-[40%] w-[230px] bg-white rounded-lg shadow-lg p-4 mx-auto">

                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-4 rounded-lg'>
                                <h4 className="font-bold">2020</h4>
                                <h5 className="font-bold text-[18px]">Company Incorporated</h5>
                                <p className="text-[14px] text-gray-500 mt-4 mb-6">
                                    Studycafe Private Limited Company Incorporated in July 2020.
                                </p>
                            </div>
                        </div>

                        {/* Card 6 */}
                        <div className="relative md:absolute md:top-[520px] md:right-[18%] xl:right-[10%] 2xl:right-[18%] w-[230px] bg-white rounded-lg shadow-lg p-4">

                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4 py-4 rounded-lg'>
                                <h4 className="font-bold">2020</h4>
                                <h5 className="font-bold text-[18px]">Online Courses</h5>
                                <p className="text-[14px] text-gray-500 mt-4 ">
                                    We started providing online courses on GST, Income Tax, Excel, Tally, Share Market, SAP and on Communication Topics from Apr
                                </p>
                            </div>
                        </div>

                        {/* Card 7 */}
                        <div className="relative md:absolute md:bottom-[58px] left-[35%]  -translate-x-1/2 xl:bottom-[62px] w-[240px] bg-white rounded-lg shadow-lg p-4 mx-auto">

                            <img src="/images/pin.svg" className="absolute -top-5 left-1/2 -translate-x-1/2 w-8" />
                            <div className='bg-[#DDE4FF] px-4  py-6'>
                                <h4 className="font-bold">2024</h4>
                                <h5 className="font-bold text-[18px] ">Lifetime Membership Programmes</h5>
                                <p className="text-[14px] text-gray-500 mt-4">
                                    In the request of the members, we have launched a lifetime membership program for the Members
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
