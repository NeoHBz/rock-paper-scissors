import { Footer } from "./components/Footer";
import { HomeScreen } from "./components/Homescreen";
import { Navbar } from "./components/Navbar";

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Navbar />
      <HomeScreen />
      <Footer />
    </div>
  );
};
