import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Camera, LineChart, Home, Info, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black/90 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <LineChart className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                AI Stock Oracle
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-blue-500 flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/predict" className="text-gray-300 hover:text-blue-500 flex items-center space-x-1">
              <LineChart className="h-4 w-4" />
              <span>Predict</span>
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-blue-500 flex items-center space-x-1">
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-blue-500">
                Home
              </Link>
              <Link to="/predict" className="block px-3 py-2 text-gray-300 hover:text-blue-500">
                Predict
              </Link>
              <Link to="/about" className="block px-3 py-2 text-gray-300 hover:text-blue-500">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome to AI Stock Oracle
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Harness the power of artificial intelligence for precise stock market predictions
          </p>
          <Link 
            to="/predict" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            Start Predicting
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-blue-500 mb-4">
              <LineChart className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-gray-400">
              Leverage state-of-the-art LSTM neural networks for accurate stock price predictions
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-blue-500 mb-4">
              <Camera className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-gray-400">
              Track stock performance with dynamic charts and real-time market data
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-blue-500 mb-4">
              <Info className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Insights</h3>
            <p className="text-gray-400">
              Get detailed analysis and trends based on historical data and AI predictions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PredictPage = () => {
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('stock', stock);
      
      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.text();
        setResults(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Stock Price Prediction
        </h1>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl max-w-xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Enter Stock Symbol</label>
              <input
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. AAPL, GOOGL"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              {loading ? 'Analyzing...' : 'Predict'}
            </button>
          </form>
        </div>

        {results && (
          <div className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">EMA Analysis (20 & 50 Days)</h3>
                <img src="/static/ema_20_50.png" alt="EMA 20 & 50" className="w-full" />
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">EMA Analysis (100 & 200 Days)</h3>
                <img src="/static/ema_100_200.png" alt="EMA 100 & 200" className="w-full" />
              </div>
            </div>
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Prediction vs Actual Trend</h3>
              <img src="/static/stock_prediction.png" alt="Prediction" className="w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          About AI Stock Oracle
        </h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
            <p className="text-gray-400 leading-relaxed">
              AI Stock Oracle utilizes advanced LSTM (Long Short-Term Memory) neural networks
              to analyze and predict stock market trends. Our system processes vast amounts
              of historical data to identify patterns and make accurate predictions about
              future stock movements.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              We're dedicated to democratizing access to advanced financial analytics.
              By combining cutting-edge AI technology with user-friendly interfaces,
              we help investors make more informed decisions based on data-driven insights.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-blue-500 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-400">
                We gather historical stock data from reliable financial sources
              </p>
            </div>
            <div>
              <div className="text-blue-500 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p className="text-gray-400">
                Our LSTM model analyzes patterns and trends in the data
              </p>
            </div>
            <div>
              <div className="text-blue-500 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Prediction</h3>
              <p className="text-gray-400">
                Generate accurate predictions and visualizations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;