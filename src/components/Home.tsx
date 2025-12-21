import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import TypingHeading from './TypingHeading';

const Home = () => {

  return (
    <div className="min-h-screen bg-[#282930] text-white">
      <Navbar />

      {/* Hero Section */}
      <section
  className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80')",
  }}
>
  <div className="absolute inset-0 bg-[#142F32]/60"></div>
  <div className="relative z-10 text-center max-w-4xl mx-auto px-4 flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold mb-6 text-[#E3FFCC] min-h-[140px] flex items-center justify-center">
      <TypingHeading text="build(learning).withAI()" />
    </h1>
    <p className="text-lg md:text-xl text-[#E3FFCC]/90 mb-8 max-w-2xl mx-auto">
      Create structured learning experiences with AI-powered evaluation and smart feedback.
    </p>
    <Link
      to="/editor"
      className="inline-block bg-[#E3FFCC] text-[#142F32] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
    >
      Start Building
    </Link>
  </div>
</section>


      {/* How It Works */}
      <section className="py-20 bg-[#282930] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-mono font-bold text-center mb-16 text-[#E3FFCC]">How Luild Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center hover:transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#E3FFCC] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#142F32]">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Pages</h3>
              <p className="text-[#777C90]">Create structured learning content as pages with articles and interactive elements.</p>
            </div>
            <div className="text-center hover:transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#E3FFCC] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#142F32]">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Questions</h3>
              <p className="text-[#777C90]">Include interactive questions that test understanding and engagement.</p>
            </div>
            <div className="text-center hover:transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#E3FFCC] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#142F32]">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Evaluation</h3>
              <p className="text-[#777C90]">Answers are automatically graded with intelligent feedback and corrections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-[#142F32] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-mono font-bold text-center mb-16 text-[#E3FFCC]">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#282930] p-6 rounded-lg hover:transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2 text-[#E3FFCC]">AI-Powered Correction</h3>
              <p className="text-[#777C90]">Intelligent evaluation of answers with detailed feedback.</p>
            </div>
            <div className="bg-[#282930] p-6 rounded-lg hover:transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2 text-[#E3FFCC]">Structured Learning</h3>
              <p className="text-[#777C90]">Build organized, page-based learning experiences.</p>
            </div>
            <div className="bg-[#282930] p-6 rounded-lg hover:transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2 text-[#E3FFCC]">Smart Feedback</h3>
              <p className="text-[#777C90]">Personalized guidance to improve understanding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#E3FFCC] text-[#142F32] animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-mono font-bold mb-6">Ready to Build Your Course?</h2>
          <p className="text-xl mb-8">Join creators who are revolutionizing learning with AI.</p>
          <Link to="/editor" className="inline-block bg-[#142F32] text-[#E3FFCC] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Let's Build Your Course
          </Link>
        </div>
      </section>

      {/* Footer */}
            <footer className="bg-[#282930] py-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex space-x-6 mb-4 md:mb-0">
                    <Link to="/" className="text-[#777C90] hover:text-[#E3FFCC] transition-colors">Home</Link>
                    <Link to="/how-it-works" className="text-[#777C90] hover:text-[#E3FFCC] transition-colors">How It Works</Link>
                    <Link to="/about" className="text-[#777C90] hover:text-[#E3FFCC] transition-colors">About Us</Link>
                  </div>
                  <p className="text-[#777C90] text-sm">&copy; 2025 Luild. Learn + Build.</p>
                </div>
              </div>
            </footer>
          </div>
  );
};

export default Home;