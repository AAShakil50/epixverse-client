import { Button } from "@/components/ui/button";
import { PageLayout } from "@/layouts/page-layout";
import { PencilLine } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <PageLayout showHeader>
      <section className="my-4">
        <div className="container flex flex-col items-center gap-4 text-center">
          <h1
            className={`mx-4 font-josefin text-4xl font-bold tracking-tighter`}
          >
            Shape Your Kingdom
          </h1>
          <p className={`font-kanit text-lg`}>
            The writing sanctuary for fiction & nonfiction authors.
          </p>
          <Link to="/projects">
            <Button
              size="lg"
              role="link"
              className="my-4 gap-4 bg-primary px-8 font-josefin text-lg text-slate-800 hover:bg-primary-500"
            >
              <PencilLine /> Lead Your Quill
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
