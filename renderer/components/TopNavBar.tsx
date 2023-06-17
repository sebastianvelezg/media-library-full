import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ipcRenderer } from "electron";

function TopNavBar() {
  return (
    <nav className="bg-primary py-2">
      <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4"></div>
              <Link href="/home">
                <a className="text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </a>
              </Link>

              <Link href="/movies">
                <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Movies
                </a>
              </Link>

              <Link href="/series">
                <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Series
                </a>
              </Link>

              <Link href="/settings">
                <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Settings
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNavBar;
