import React from "react";
import { CheckBox } from "components";

export default {
  title: "duan_cpanel_demo1/CheckBox",
  component: CheckBox,
};

export const SampleCheckbox = (args) => <CheckBox {...args} />;

SampleCheckbox.args = { label: "Checkbox", inputClassName: "mr-1" };
