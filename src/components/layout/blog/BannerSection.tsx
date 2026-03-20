import React from 'react'

interface BannerSectionProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
}

const BannerSection_blog = ({ searchValue = '', onSearchChange, onSearchSubmit }: BannerSectionProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit?.();
    }
  };

  return (
    <section className='bg-[url("/images/blog_bg.svg")] bg-no-repeat bg-cover bg-center '>

      <div className='container mx-auto pt-4 xl:pt-20 pb-12 xl:pb-32 w-[100%] xl:h-[580px] px-4'>

        <div className="flex items-center justify-center mb-4 mt-4 md:mt-6">
          <p className="text-[16px] bg-white p-3 rounded-[10px] font-medium">
            The Leader in Online Learning
          </p>
        </div>


        <div className='text-center'>
          <h1 className='text-[32px] md:text-[40px] xl:text-[62px] font-bold text-[#09339B] mb-4'>Explore Our Blogs</h1>
          <h3 className='text-[#252525] text-[16px] md:text-[20px] xl:text-[26px] px-4'>Stay updated with the latest insights, tips, and industry trends from our experts</h3>

          <div className="mt-6 md:mt-10 w-full max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white border border-gray-300 rounded-[10px] py-4 pl-4 pr-10 text-gray-800 placeholder-[#49454F] focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                onClick={() => onSearchSubmit?.()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {/* magnifying glass icon (SVG) */}
                <img src="/images/search-icon.svg" alt="" width="24" height="24" className='w-12 h-12 mr-2' />

              </button>
            </div>
          </div>

        </div>


      </div>


    </section>
  )
}

export default BannerSection_blog
