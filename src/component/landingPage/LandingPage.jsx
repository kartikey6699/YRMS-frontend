import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import landingPageImage from "../../assets/images/landing_page_img.jpg";
import landingPageImage3 from "../../assets/images/landingpage4.webp";
import landingPageImage4 from "../../assets/images/landingpage3.webp";

const LandingPage = () => {
    // Hero Carousel State
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [landingPageImage, landingPageImage4, landingPageImage3];
    const heroIntervalRef = useRef(null);

    // Features Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);
    const featuresIntervalRef = useRef(null);
    const slides = [
        {
            title: "Resource Allocation",
            description: "Easily assign and manage resources across projects with real-time tracking.",
            icon: "M3 12h18M3 6h18M3 18h18",
        },
        {
            title: "Team Collaboration",
            description: "Streamline communication and task assignment for your teams.",
            icon: "M12 4.5v15m7.5-7.5h-15",
        },
        {
            title: "Analytics & Reporting",
            description: "Gain insights with detailed reports and resource utilization metrics.",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        },
    ];

    // Auto-slide for Hero Carousel
    const startHeroInterval = () => {
        heroIntervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 2000);
    };

    // Auto-slide for Features Carousel
    const startFeaturesInterval = () => {
        featuresIntervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 2000);
    };

    // Initialize intervals and cleanup
    useEffect(() => {
        startHeroInterval();
        startFeaturesInterval();

        return () => {
            clearInterval(heroIntervalRef.current);
            clearInterval(featuresIntervalRef.current);
        };
    }, []);

    // Pause on hover functionality
    const handleMouseEnter = () => {
        clearInterval(heroIntervalRef.current);
        clearInterval(featuresIntervalRef.current);
    };

    const handleMouseLeave = () => {
        startHeroInterval();
        startFeaturesInterval();
    };

    // Manual navigation handlers
    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        resetFeaturesInterval();
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        resetFeaturesInterval();
    };

    const resetFeaturesInterval = () => {
        clearInterval(featuresIntervalRef.current);
        startFeaturesInterval();
    };

    const goToHeroSlide = (index) => {
        setCurrentIndex(index);
        clearInterval(heroIntervalRef.current);
        startHeroInterval();
    };

    const goToFeaturesSlide = (index) => {
        setCurrentSlide(index);
        clearInterval(featuresIntervalRef.current);
        startFeaturesInterval();
    };

    return (
        <div className="bg-[#F9FAFB] -mt-[1px]">
            {/* Hero Section */}
            <section 
                className="bg-gradient-to-r from-[#D1D5DB] to-[#F9FAFB] relative -mt-[1px]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative w-full h-screen">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-500 ease-in-out ${index === currentIndex ? 'opacity-85 z-10' : 'opacity-0 z-0'}`}
                            style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <div className="container mx-auto my-20 px-6 text-center z-20 transition-opacity duration-1000">
                                <div className="absolute top-5 right-1 m-4 h-20 w-20">
                                    <img src="https://www.yash.com/wp-content/themes/html5blank-stable/images/yash-logo-new.svg" alt="Yash Logo" />
                                </div>
                                <h1 className="text-5xl md:text-6xl font-extrabold mb-10 leading-tight">
                                    Yash RMS
                                </h1>
                                <p className="text-lg md:text-2xl font-extrabold my-10 max-w-2xl mx-auto">
                                    Optimize your resources, streamline operations, and boost productivity with our all-in-one management system.
                                </p>
                                <div className="my-20 z-1">
                                    <NavLink
                                        to="/login"
                                        className="inline-block bg-black text-white px-10 py-4 rounded-lg hover:bg-[#1F2937] hover:text-white focus:ring-4 focus:ring-[#D1D5DB] focus:outline-none transition-colors duration-300 font-medium text-lg shadow-md hover:shadow-lg"
                                    >
                                        Get Started
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Navigation Arrows */}
                    <button
                        onClick={() => {
                            setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
                            clearInterval(heroIntervalRef.current);
                            startHeroInterval();
                        }}
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full shadow-md hover:bg-opacity-60 transition-all duration-200 focus:outline-none z-20"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
                            clearInterval(heroIntervalRef.current);
                            startHeroInterval();
                        }}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full shadow-md hover:bg-opacity-60 transition-all duration-200 focus:outline-none z-20"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    {/* Dots Navigation */}
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToHeroSlide(index)}
                                className={`w-4 h-4 rounded-full border border-white ${index === currentIndex ? 'bg-white' : 'bg-transparent'} focus:outline-none transition-all duration-300`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Carousel */}
            <section 
                className="py-16"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-extrabold text-[#1F2937] text-center mb-12">
                        Key Features<span className="text-[#3B82F6]">.</span>
                    </h2>
                    <div className="relative max-w-3xl mx-auto">
                        {/* Carousel Slides */}
                        <div className="overflow-hidden relative h-64">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-500 ease-in-out ${index === currentSlide
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 translate-x-full pointer-events-none"
                                        } ${index < currentSlide ? "-translate-x-full" : ""}`}
                                >
                                    <svg
                                        className="w-12 h-12 text-[#3B82F6] mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d={slide.icon}
                                        />
                                    </svg>
                                    <h3 className="text-2xl font-semibold text-[#1F2937] mb-4">
                                        {slide.title}
                                    </h3>
                                    <p className="text-[#1F2937] mb-6 max-w-md">
                                        {slide.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={goToPrevious}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#3B82F6] text-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[#D1D5DB]"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#3B82F6] text-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[#D1D5DB]"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>

                        {/* Carousel Dots */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToFeaturesSlide(index)}
                                    className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-[#3B82F6]" : "bg-[#D1D5DB]"
                                        } transition-colors duration-200`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-[#F9FAFB] py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-extrabold text-[#1F2937] text-center mb-12">
                        Why Choose Yash RMS?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-[#D1D5DB]">
                            <h3 className="text-xl font-semibold text-[#1F2937] mb-4">Efficiency</h3>
                            <p className="text-[#1F2937]">
                                Reduce waste and maximize resource utilization with smart allocation tools.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-[#D1D5DB]">
                            <h3 className="text-xl font-semibold text-[#1F2937] mb-4">Scalability</h3>
                            <p className="text-[#1F2937]">
                                Grow your operations seamlessly with a system that adapts to your needs.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-[#D1D5DB]">
                            <h3 className="text-xl font-semibold text-[#1F2937] mb-4">Transparency</h3>
                            <p className="text-[#1F2937]">
                                Track every resource and decision with clear, actionable insights.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="bg-gradient-to-r from-[#3B82F6] to-[#1F2937] py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-white mb-6">
                        Who We Are?
                    </h2>
                    <p className="text-lg text-[#D1D5DB] mb-8 max-w-xl mx-auto">
                        Join countless teams optimizing their workflows with Yash RMS.
                    </p>
                    <NavLink
                        to="/signup"
                        className="inline-block bg-white text-[#1F2937] px-8 py-4 rounded-lg hover:bg-[#D1D5DB] hover:text-[#3B82F6] focus:ring-4 focus:ring-[#D1D5DB] focus:outline-none transition duration-200 font-medium text-lg shadow-md hover:shadow-lg"
                    >
                        Sign Up Now
                    </NavLink>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;