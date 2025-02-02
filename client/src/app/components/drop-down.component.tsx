import React from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

type DropdownComponentProps = {
  items: MenuProps["items"];
  label?: React.ReactNode;
  onMenuClick?: MenuProps["onClick"];
};

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  items,
  label = "Dropdown Menu", // Default label if not provided
  onMenuClick,
}) => {
  return (
    <Dropdown menu={{ items, onClick: onMenuClick }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          {label}
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default DropdownComponent;
