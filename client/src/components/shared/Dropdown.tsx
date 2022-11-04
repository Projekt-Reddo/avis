import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Icon from "components/shared/Icon";
import { Link } from "react-router-dom";
import React from "react";
import { useOutsideClick } from "utils/useOutsideClick";

interface DropdownProps {
    menu: React.ReactNode;
    menuStyle?: any;
    options: DropdownOption[];
}

const Dropdown: React.FC<DropdownProps> = ({
    menu,
    menuStyle = {},
    options,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const ref = React.useRef(null);
    useOutsideClick(ref, () => {
        setIsOpen(false);
    });

    return (
        <Menu as="div" className="relative inline-block text-left" ref={ref}>
            {({ open }) => (
                <>
                    <div>
                        <Menu.Button
                            className="flex items-center w-full justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none"
                            style={menuStyle}
                            onClick={() => {
                                setIsOpen(!isOpen);
                            }}
                        >
                            {menu}
                        </Menu.Button>
                    </div>

                    <Transition
                        show={isOpen}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        {isOpen && (
                            <Menu.Items
                                static
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[color:var(--element-bg-color)] drop-shadow-lg ring-1 ring-[color:var(--border-color)] ring-opacity-5 focus:outline-none"
                            >
                                <div className="py-1">
                                    {options.map((option, index) => (
                                        <Menu.Item key={index}>
                                            {({ active }) =>
                                                option.isShow === false ? (
                                                    <></>
                                                ) : (
                                                    <Link
                                                        to={option.to || "#"}
                                                        className={`block px-4 py-2 text-sm ${
                                                            active
                                                                ? "bg-[color:var(--element-bg-color-elevate-1)] text-[color:var(--text-primary-color)]"
                                                                : "text-[color:var(--text-secondary-color)]"
                                                        }`}
                                                        onClick={() => {
                                                            if (
                                                                option.onClick
                                                            ) {
                                                                option.onClick();
                                                            }
                                                            if (
                                                                option.autoClose ===
                                                                false
                                                            ) {
                                                            } else {
                                                                setIsOpen(
                                                                    false
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Icon
                                                            className="mr-3"
                                                            icon={option.icon}
                                                            size="lg"
                                                        />
                                                        {option.lable}
                                                    </Link>
                                                )
                                            }
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        )}
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default Dropdown;
