import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
              <Route path="/">
                <Route
                  index
                  element={
                    <SidebarProvider>
                      <SideNav />
                      <HomePage />
                    </SidebarProvider>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <SidebarProvider>
                      <SideNav />
                      <ProjectsPage />
                    </SidebarProvider>
                  }
                />
                <Route
                  path="project"
                  element={
                    <SidebarProvider>
                      <SideNav />
                      <ProjectPage landing="project" />
                    </SidebarProvider>
                  }
                />
                <Route path="book" element={<ProjectPage landing="book" />} />
                <Route
                  path="chapter"
                  element={
                    <SidebarProvider>
                      <SideNav />
                      <ProjectPage landing="chapter" />
                    </SidebarProvider>
                  }
                />
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
