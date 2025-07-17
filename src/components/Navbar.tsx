import fontHelper from "../utils/fontHelper";

export const Navbar: React.FC = () => {
  return (
    <div className="min-w-full min-h-12">
      <nav className="navbar flex bg-red-700/50 shadow-lg w-full h-20 fixed top-0 z-50">
        <div className="flex justify-center items-center w-full h-full">
          <span
            className={`${fontHelper("font-pixeboy")} text-4xl md:text-5xl lg:text-6xl`}
          >
            Rock Paper Scissor Game
          </span>
        </div>
      </nav>
    </div>
  );
};
