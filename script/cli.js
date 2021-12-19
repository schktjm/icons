require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");

const baseUrl = "https://api.figma.com/v1/";
const figmaToken = process.env.FIGMA_TOKEN;
const fileId = "YhHWg9mZ6GdKkseHAAS1gw";

const getComponentIds = async () => {
  try {
    const res = await fetch(`${baseUrl}files/${fileId}`, {
      headers: {
        "X-Figma-Token": figmaToken,
      },
    });
    const data = await res.json();
    const { components } = data;
    return components;
  } catch (error) {
    throw error;
  }
};

const getImageLinks = async (component) => {
  try {
    const componentKeys = Object.keys(component).join();
    const res = await fetch(
      `${baseUrl}images/${fileId}?ids=${componentKeys}&format=svg`,
      {
        headers: {
          "X-Figma-Token": figmaToken,
        },
      }
    );
    const data = await res.json();
    const images = Object.keys(component).map((key) => {
      const { name } = component[key];
      const link = data.images[key];
      return { name, link };
    });

    return images;
  } catch (error) {
    throw error;
  }
};

const downloadImages = async ({ link, name }) => {
  const res = await fetch(link);
  const data = await res.buffer();
  fs.writeFileSync(`../src/${name}.svg`, data);
};

const main = async () => {
  const component = await getComponentIds();
  const images = await getImageLinks(component);
  images.forEach(async (image) => {
    await downloadImages(image);
  });
};

main();
