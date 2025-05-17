"use client"

import { useEffect, useState } from "react"
import SectionTitle from "../../../Component/SectionTitle/SectionTitle"
// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
// Import required modules
import { Pagination, Navigation, Autoplay } from "swiper/modules"

const Testimonial = () => {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/MocData/reviews.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setReviews(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err)
        setIsLoading(false)
      })
  }, [])

  // Function to generate stars based on rating
  const renderStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 inline-block ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      )
    }
    return stars
  }

  return (
    <div className="py-16 bg-gray-50">
      <SectionTitle
        heading={"Client Reviews"}
        subheading={
          "What Our Client Say"
        }
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="testimonial-container">
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              modules={[Pagination, Navigation, Autoplay]}
              className="testimonial-swiper"
            >
              {reviews.map((review) => (
                <SwiperSlide key={review._id}>
                  <div className="bg-white rounded-lg shadow-lg p-8 testimonial-card">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                        {review.name.charAt(0)}
                      </div>
                    </div>

                    <div className="text-center mb-4">{renderStars(review.rating)}</div>

                    <blockquote className="text-gray-600 italic text-center mb-6 testimonial-text">
                      "{review.details}"
                    </blockquote>

                    <h3 className="text-xl font-bold text-center text-gray-800">{review.name}</h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No reviews available at the moment.</div>
        )}
      </div>

      {/* Add custom styles for Swiper */}
      <style jsx>{`
        :global(.testimonial-container) {
          position: relative;
        }
        
        :global(.testimonial-container:hover .swiper-button-next),
        :global(.testimonial-container:hover .swiper-button-prev) {
          opacity: 1;
        }
        
        :global(.testimonial-swiper) {
          padding-bottom: 50px;
        }
        
        :global(.testimonial-card) {
          height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        :global(.testimonial-text) {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          flex-grow: 1;
        }
        
        :global(.swiper-pagination-bullet) {
          background: #ccc;
          opacity: 1;
        }
        
        :global(.swiper-pagination-bullet-active) {
          background: var(--primary-color, #4f46e5);
        }
        
        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: var(--primary-color, #4f46e5);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </div>
  )
}

export default Testimonial

