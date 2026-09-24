import Image from "next/image";
import { Container } from "../layout/Container";

export function HomeBanner() {
  return <section className="home-banner" aria-label="My Turn tanıtımı"><Container><div className="home-banner-frame"><Image src="/Gemini_Generated_Image_vf0xohvf0xohvf0x.png" alt="My Turn, alıcıların buluşma noktası" fill sizes="(max-width: 700px) calc(100vw - 32px), 1180px" /></div></Container></section>;
}