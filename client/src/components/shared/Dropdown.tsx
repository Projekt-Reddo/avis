import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Icon from "components/shared/Icon";
import { Link } from "react-router-dom";

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
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button
                    className="flex items-center w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700"
                    style={menuStyle}
                >
                    {menu}
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white drop-shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {options.map((option, index) => (
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <Link
                                        to={option.to || "#"}
                                        className={`block px-4 py-2 text-sm ${
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700"
                                        }`}
                                        onClick={option.onClick}
                                    >
                                        <Icon
                                            className="mr-3"
                                            icon={option.icon}
                                            size="lg"
                                        />
                                        {option.lable}
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Dropdown;
