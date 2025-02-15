import { Box, Card, CardActionArea, CardContent, CardMedia, Skeleton, Typography } from "@mui/material";
import PerksText from "@src/components/PerksText";
import { itemPickerDefaultImageSize } from "@src/components/theme";
import { ItemType } from "@src/data/ItemType";
import { Weapon } from "@src/data/Weapon";
import { itemTranslationIdentifier } from "@src/utils/item-translation-identifier";
import React from "react";
import { useTranslation } from "react-i18next";
import { LazyLoadComponent } from "react-lazy-load-image-component";

interface BondWeaponPickerProps {
    parentWeapon: Weapon | null;
    parentWeaponPowerSurged?: boolean;
    bondWeapon: Weapon | null;
    onClick: () => void;
}

const imageSize = itemPickerDefaultImageSize;

const BondWeaponPicker: React.FC<BondWeaponPickerProps> = ({
    parentWeapon,
    parentWeaponPowerSurged,
    bondWeapon,
    onClick,
}) => {
    const { t } = useTranslation();

    if (parentWeapon === null) {
        return null;
    }

    if (!parentWeapon.bond) {
        return null;
    }

    if (bondWeapon === null) {
        return (
            <Card sx={{ mb: 1 }}>
                <CardActionArea
                    onClick={() => onClick()}
                    sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                    <Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", p: 2 }}>
                        <CardMedia
                            component="img"
                            image={"/assets/icons/generic/Weapon.png"}
                            sx={{ height: imageSize, width: imageSize }}
                        />
                    </Box>
                    <Box>
                        <Typography
                            component="div"
                            sx={{ mb: 1 }}
                            variant="h5"
                        >
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: t("pages.build.no-x-selected", { name: t("terms.bond-weapon") }),
                                }}
                            />
                        </Typography>
                        <Typography
                            color="text.secondary"
                            component="div"
                            variant="subtitle1"
                        >
                            {t("pages.build.click-here-to-select")}
                        </Typography>
                    </Box>
                </CardActionArea>
            </Card>
        );
    }

    return (
        <Card sx={{ mb: 1, userSelect: "none", width: "100%" }}>
            <CardActionArea
                onClick={() => onClick()}
                sx={{ display: "flex", justifyContent: "flex-start" }}
            >
                <Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", p: 2 }}>
                    <LazyLoadComponent
                        placeholder={
                            <Skeleton
                                height={imageSize}
                                variant="circular"
                                width={imageSize}
                            />
                        }
                    >
                        <CardMedia
                            alt={t(itemTranslationIdentifier(ItemType.Weapon, bondWeapon.name, "name"))}
                            component={"img"}
                            image={bondWeapon.icon ?? "/assets/noicon.png"}
                            sx={{ height: imageSize, width: imageSize }}
                        />
                    </LazyLoadComponent>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Box
                            alignItems="center"
                            display="flex"
                        >
                            <Typography
                                component="div"
                                sx={{ alignItems: "center", display: "flex", mb: 1 }}
                                variant="h5"
                            >
                                {t(itemTranslationIdentifier(ItemType.Weapon, bondWeapon.name, "name"))}
                            </Typography>
                        </Box>
                        {(bondWeapon.perks ?? []).length > 0 ? (
                            <Typography
                                color="text.secondary"
                                component="div"
                                variant="subtitle1"
                            >
                                <PerksText
                                    itemSurged={parentWeaponPowerSurged}
                                    perks={bondWeapon.perks ?? []}
                                />
                            </Typography>
                        ) : null}
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    );
};

export default React.memo(BondWeaponPicker);
