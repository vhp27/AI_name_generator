const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-600 dark:text-gray-300">
          {new Date().getFullYear()} AI Name Generator. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
