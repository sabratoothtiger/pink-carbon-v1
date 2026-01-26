import Hero from "@/components/home-page/hero";
import Footer from "@/components/home-page/footer";
import Header from "@/components/home-page/header";
import About from "@/components/home-page/about";
import Features from "@/components/home-page/features";
import Pricing from "@/components/home-page/pricing";


export default async function Index() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col py-14">
        <Hero />
        <Features />
        <Pricing />
        <About />
      </main>
      <Footer />
    </>
  );
}