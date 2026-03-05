import Image from "next/image";
import Hero from "@/app/componets/MainPage/Hero";
import FeaturedCollections from "@/app/componets/MainPage/FeatutureCollection";
import TrendingProducts from "@/app/componets/MainPage/Trending";
import BrandStory from "@/app/componets/MainPage/BrandStory";
import NewArrivals from "@/app/componets/MainPage/NewArrivals";


export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCollections />
      <TrendingProducts />
      <NewArrivals />
      <BrandStory />
    </div>
  );
}
