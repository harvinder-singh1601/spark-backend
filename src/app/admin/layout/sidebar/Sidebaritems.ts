export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  disabled?:boolean,
  subtitle?:string,
  badge?:boolean,
  badgeType?:string,
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
  disabled?:boolean,
  subtitle?:string,
  badgeType?:string,
  badge?:boolean,
}


import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "Content",
    children: [
      {
        name: "Blogs",
        icon: 'tabler:article',
        id: uniqueId(),
        url: "/admin/blogs",
      },
      {
        name: "Stores",
        icon: 'tabler:map-pin',
        id: uniqueId(),
        url: "/admin/locations",
      },
      {
        name: "Locations",
        icon: 'tabler:map-2',
        id: uniqueId(),
        url: "/admin/geo-locations",
      },
    ],
  },


];

export default SidebarContent;
