import React from "react";
import PropTypes from "prop-types";
import PropTypeUtility from "../utility/PropTypeUtility";

export default class ModalCellListItem extends React.Component {

    filterRarity(variant) {
        const {item, rarityFilter} = this.props;

        // no rarity filter supplied?
        if(!rarityFilter) {
            return true;
        }

        return item.variants[variant].rarity === rarityFilter.value;
    }

    render() {
        const item = this.props.item;

        let getPerkDescription = perk => {
            if(perk in this.props.itemData.perks) {
                return this.props.itemData.perks[perk].description;
            }

            return null;
        };

        let getDescriptions = variant => {
            return Object.keys(variant.perks).map(perk => getPerkDescription(perk)).join(", ");
        };

        let variants = Object.keys(item.variants).filter(this.filterRarity.bind(this)).map(v =>
            <div key={v} className={"cell " + item.variants[v].rarity} onClick={() => this.props.onSelected("Cell", v)}>
                <img src={"/assets/icons/perks/" + item.slot + ".png"} />
                <div className="cell-perk-wrapper">
                    <div className="cell-title">{v}</div>
                    <div className="perks">{getDescriptions(item.variants[v])}</div>
                </div>
            </div>
        );

        return <React.Fragment key={item.name}>
            <h3 className={"subtitle cell-title-line " + (this.props.rarityFilter ? "hidden" : "")}>{item.name}</h3>
            <div className="cells">
                {variants}
            </div>
        </React.Fragment>;
    }
}

ModalCellListItem.propTypes = {
    item: PropTypeUtility.item(),
    itemData: PropTypes.object,
    rarityFilter: PropTypes.shape({
        value: PropTypes.string
    }),
    onSelected: PropTypes.func
};