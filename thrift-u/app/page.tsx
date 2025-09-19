import Image from "next/image";
import "./globals.css";

export default function Home() {
  return <div className="center">
      <Image style={{filter:'invert(100%)'}}src="/Graphics/ThriftULogoModern.png" alt="ThriftU Logo" width={400} height={400}/>
      Home Page
      </div>
}
