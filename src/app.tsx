/* eslint-disable simple-import-sort/imports */
// these two files have to be included first and in this exact order
import "./i18n";
import { store } from "./store";
/* eslint-enable simple-import-sort/imports */

import { registerSW } from "virtual:pwa-register";
import { ThemeProvider } from "@mui/material";
import { Slide } from "@mui/material";
import About from "@src/pages/about/About";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import { makeTheme } from "./components/theme";
import NotFound from "./pages/404/NotFound";
import Build from "./pages/build/Build";
import BuildFinder from "./pages/build/BuildFinder";
import MetaBuilds from "./pages/build/MetaBuilds";
import NewBuild from "./pages/build/NewBuild";
import Home from "./pages/home/Home";
import Settings from "./pages/settings/Settings";
import BackgroundTasks from "@src/components/BackgroundTasks";
import Favorites from "@src/pages/favorites/Favorites";
import useIsMobile from "@src/hooks/is-mobile";
import log from "@src/utils/logger";
import { useAppSelector } from "@src/hooks/redux";
import { selectConfiguration } from "@src/features/configuration/configuration-slice";

const DauntlessBuilderApp = () => {
    const isMobile = useIsMobile();

    const configuration = useAppSelector(selectConfiguration);

    const theme = makeTheme(configuration.lightModeEnabled ? "light" : "dark");

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SnackbarProvider
                    TransitionComponent={Slide}
                    anchorOrigin={{
                        horizontal: isMobile ? "center" : "right",
                        vertical: "bottom",
                    }}
                    maxSnack={3}
                >
                    <Layout>
                        <Routes>
                            <Route path="/">
                                <Route
                                    element={<Home />}
                                    index
                                />

                                <Route path="b">
                                    <Route
                                        element={<Navigate to={"/b/new"} />}
                                        index
                                    />
                                    <Route
                                        element={<NewBuild />}
                                        path="new"
                                    />
                                    <Route
                                        element={<BuildFinder />}
                                        path="finder"
                                    />
                                    <Route
                                        element={<MetaBuilds />}
                                        path="meta"
                                    />
                                    <Route
                                        element={<Build />}
                                        path=":buildId"
                                    />
                                </Route>

                                <Route
                                    element={<Favorites />}
                                    path="/favorites"
                                />

                                <Route
                                    element={<About />}
                                    path="/about"
                                />

                                <Route
                                    element={<Settings />}
                                    path="/settings"
                                />

                                <Route
                                    element={<NotFound />}
                                    path="*"
                                />
                            </Route>
                        </Routes>
                        <BackgroundTasks />
                    </Layout>
                </SnackbarProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

let container: HTMLElement | null = null;
let root: Root | null = null;

if ("serviceWorker" in navigator) {
    const updateSW = registerSW({
        onNeedRefresh() {
            log.debug("Service Worker needs update...");
            updateSW(true).then(() => {
                log.debug("Service Worker updated!");
            });
        },
        onRegistered(registration) {
            if (!registration) {
                return;
            }
            const interval = 1000 * 60 * 60; // 1h
            setInterval(() => {
                registration.update();
            }, interval);
        },
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (!container) {
        container = document.querySelector<HTMLElement>("#app");

        if (!container) {
            return;
        }

        root = createRoot(container);
    }

    root?.render(
        <StrictMode>
            <Provider store={store}>
                <DauntlessBuilderApp />
            </Provider>
        </StrictMode>,
    );
});
