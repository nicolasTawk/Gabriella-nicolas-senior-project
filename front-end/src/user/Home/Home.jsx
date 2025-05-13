import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import { useForm } from 'react-hook-form';
import emailjs from 'emailjs-com';
import Loader from '../../common/Loader/Loader';
import logo from '../../util/images/logo.png';
import campus1 from '../../util/images/campus1.png';
import campus2 from '../../util/images/campus1.png';
import campus3 from '../../util/images/campus1.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.scss';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = data => {
    emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID', data, 'YOUR_USER_ID')
      .then(() => { alert('Message sent!'); reset(); })
      .catch(() => alert('Error, please try again.'));
  };

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
      {/* Intro */}
      <section className="homepage__intro container">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-md-8">
            <img src={logo} alt="Logo" className="homepage__intro-logo mb-4" />
            <h1 className="homepage__intro-title">Explore, Connect, Discover</h1>
            <p className="homepage__intro-slogan">
              Your gateway to higher education opportunities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="homepage__carousel container mt-5">
        <h2 className="homepage__section-title text-center mb-4">Student Life on Campus</h2>
        <Slider {...sliderSettings} className="homepage__carousel-slider">
          {[campus1, campus2, campus3].map((img, idx) => (
            <div key={idx} className="homepage__carousel-slide">
              <img src={img} alt={`Campus ${idx+1}`} className="homepage__carousel-image" />
            </div>
          ))}
        </Slider>
      </section>

      {/* Stats */}
      <section className="homepage__stats container mt-5">
        <h2 className="homepage__section-title text-center mb-4">Our Impact</h2>
        <div className="row homepage__stats-grid">
          <div className="col-6 col-md-3 mb-4">
            <div className="homepage__stat text-center">
              <CountUp end={5000} duration={3} className="homepage__stat-count" />
              <div className="homepage__stat-title">Students</div>
            </div>
          </div>
          <div className="col-6 col-md-3 mb-4">
            <div className="homepage__stat text-center">
              <CountUp end={150} duration={3} className="homepage__stat-count" />
              <div className="homepage__stat-title">Universities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="homepage__about container mt-5">
        <h2 className="homepage__section-title text-center mb-4">What We Offer</h2>
        <div className="row homepage__features">
          {[
            'Global University Listings',
            'Personalized Recommendations',
            'Verified Student Reviews',
            'Up-to-date Program Info'
          ].map((feat, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-3 mb-4">
              <div className="homepage__feature">{feat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Future Plans */}
      <section className="homepage__future container mt-5">
        <h2 className="homepage__section-title text-center mb-4">Future Plans</h2>
        <div className="row homepage__future-list">
          {[
            '🎓 AI-powered academic matching',
            '🌐 Expansion to 1000+ universities',
            '💬 Live peer chat rooms',
            '💡 Smart scholarship finder'
          ].map((item, j) => (
            <div key={j} className="col-12 col-md-6 col-lg-3 mb-4">
              <div className="homepage__future-item">{item}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="homepage__contact container mt-5 mb-5">
        <h2 className="homepage__section-title text-center mb-4">Contact Us</h2>
        <div className="row">
          <div className="col-lg-6 mb-4">
            <form className="homepage__form" onSubmit={handleSubmit(onSubmit)}>
              <input {...register('name',{required:true})} placeholder="Your Name" className="homepage__input mb-3" />
              <input {...register('email',{required:true})} type="email" placeholder="Your Email" className="homepage__input mb-3" />
              <textarea {...register('message',{required:true})} placeholder="Your Message" className="homepage__textarea mb-3" />
              <button type="submit" className="homepage__button">Send Message</button>
            </form>
          </div>
          <div className="col-lg-6 homepage__info text-center text-md-start">
            <p><strong>Email:</strong> support@eduniverse.com</p>
            <p><strong>Phone:</strong> +123 456 7890</p>
            <p><strong>Address:</strong> 123 Edu Lane, Knowledge City</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
