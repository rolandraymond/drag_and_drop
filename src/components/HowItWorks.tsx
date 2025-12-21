import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import TypingHeading from './TypingHeading';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Start Building',
      description: 'Click "Let\'s Build Your Course" to enter the editor and begin creating your learning content.'
    },
    {
      number: 2,
      title: 'Add Text',
      description: 'Write engaging content for your learning pages using the text element tool.'
    },
    {
      number: 3,
      title: 'Add Question',
      description: 'Create interactive questions to test understanding and engage learners.'
    },
    {
      number: 4,
      title: 'Add Image Question',
      description: 'Include visual content questions to make learning more dynamic and appealing.'
    },
    {
      number: 5,
      title: 'Drag to Reorder',
      description: 'Arrange elements in your desired sequence by dragging and dropping them.'
    },
    {
      number: 6,
      title: 'Edit Inline',
      description: 'Modify elements directly on the page for quick and easy adjustments.'
    },
    {
      number: 7,
      title: 'Clear All',
      description: 'Remove all elements if you need to start fresh or make major changes.'
    },
    {
      number: 8,
      title: 'Export .tsx',
      description: 'Generate ready-to-use React component code for your completed learning content.'
    }
  ];

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
      <TypingHeading text="How Luild Works" />
    </h1>
    <p className="text-lg md:text-xl text-[#E3FFCC]/90 mb-8 max-w-2xl mx-auto">
       Learn how to build AI-powered learning content step by step.
    </p>
  </div>
</section>
      

      {/* Step-by-Step Section */}
      <section className="py-20 bg-[#282930]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-[#F7F7F7]/10 rounded-lg p-6 hover:bg-[#F7F7F7]/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#E3FFCC] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-[#142F32]">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-mono font-bold text-[#E3FFCC] mb-2">{step.title}</h3>
                    <p className="text-[#777C90] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#142F32]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-mono font-bold mb-6 text-[#E3FFCC]">Ready to Start Building?</h2>
          <p className="text-xl text-[#777C90] mb-8">Transform your ideas into interactive learning experiences.</p>
          <Link to="/editor" className="inline-block bg-[#E3FFCC] text-[#142F32] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Start Building Your Course
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

export default HowItWorks;