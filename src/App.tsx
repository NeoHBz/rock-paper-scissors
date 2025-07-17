import { Footer } from "./components/Footer";
import { HomeScreen } from "./components/Homescreen";

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <HomeScreen />
      <Footer />
    </div>
  );
};
