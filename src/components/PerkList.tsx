import { Cake, Warning } from "@mui/icons-material";
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Tooltip,
    useTheme,
} from "@mui/material";
import { BuildModel, findCellByVariantName, findPerkByName } from "@src/data/BuildModel";
import { ItemType } from "@src/data/ItemType";
import { Perk, PerkValue } from "@src/data/Perks";
import { selectBuild } from "@src/features/build/build-slice";
import useIsLightMode from "@src/hooks/light-mode";
import { useAppSelector } from "@src/hooks/redux";
import i18n from "@src/i18n";
import { itemTranslationIdentifier } from "@src/utils/item-translation-identifier";
import React from "react";
import { useTranslation } from "react-i18next";

const PerkList: React.FC = () => {
    const build = useAppSelector(selectBuild);
    const { t } = useTranslation();

    const theme = useTheme();
    const isLightMode = useIsLightMode();

    const sortedPerks = perkData(build);

    const renderToolTip = (perk: Perk, count: number) => (
        <Box>
            {Object.keys(perk.effects).map(id => (
                <Box
                    key={id}
                    sx={{ color: theme.palette.grey[id === Math.max(0, Math.min(6, count)).toString() ? 50 : 400] }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <Box sx={{ whiteSpace: "nowrap" }}>{`+ ${id}`}</Box>
                        <Box>{perkEffectDescriptionById(perk, id)}</Box>
                    </Stack>
                </Box>
            ))}
        </Box>
    );

    return (
        <List
            subheader={<ListSubheader>{t("terms.perks")}</ListSubheader>}
            sx={{ bgcolor: "background.paper", maxWidth: 360, userSelect: "none", width: "100%" }}
        >
            {sortedPerks.length === 0 ? (
                <ListItem>
                    <ListItemIcon sx={{ alignItems: "center", display: "flex", justifyContent: "center" }}>
                        <Cake />
                    </ListItemIcon>
                    <ListItemText primary={t("pages.build.no-perks")} />
                </ListItem>
            ) : null}

            {sortedPerks.map(perk => (
                <Tooltip
                    key={perk.name}
                    arrow
                    followCursor
                    title={renderToolTip(perk.data, perk.count)}
                >
                    <ListItem
                        key={perk.name}
                        sx={{ pb: 0.5, pt: 0.5 }}
                    >
                        <ListItemIcon sx={{ alignItems: "center", display: "flex", justifyContent: "center" }}>
                            <img
                                src={`/assets/icons/perks/${perk.data.type}.png`}
                                style={{ filter: isLightMode ? "invert(100%)" : undefined, height: 32, width: 32 }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={`+${perk.count} ${t(itemTranslationIdentifier(ItemType.Perk, perk.name, "name"))}`}
                            secondary={perkEffectDescriptionById(perk.data, Math.min(perk.count, 6).toString())}
                        />
                        {perk.count > 6 ? <Warning /> : null}
                    </ListItem>
                </Tooltip>
            ))}
        </List>
    );
};

export const perkData = (build: BuildModel) => {
    const perks: PerkValue[] = [];

    const addPerk = (perk: PerkValue) => perks.push(perk);
    const filterSurged = (surged: boolean) => (perk: PerkValue) => perk.powerSurged === surged;

    build.data.weapon?.perks?.filter(filterSurged(build.weaponSurged)).forEach(addPerk);
    build.data.head?.perks?.filter(filterSurged(build.headSurged)).forEach(addPerk);
    build.data.torso?.perks?.filter(filterSurged(build.torsoSurged)).forEach(addPerk);
    build.data.arms?.perks?.filter(filterSurged(build.armsSurged)).forEach(addPerk);
    build.data.legs?.perks?.filter(filterSurged(build.legsSurged)).forEach(addPerk);
    build.data.bondWeapon?.perks?.filter(filterSurged(build.weaponSurged)).forEach(addPerk);

    [
        build.weaponCell1,
        build.weaponCell2,
        build.headCell,
        build.torsoCell,
        build.armsCell,
        build.legsCell,
        build.lanternCell,
    ]
        .filter(variant => variant !== null)
        .map(variant => {
            const cell = findCellByVariantName(variant as string);
            const cellPerks = cell?.variants[variant as string].perks;
            if (cellPerks) {
                Object.keys(cellPerks).forEach(name => {
                    const value = cellPerks[name];
                    perks.push({ name, value });
                });
            }
        });

    const perkMap: { [name: string]: { count: number; data: Perk } } = {};

    perks.forEach(perk => {
        if (!(perk.name in perkMap)) {
            const data = findPerkByName(perk.name);

            if (!data) {
                return;
            }

            perkMap[perk.name] = { count: 0, data };
        }

        perkMap[perk.name].count += perk.value;
    });

    return Object.keys(perkMap)
        .map(name => ({ count: perkMap[name].count, data: perkMap[name].data, name }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const perkEffectDescriptionById = (perk: Perk, id: string): string => {
    if (!Array.isArray(perk.effects[id].description)) {
        return i18n.t(
            itemTranslationIdentifier(ItemType.Perk, perk.name, "effects", id, "description"),
            perk.effects[id].values,
        );
    }

    return (perk.effects[id].description as (string | null)[])
        .map((description, index) =>
            description !== null
                ? i18n.t(
                    itemTranslationIdentifier(
                        ItemType.Perk,
                        perk.name,
                        "effects",
                        id,
                        "description",
                        index.toString(),
                    ),
                    perk.effects[id].values,
                )
                : null,
        )
        .filter(description => !!description)
        .join(", ");
};

export default PerkList;
