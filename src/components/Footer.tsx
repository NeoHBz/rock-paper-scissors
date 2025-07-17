export const Footer: React.FC = () => {
  return (
    <footer className="flex-grow sticky bottom-0">
      <div className="flex justify-end items-center w-full h-12 pt-4 pr-4 gap-2 opacity-50 text-sm">
        <a
          // href="https://neohbz.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-white hover:text-white transition-colors duration-300"
        >
          Made with ❤️ by Shalini
        </a>
      </div>
    </footer>
  );
};
