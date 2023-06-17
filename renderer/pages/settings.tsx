import { ipcRenderer } from "electron";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import TopNavBar from "../components/TopNavBar";

function Settings() {
  const [folderPath, setFolderPath] = useState<string>("");
  const [lastScan, setLastScan] = useState<string>("");
  const [genres, setGenres] = useState([]);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(false);

  const fetchGenres = async () => {
    try {
      setLoadingGenres(true);
      const fetchedGenres = await ipcRenderer.invoke("fetch-genres");
      setGenres(fetchedGenres);
    } catch (err) {
      console.error("Failed to fetch genres: ", err);
    } finally {
      setLoadingGenres(false);
    }
  };

  const selectFolder = async () => {
    const result = await ipcRenderer.invoke("select-dirs");
    if (result) {
      setFolderPath(result);
    }
  };

  useEffect(() => {
    const fetchFolderPath = async () => {
      const path = await ipcRenderer.invoke("get-dir");
      if (path) {
        setFolderPath(path);
      }
      const settings = await ipcRenderer.invoke("get-settings");
      if (settings) {
        if (settings["last_scan"]) {
          setLastScan(settings["last_scan"]);
        } else {
          console.warn("No last_scan date found in settings");
        }
      } else {
        console.error("Error retrieving settings");
      }
    };
    fetchFolderPath();
  }, []);

  const scanMedia = async () => {
    if (folderPath) {
      const media = await ipcRenderer.invoke("scan-media", folderPath);
      console.log(media);
      const settings = await ipcRenderer.invoke("get-settings");
      if (settings && settings["last_scan"]) {
        setLastScan(settings["last_scan"]);
      }
    }
  };

  const fetchMetadata = async () => {
    if (folderPath) {
      setLoadingMetadata(true);
      const metadata = await ipcRenderer.invoke("fetch-metadata", folderPath);
      console.log(metadata);
      setLoadingMetadata(false);
    }
  };

  const handleRemoveDuplicates = () => {
    ipcRenderer
      .invoke("remove-duplicates")
      .then(() => {
        console.log("Duplicates removed successfully.");
      })
      .catch((err) => {
        console.error("Error removing duplicates: ", err);
      });
  };

  const checkServer = () => {
    fetch("http://localhost:3000/posters")
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <React.Fragment>
      <Head>
        <title>Settings</title>
      </Head>
      <TopNavBar />
      <div
        className="flex overflow-hidden"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <div className="flex-auto bg-primary2 p-4">
          <h2 className="font-bold text-xl mb-4">Settings</h2>
          <div>
            <button
              onClick={checkServer}
              className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-primary2 rounded shadow ripple hover:shadow-lg hover:bg-secondary focus:outline-none mb-2"
            >
              Check Server
            </button>

            <button
              onClick={selectFolder}
              className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-primary2 rounded shadow ripple hover:shadow-lg hover:bg-secondary focus:outline-none mb-2"
            >
              Select Folder
            </button>
            {folderPath && (
              <div className="mt-4">
                <p>Selected Folder: {folderPath}</p>
              </div>
            )}
            <button
              onClick={scanMedia}
              className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-primary2 rounded shadow ripple hover:shadow-lg hover:bg-secondary focus:outline-none mb-2"
            >
              Scan Media
            </button>
            {lastScan && (
              <div className="mt-4">
                <p>Last Scan: {lastScan}</p>
              </div>
            )}
            <button
              onClick={fetchMetadata}
              className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-primary2 rounded shadow ripple hover:shadow-lg hover:bg-secondary focus:outline-none mb-2"
            >
              Fetch Metadata
            </button>
            {loadingMetadata ? (
              <div className="mt-4">Loading...</div>
            ) : (
              <div className="mt-4">Metadata fetched</div>
            )}

            <button
              onClick={fetchGenres}
              className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-primary2 rounded shadow ripple hover:shadow-lg hover:bg-secondary focus:outline-none mb-2"
            >
              Fetch Genres
            </button>
            {loadingGenres ? (
              <div className="mt-4">Loading...</div>
            ) : (
              <div className="mt-4">Genres fetched</div>
            )}
            <button
              className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-primary2 rounded shadow ripple hover:shadow-lg hover:bg-secondary focus:outline-none mb-2"
              onClick={handleRemoveDuplicates}
            >
              Remove Duplicates
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Settings;
