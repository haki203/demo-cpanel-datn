import React from "react";

import { SelectBox } from "components";

export default {
  title: "duan_cpanel_demo1/SelectBox",
  component: SelectBox,
  argTypes: {
    options: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
  },
};

export const SampleSelectbox = (args) => <SelectBox {...args} />;

SampleSelectbox.args = { placeholder: "Select", className: "w-[300px]" };
