import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const HeroSection_courses = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync input with URL — runs on every ?q change (including clear)
  useEffect(() => {
    if (!router.isReady) return
    setSearch(typeof router.query.q === 'string' ? router.query.q : '')
  }, [router.isReady, router.query.q])

  const pushSearch = (val: string) => {
    // Preserve existing filters (category, sort, price) — only update q + reset page
    const { page: _page, q: _q, ...rest } = router.query as Record<string, string>
    const params: Record<string, string> = { ...rest }
    if (val.trim()) params.q = val.trim()
    router.push({ pathname: '/courses', query: params }, undefined, { shallow: false })
  }

  const handleChange = (val: string) => {
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => pushSearch(val), 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    pushSearch(search)
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  return (
    <section className='bg-[url("/images/course_bg.svg")] bg-no-repeat bg-cover bg-center '>
      <div className='container mx-auto pt-4 md:pt-20 pb-12 md:pb-32 w-[100%] md:h-[580px] px-4'>

        <div className="flex items-center justify-center mb-4 mt-6">
          <p className="text-[12px] md:text-[20px] bg-white p-3 rounded-[6px] font-medium">
            The Leader in Online Learning
          </p>
        </div>

        <div className='text-center'>
          <h1 className='text-[30px] md:text-[62px] font-bold text-[#09339B] mb-4'>Explore Our Courses</h1>
          <h3 className='text-[#252525] text-[16px] md:text-[24px] px-4'>Find the perfect course to advance your skills and career</h3>

          <form onSubmit={handleSubmit} className="mt-4 md:mt-10 w-full max-w-2xl mx-auto">
            <div className="relative px-4">
              <input
                type="text"
                value={search}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search Courses..."
                className="w-full bg-white border text-[16px] border-gray-300 rounded-[10px] py-4 pl-4 pr-16 text-gray-800 placeholder-[#49454F] focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <img src="/images/search-icon.svg" alt="Search" width="24" height="24" className='w-12 h-12 mr-6' />
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  )
}

export default HeroSection_courses
