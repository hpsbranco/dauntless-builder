import contributorsJson from "@json/contributors.json";
import dependenciesJson from "@json/dependencies.json";
import { GitHub } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import LinkBox from "@src/components/LinkBox";
import PageTitle from "@src/components/PageTitle";
import { githubUrl, licenseUrl } from "@src/constants";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface Contributor {
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
    contributions: number;
}

export interface Dependency {
    name: string;
    license: string;
    repository?: string;
}

const contributors: Contributor[] = contributorsJson;
const dependencies: Dependency[] = dependenciesJson;

// remove specific version from dependency list
const dependencyRegex = /(@?.*)@.*/g;

const About: React.FC = () => {
    const { t, i18n } = useTranslation();

    const renderContributor = (contributor: Contributor) => (
        <Grid
            key={contributor.login}
            item
            md={4}
            xs={12}
        >
            <Card>
                <CardActionArea
                    component="a"
                    href={contributor.html_url}
                    target="_blank"
                >
                    <CardContent sx={{ alignItems: "center", display: "flex", gap: 2 }}>
                        <Box>
                            <Avatar
                                src={contributor.avatar_url}
                                sx={{ height: 64, width: 64 }}
                            />
                        </Box>
                        <Typography
                            component="div"
                            variant="h5"
                        >
                            {`${contributor.login}`}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );

    const renderDependency = (dependency: Dependency) => (
        <Grid
            key={dependency.name}
            item
            md={6}
            xs={12}
        >
            <Card>
                <CardActionArea
                    component="a"
                    disabled={!dependency.repository}
                    href={dependency.repository ? dependency.repository : undefined}
                    target="_blank"
                >
                    <CardContent sx={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography
                            component="div"
                            variant="h6"
                        >
                            {`${dependency.name.replace(dependencyRegex, "$1")}`}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            component="div"
                            variant="subtitle1"
                        >
                            {`${dependency.license}`}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );

    const buildString = useMemo(
        () =>
            new Date(DB_BUILD_TIME).toLocaleString(i18n.language, {
                dateStyle: "full",
                timeStyle: "long",
            }),
        [i18n.language],
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 2 }}>
            <PageTitle title={t("pages.about.title")} />

            <Typography>
                <LinkBox text={t("pages.about.main-text", { licenseUrl })} />
            </Typography>

            <Typography>{t("pages.about.build-info", { buildString })}</Typography>

            <Stack
                direction="row"
                spacing={2}
            >
                <Button
                    component="a"
                    href={githubUrl}
                    startIcon={<GitHub />}
                    target="_blank"
                >
                    {t("pages.about.source-code")}
                </Button>
            </Stack>

            <Typography
                component="div"
                variant="h4"
            >
                {t("pages.about.privacy")}
            </Typography>

            <Typography>{t("pages.about.privacy-text")}</Typography>

            <Typography
                component="div"
                variant="h4"
            >
                {t("pages.about.assets")}
            </Typography>

            <Typography>{t("pages.about.assets-text")}</Typography>

            <Typography
                component="div"
                variant="h4"
            >
                {t("pages.about.contributors")}
            </Typography>

            <Grid
                container
                spacing={2}
            >
                {contributors.map(renderContributor)}
            </Grid>

            <Typography
                component="div"
                variant="h4"
            >
                {t("pages.about.dependencies", { number: dependencies.length })}
            </Typography>

            <Grid
                container
                spacing={2}
            >
                {dependencies.map(renderDependency)}
            </Grid>
        </Box>
    );
};

export default About;
