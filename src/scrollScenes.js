const desktopScenes = [
  {
    id: "slide-1",
    label: "1. Section One",
    cubeTargetPosition: { x: 0, y: 0, z: 0 },
    tagTargetPosition: { x: -3.8, y: -0.2, z: -0.6 },
    tagVisible: false,
    titleText: "Title One",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "left",
    tagLabel: "Label A",
  },
  {
    id: "slide-2",
    label: "2. Section Two",
    cubeTargetPosition: { x: 2.25, y: 0.1, z: 0 },
    tagTargetPosition: { x: -2.7, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "Title Two",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "left",
    tagLabel: "Label B",
  },
  {
    id: "slide-3",
    label: "3. Section Three",
    cubeTargetPosition: { x: -2.2, y: 0.1, z: 0 },
    tagTargetPosition: { x: 2.7, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "Title Three",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "right",
    tagLabel: "Label C",
  },
  {
    id: "slide-4",
    label: "4. Section Four",
    cubeTargetPosition: { x: 2.15, y: 0.15, z: 0 },
    tagTargetPosition: { x: -2.75, y: -0.08, z: -0.4 },
    tagVisible: true,
    titleText: "Title Four",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "left",
    tagLabel: "Label D",
  },
  {
    id: "slide-5",
    label: "5. Section Five",
    cubeTargetPosition: { x: -2.1, y: 0.12, z: 0 },
    tagTargetPosition: { x: 2.8, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "Title Five",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "right",
    tagLabel: "Label E",
  },
];

const mobileScenes = [
  {
    id: "slide-1",
    label: "1. Section One",
    cubeTargetPosition: { x: 0, y: 0.15, z: 0 },
    tagTargetPosition: { x: 0, y: -1.6, z: -0.5 },
    tagVisible: false,
    titleText: "Title One",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "left",
    tagLabel: "Label A",
  },
  {
    id: "slide-2",
    label: "2. Section Two",
    cubeTargetPosition: { x: 1.1, y: 0.2, z: 0 },
    tagTargetPosition: { x: -1.15, y: -0.7, z: -0.4 },
    tagVisible: true,
    titleText: "Title Two",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "left",
    tagLabel: "Label B",
  },
  {
    id: "slide-3",
    label: "3. Section Three",
    cubeTargetPosition: { x: -1.1, y: 0.2, z: 0 },
    tagTargetPosition: { x: 1.15, y: -0.7, z: -0.4 },
    tagVisible: true,
    titleText: "Title Three",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "right",
    tagLabel: "Label C",
  },
  {
    id: "slide-4",
    label: "4. Section Four",
    cubeTargetPosition: { x: 1.05, y: 0.24, z: 0 },
    tagTargetPosition: { x: -1.2, y: -0.68, z: -0.4 },
    tagVisible: true,
    titleText: "Title Four",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "left",
    tagLabel: "Label D",
  },
  {
    id: "slide-5",
    label: "5. Section Five",
    cubeTargetPosition: { x: -1.05, y: 0.22, z: 0 },
    tagTargetPosition: { x: 1.2, y: -0.68, z: -0.4 },
    tagVisible: true,
    titleText: "Title Five",
    bodyText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    tagSide: "right",
    tagLabel: "Label E",
  },
];

export function getScenes(isMobile = false) {
  return isMobile ? mobileScenes : desktopScenes;
}
