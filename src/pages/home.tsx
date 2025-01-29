import { gql, useLazyQuery } from "@apollo/client";
import SideNav from "../components/sidenav";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";

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
        <div>
          <h1 className={`text-center text-7xl font-extrabold josefin-sans mt-12 mx-4`}>Epix Verse</h1>
          <h2 className={`kanit-400 text-3xl font-semibold text-center mb-12`}>shape your kingdom ...</h2>
          <button className={`josefin-sans mx-auto flex justify-center text-2xl text-white
                bg-blue-500 px-8 py-4 rounded-lg font-bold`}
            onClick={() => queryApp()}>Learn EpixVerse</button>
          {(loading) && <div className="text-center mt-4 text-2xl">...</div>}
          {(error) && <div className="text-center mt-4 text-2xl">error while fethcing</div>}
          {(data) && <div className="text-center mt-4 text-2xl">{data.epixVerse.version}</div>}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default HomePage;