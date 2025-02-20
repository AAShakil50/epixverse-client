import { lazy, Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import LoadingComponent from "./components/elements/loading";
import HomePage from "./pages/home";
import { RecoilRoot } from "recoil";
import { RecoilLogger } from "./debug/debug-recoil";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { API_URL } from "./lib/site.configs";
import { SidebarProvider } from "./components/ui/sidebar";
import SideNav from "./components/containers/sidenav";

const ProjectsPage = lazy(() => import("./pages/projects"));
const ProjectPage = lazy(() => import("./pages/project"));

const httpLink = new HttpLink({
  uri: `${API_URL}/graphql`,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <RecoilLogger />
        <Suspense fallback={<LoadingComponent />}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <SidebarProvider>
                    <SideNav />
                    <Outlet />
                  </SidebarProvider>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="project" element={<ProjectPage />} />
                <Route
                  path="*"
                  element={
                    <center className="text-4xl font-bold">
                      404 Not Found
                    </center>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </RecoilRoot>
    </ApolloProvider>
  );
}

export default App;
