"use client";
import React, { useContext } from "react";
import { Sidebar, Tooltip } from "flowbite-react";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import { Icon } from "@iconify/react";
import FullLogo from "../shared/logo/FullLogo";
const MobileSidebar = () => {

  return (
    <>
     <div className="flex">
          <Sidebar
            className="fixed menu-sidebar pt-0 bg-white dark:bg-dark z-[10]"
            aria-label="Sidebar with multi-level dropdown example"
          >
            <div className="px-6 flex items-center brand-logo overflow-hidden">
              <FullLogo />
            </div>
            <SimpleBar className="h-[calc(100vh_-_100px)]">
              <Sidebar.Items className={`px-6`}>
                <Sidebar.ItemGroup className="sidebar-nav">
                  {SidebarContent.map((item, index) => (
                    <React.Fragment key={index}>
                     <h5 className="text-link font-bold text-xs dark:text-darklink caption">
                        <span className="hide-menu leading-21">{item.heading?.toUpperCase()}</span>
                        <Icon
                        icon="tabler:dots"
                        className="text-ld block mx-auto leading-6 dark:text-opacity-60 hide-icon"
                        height={18}
                      />
                      </h5>


                      {item.children?.map((child, index) => (
                        <React.Fragment key={child.id && index}>
                          {child.children ? (
                            <div className="collpase-items">
                              <NavCollapse item={child} />
                            </div>
                          ) : (
                            <NavItems item={child} />
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </SimpleBar>

          </Sidebar>
        </div>
    </>
  );
};

export default MobileSidebar;
