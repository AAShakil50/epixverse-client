import { gql, useLazyQuery } from "@apollo/client";
import SideNav from "../components/sidenav";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";

const GQL_GET_APPLICATION = gql`
  query GetApplication {
    epixVerse { app version description developer }
  }
`;

type Application = {
  app: string;
  version: string;
  description: string;
  developer: string[];
};

const HomePage = () => {
  const [queryApp, { loading, error, data }] = useLazyQuery<{ epixVerse: Application }>(
    GQL_GET_APPLICATION,
    { fetchPolicy: 'no-cache' }
  );

  return (
    <SidebarProvider>
      <SideNav />
      <main className="w-full">
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
            <Button
              // className={`josefin-sans mx-auto flex justify-center text-2xl text-white
              //     bg-blue-500 px-8 py-4 rounded-lg font-bold`}
              size="lg"
              className="gap-4 my-4 px-8 text-lg"
              onClick={() => queryApp()}>
              <PencilLine /> Lead Your Quill
            </Button>
            {(loading) && <div className="text-center mt-4 text-2xl">...</div>}
            {(error) && <div className="text-center mt-4 text-2xl">error while fethcing</div>}
            {(data) && <div className="text-center mt-4 text-2xl">{data.epixVerse.version}</div>}
          </div>
        </section>
      </main>
    </SidebarProvider>
  );
}

export default HomePage;