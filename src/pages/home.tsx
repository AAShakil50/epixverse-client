import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {

  return <main className="w-full">
    <Header />
    <section
      className="my-4">
      <div
        className="container flex flex-col items-center gap-4 text-center">
        <h1
          className={`text-4xl font-bold tracking-tighter josefin-sans mx-4`}>
          Shape Your Kingdom
        </h1>
        <p
          className={`kanit-400 text-lg`}>
          The writing sanctuary for fiction & nonfiction authors.
        </p>
        <Link
          to="/projects">
          <Button
            size="lg"
            role="link"
            className="gap-4 my-4 px-8 text-lg josefin-sans">
            <PencilLine /> Lead Your Quill
          </Button>
        </Link>
      </div>
    </section>
  </main>
}

export default HomePage;