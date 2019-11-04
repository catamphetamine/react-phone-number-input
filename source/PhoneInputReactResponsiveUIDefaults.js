import React, { Component } from "react";
import PropTypes from "prop-types";

import labels from "../locale/default.json";
import internationalIcon from "./InternationalIcon";

import {
  metadata as metadataPropType,
  labels as labelsPropType
} from "./PropTypes";

import PhoneInput from "./PhoneInputReactResponsiveUI";

export function createPhoneInput(defaultMetadata) {
  return class PhoneInputReactResponsiveUIDefaultMetadata extends Component {
    static propTypes = {
      metadata: metadataPropType.isRequired,
      labels: labelsPropType.isRequired,
      internationalIcon: PropTypes.element.isRequired
    };

    static defaultProps = {
      metadata: defaultMetadata,
      labels,
      internationalIcon
    };

    storeInputRef = ref => (this.input = ref);
    render = () => <PhoneInput ref={this.storeInputRef} {...this.props} />;
    focus = () => this.input.focus();
  };
}

export default createPhoneInput();
