// src/pages/Home/HomePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { useForm } from 'react-hook-form';
import emailjs from 'emailjs-com';
import Loader from '../../common/Loader/Loader';
import {
  FaUniversity,
  FaBrain,
  FaComments,
  FaGraduationCap
} from 'react-icons/fa';
import logo from '../../util/images/logo.png';
import campus1 from '../../util/images/campus1.png';
import campus2 from '../../util/images/campus1.png';
import campus3 from '../../util/images/campus1.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.scss';

const FEATURES = [
  { icon: <FaUniversity />, title: 'University Listings', text: 'Browse thousands of profiles, all in one place.' },
  { icon: <FaBrain />, title: 'Smart Recommendations', text: 'AI-powered suggestions tailored for you.' },
  { icon: <FaComments />, title: 'Peer Reviews', text: 'Read candid feedback from real students.' },
  { icon: <FaGraduationCap />, title: 'Program Finder', text: 'Discover programs that match your goals.' },
];

export default function HomePage() {
  const [loading, setLoading]       = useState(true);
  const [aboutInView, setAboutInView] = useState(false);
  const aboutRef                   = useRef(null);
  // const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // animate “About” into view
  useEffect(() => {
    if (!aboutRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAboutInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(aboutRef.current);
    return () => obs.disconnect();
  }, []);

  // const onSubmit = data => {
  //   emailjs
  //     .send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID', data, 'YOUR_USER_ID')
  //     .then(() => { alert('Message sent!'); reset(); })
  //     .catch(() => alert('Error, please try again.'));
  // };

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 700,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    cssEase: 'ease-in-out',
  };

  if (loading) return <Loader fullScreen />;

  return (
    <main className="homepage">
      {/* Hero */}
      <section className="homepage__hero">
        <div className="homepage__hero-content container text-center">
          <img src={logo} alt="EduUniverse" className="homepage__hero-logo" />
          <h1 className="homepage__hero-title">Explore • Connect • Discover</h1>
          <Link to="/universities" className="homepage__cta-btn primary-btn">
            Browse Universities
          </Link>
        </div>
      </section>

      {/* Carousel */}
      <section className="homepage__carousel container mt-5">
        <h2 className="homepage__section-title">Student Life on Campus</h2>
        <Slider {...sliderSettings} className="homepage__carousel-slider">
          {[campus1, campus2, campus3].map((img, idx) => (
            <div key={idx} className="homepage__carousel-slide">
              <img
                src={img}
                alt={`Campus ${idx + 1}`}
                className="homepage__carousel-image"
              />
            </div>
          ))}
        </Slider>
      </section>

      {/* About */}
      <section
        className="homepage__about container mt-5">
        <h2 className="homepage__section-title text-center mb-4">About Us</h2>
        <div className="row homepage__about-grid">
          {FEATURES.map(({ icon, title, text }, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-3 mb-4">
              <div className="homepage__about-card">
                <div className="homepage__about-icon">{icon}</div>
                <h3 className="homepage__about-title">{title}</h3>
                <p className="homepage__about-text">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
