import React from "react";
import PropTypes from "prop-types";
import BuildModel from "../models/BuildModel";

export default class PerkString extends React.Component {

    render() {
        const perkList = this.props.perks.map((perk, index) => <span key={perk.name} className="perk-string-items">
            +{perk.value} <img src={"/assets/icons/perks/" + BuildModel.findPerkByName(perk.name).type + ".png"} /> {perk.name}
            {index !== this.props.perks.length - 1 ? ", " : ""}
        </span>);

        if(perkList.length > 0) {
            return <div><strong>Perks</strong>: {perkList}</div>;
        }

        return null;
    }
}

PerkString.propTypes = {
    perks: PropTypes.array
};
