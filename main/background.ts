import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import fs from "fs";
import path from "path";
import axios from "axios";
import express from "express";
import cors from "cors";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

const appDataPath = app.getPath("userData");
const settingsFolderPath = path.join(appDataPath, "settings");

// Create settings folder if it does not exist
if (!fs.existsSync(settingsFolderPath)) {
  fs.mkdirSync(settingsFolderPath);
}

// Define your file paths
const settingsFilePath = path.join(settingsFolderPath, "settings.txt");
const mediaFilePath = path.join(settingsFolderPath, "media.txt");
const metadataFilePath = path.join(settingsFolderPath, "metadata.json");
const posterFolder = path.join(settingsFolderPath, "posters");
const genresFilePath = path.join(settingsFolderPath, "genres.json");

// Create the files if they do not exist
for (const filePath of [
  settingsFilePath,
  mediaFilePath,
  metadataFilePath,
  genresFilePath,
]) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
}

// Create the poster folder if it does not exist
if (!fs.existsSync(posterFolder)) {
  fs.mkdirSync(posterFolder);
}

let expressApp = express();
let videoFolder = null;
let server = null;

const startServer = (folderPath) => {
  if (server) {
    server.close();
  }

  expressApp = express();
  videoFolder = folderPath;

  // Add the 'cors' middleware to allow requests from all origins
  expressApp.use(cors());

  expressApp.use("/videos", express.static(videoFolder));
  expressApp.use("/posters", express.static(posterFolder));

  const port = isProd ? process.env.PORT || 3000 : 3000;
  server = expressApp
    .listen(port, "localhost", () => {
      console.log(`Express app listening on port ${port}`);
    })
    .on("error", (err) => {
      console.error("Error starting server: ", err);
    });
};

const getSavedMediaFolderPath = async () => {
  if (fs.existsSync(settingsFilePath)) {
    try {
      const settings = JSON.parse(await readFile(settingsFilePath, "utf-8"));
      return settings["media_path"] || null;
    } catch (err) {
      console.error(`Error parsing JSON from ${settingsFilePath}:`, err);
      return null;
    }
  }
  return null;
};

ipcMain.handle("select-dirs", async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (result.filePaths.length > 0) {
    let settings = {};
    if (fs.existsSync(settingsFilePath)) {
      try {
        settings = JSON.parse(fs.readFileSync(settingsFilePath, "utf-8"));
      } catch (error) {
        console.error(`Error reading JSON from ${settingsFilePath}:`, error);
        // Handle error as you see fit here, for example:
        settings = {}; // fallback to default settings
      }
    }
    settings["media_path"] = result.filePaths[0];
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings));
    startServer(result.filePaths[0]); // Call the new function here
    return settings["media_path"];
  }
  return null;
});

const { readFile } = require("fs").promises;

ipcMain.handle("get-dir", async (event) => {
  if (fs.existsSync(settingsFilePath)) {
    try {
      const settings = JSON.parse(await readFile(settingsFilePath, "utf-8"));
      return settings["media_path"] || null;
    } catch (err) {
      console.error(`Error parsing JSON from ${settingsFilePath}:`, err);
      return null;
    }
  }
  return null;
});

ipcMain.handle("scan-media", async (event, dirPath) => {
  const mediaFiles = [];
  try {
    const files = await fs.promises.readdir(dirPath);
    files.forEach((file) => {
      if (path.extname(file).toLowerCase() === ".mp4") {
        mediaFiles.push({
          title: path.basename(file, path.extname(file)),
          path: path.join(dirPath, file),
        });
      }
    });

    fs.writeFileSync(mediaFilePath, JSON.stringify(mediaFiles), "utf-8");

    let settings = {};
    if (fs.existsSync(settingsFilePath)) {
      settings = JSON.parse(fs.readFileSync(settingsFilePath, "utf-8"));
    }
    settings["last_scan"] = new Date().toISOString();
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings));

    return mediaFiles;
  } catch (err) {
    console.error(err);
    return null;
  }
});

ipcMain.handle("fetch-genres", async (event) => {
  let genres = [];

  // Check if the genres file already exists
  if (fs.existsSync(genresFilePath)) {
    const fileContent = fs.readFileSync(genresFilePath, "utf-8");

    if (fileContent.trim() !== "") {
      try {
        // Parse the genres from the file
        genres = JSON.parse(fileContent);
        console.log("Loaded genres from file");
      } catch (err) {
        console.error("Error parsing genres.json: ", err);
      }
    }
  }

  // If the genres file doesn't exist or couldn't be parsed, fetch genres from API
  if (genres.length === 0) {
    const genreResult = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=337833d61a8285a255dd2acaec5306f2`
    );

    if (genreResult.data.genres && genreResult.data.genres.length > 0) {
      // Save the genre IDs and names
      genres = genreResult.data.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      }));

      // Write the genres to a file
      fs.writeFileSync(genresFilePath, JSON.stringify(genres), "utf-8");
      console.log("Fetched genres from API and saved to file");
    } else {
      console.error("Could not fetch genres from API");
    }
  }

  return genres;
});

ipcMain.handle("fetch-metadata", async (event) => {
  if (!fs.existsSync(posterFolder)) {
    fs.mkdirSync(posterFolder);
  }

  const media = JSON.parse(fs.readFileSync(mediaFilePath, "utf-8"));

  let metadata = [];
  if (fs.existsSync(metadataFilePath)) {
    const fileContent = fs.readFileSync(metadataFilePath, "utf-8");
    if (fileContent.trim() !== "") {
      try {
        metadata = JSON.parse(fileContent);
      } catch (err) {
        console.error("Error parsing metadata.json: ", err);
        metadata = [];
      }
    }
  }

  const existingMovieMap = new Map();
  for (let movie of metadata) {
    existingMovieMap.set(movie.id, true);
  }

  // Fetch the genres
  const genres = JSON.parse(fs.readFileSync(genresFilePath, "utf-8"));
  const genreMap = new Map();
  genres.forEach((genre) => {
    genreMap.set(genre.id, genre.name);
  });

  for (let i = 0; i < media.length; i++) {
    console.log(`Processing movie: ${media[i].title}`);

    const searchResult = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=337833d61a8285a255dd2acaec5306f2&query=${encodeURIComponent(
        media[i].title
      )}`
    );
    if (searchResult.data.results && searchResult.data.results.length > 0) {
      const movieId = searchResult.data.results[0].id;

      // If a movie with this ID already exists, skip fetching its data
      if (existingMovieMap.has(movieId)) {
        console.log(`Movie data already exists for ID: ${movieId}`);
        continue;
      }

      console.log(`Fetching details for movie id: ${movieId}`);
      const detailsResult = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=337833d61a8285a255dd2acaec5306f2`
      );

      // Convert genre ids to names
      const genreNames = detailsResult.data.genres.map((genre) => {
        return genreMap.get(genre.id);
      });

      const necessaryData = {
        id: detailsResult.data.id,
        title: detailsResult.data.title,
        overview: detailsResult.data.overview,
        backdrop: detailsResult.data.backdrop_path,
        poster: detailsResult.data.poster_path,
        popularity: detailsResult.data.vote_average,
        release_date: detailsResult.data.release_date,
        duration: detailsResult.data.runtime,
        path: media[i].path,
        genres: genreNames,
      };

      metadata.push(necessaryData);
      console.log(`Added metadata for movie: ${necessaryData.title}`);

      const posterPath = searchResult.data.results[0].poster_path;
      if (posterPath) {
        const posterResult = await axios.get(
          `https://image.tmdb.org/t/p/original${posterPath}`,
          { responseType: "arraybuffer" }
        );
        fs.writeFileSync(
          path.join(posterFolder, `${movieId}.jpg`),
          posterResult.data
        );
      }

      const backdropPath = searchResult.data.results[0].backdrop_path;
      if (backdropPath) {
        const backdropResult = await axios.get(
          `https://image.tmdb.org/t/p/original${backdropPath}`,
          { responseType: "arraybuffer" }
        );
        fs.writeFileSync(
          path.join(posterFolder, `${movieId}_bd.jpg`),
          backdropResult.data
        );
      }
    }
  }

  fs.writeFileSync(metadataFilePath, JSON.stringify(metadata), "utf-8");
  return metadata;
});

ipcMain.handle("get-metadata", async (event) => {
  if (fs.existsSync(metadataFilePath)) {
    try {
      const metadata = JSON.parse(await readFile(metadataFilePath, "utf-8"));
      return metadata;
    } catch (err) {
      console.error(`Error parsing JSON from ${metadataFilePath}:`, err);
      return null;
    }
  }
  return null;
});

ipcMain.handle("get-settings", async (event) => {
  if (fs.existsSync(settingsFilePath)) {
    try {
      const settings = JSON.parse(await readFile(settingsFilePath, "utf-8"));
      return settings;
    } catch (err) {
      console.error(`Error parsing JSON from ${settingsFilePath}:`, err);
      return null;
    }
  }
  return null;
});

ipcMain.handle("fetch-data-by-id", async (event, id) => {
  if (fs.existsSync(metadataFilePath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataFilePath, "utf-8"));

    // Make sure id is a number
    id = Number(id);

    const data = metadata.find((item) => item.id === id);
    console.log("Fetched data:", data);
    return data || null;
  }
  return null;
});

ipcMain.handle("fetch-video-by-id", async (event, id) => {
  if (fs.existsSync(metadataFilePath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataFilePath, "utf-8"));

    id = Number(id);

    const data = metadata.find((item) => item.id === id);
    console.log("Fetched video:", data);

    if (data) {
      const videoUrl = data.path.replace(videoFolder, "/videos");
      return `http://localhost:3000${videoUrl}`;
    }
  }
  return null;
});

ipcMain.handle("search-movies", async (event, searchTerm) => {
  if (fs.existsSync(metadataFilePath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataFilePath, "utf-8"));

    const searchResults = metadata.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Movie search results:", searchResults);
    return searchResults;
  }
  return [];
});

ipcMain.handle("remove-duplicates", async (event) => {
  if (fs.existsSync(metadataFilePath)) {
    let metadata = JSON.parse(fs.readFileSync(metadataFilePath, "utf-8"));

    let titles = new Set();
    metadata = metadata.filter((movie) => {
      if (titles.has(movie.id)) {
        // If the title already exists, it's a duplicate
        return false;
      } else {
        // Otherwise, it's not a duplicate
        titles.add(movie.id);
        return true;
      }
    });

    // Save the filtered metadata back to the file
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata), "utf-8");
  }
});

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1600,
    height: 900,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
    // Start the server with the saved media folder path
    const savedMediaFolderPath = await getSavedMediaFolderPath();
    if (savedMediaFolderPath) {
      startServer(savedMediaFolderPath);
    }
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
