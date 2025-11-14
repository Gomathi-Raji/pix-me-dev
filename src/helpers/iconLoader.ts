import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";
import * as VscIcons from "react-icons/vsc";

const libraryMap: Record<string, typeof TbIcons | typeof VscIcons | typeof SiIcons> = {
    "react-icons/tb": TbIcons,
    "react-icons/vsc": VscIcons,
    "react-icons/si": SiIcons
};

export const loadIcon = (library: keyof typeof libraryMap, icon: string) => {
    const selectedLibrary = libraryMap[library];
    return selectedLibrary && icon in selectedLibrary ? selectedLibrary[icon as keyof typeof selectedLibrary] : null;
};
