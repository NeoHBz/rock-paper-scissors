export const Footer: React.FC = () => {
  return (
    <footer className="grow sticky bottom-0">
      <div className="flex justify-end items-center w-full h-12 pt-4 pr-4 gap-2 text-sm">
        <a
          // href="https://neohbz.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-black transition-colors duration-300 font-pixeboy"
        >
          Made with ❤️ by Shalini
        </a>
      </div>
    </footer>
  );
};
