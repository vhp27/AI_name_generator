import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to AI Name Generator
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create unique names for your projects instantly
        </p>
        <Link 
          to="/generator" 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Start Generating Names
        </Link>
      </div>
    </main>
  );
};

export default Home;
