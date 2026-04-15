// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-screen flex items-center justify-center bg-cover bg-center" 
           style={{ backgroundImage: "url('https://picsum.photos/id/1015/2000/1200')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            SPRING SALE
          </h1>
          <p className="text-5xl font-light mb-8">
            UP TO <span className="text-yellow-300 font-bold">50% OFF</span>
          </p>
          <Link 
            to="/shop"
            className="inline-block bg-white text-pink-600 px-12 py-5 rounded-full text-2xl font-bold hover:bg-pink-100 transition"
          >
            Shop Now →
          </Link>
        </div>
      </div>

      {/* Offers Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">🔥 Special Offers</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-16 rounded-3xl text-white text-center">
            <h3 className="text-5xl font-bold">BUY 2 GET 1 FREE</h3>
            <p className="mt-6 text-2xl">On T-Shirts & Hoodies</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-violet-600 p-16 rounded-3xl text-white text-center">
            <h3 className="text-5xl font-bold">20% OFF</h3>
            <p className="mt-6 text-2xl">On All Dresses & Tops</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;