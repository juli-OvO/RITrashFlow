const desktopScenes = [
  {
    id: "slide-1",
    label: "slide 1",
    cubeTargetPosition: { x: 0, y: 0, z: 0 },
    tagTargetPosition: { x: -3.8, y: -0.2, z: -0.6 },
    tagVisible: false,
    titleText: "Making Waste Visible",
    bodyText:
      "A large placeholder cube anchors the opening frame. Replace it later with a garment or another hero object.",
    tagSide: "left",
    tagLabel: "— placeholder —",
  },
  {
    id: "slide-2",
    label: "slide 2",
    cubeTargetPosition: { x: 2.25, y: 0.1, z: 0 },
    tagTargetPosition: { x: -2.7, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "slide 2",
    bodyText:
      "The cube moves right while the tag appears on the opposite side. Use this pattern for editorial pairings of object and annotation.",
    tagSide: "left",
    tagLabel: "— placeholder —",
  },
  {
    id: "slide-3",
    label: "slide 3",
    cubeTargetPosition: { x: -2.2, y: 0.1, z: 0 },
    tagTargetPosition: { x: 2.7, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "slide 3",
    bodyText:
      "Alternating compositions help the story feel paced rather than static. Edit positions here to tune the sequence.",
    tagSide: "right",
    tagLabel: "— placeholder —",
  },
  {
    id: "slide-4",
    label: "slide 4",
    cubeTargetPosition: { x: 2.15, y: 0.15, z: 0 },
    tagTargetPosition: { x: -2.75, y: -0.08, z: -0.4 },
    tagVisible: true,
    titleText: "slide 4",
    bodyText:
      "This starter keeps the motion quiet and measured. Replace the placeholder text and targets with your actual narrative later.",
    tagSide: "left",
    tagLabel: "— placeholder —",
  },
  {
    id: "slide-5",
    label: "slide 5",
    cubeTargetPosition: { x: -2.1, y: 0.12, z: 0 },
    tagTargetPosition: { x: 2.8, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "slide 5",
    bodyText:
      "The last section repeats the alternating layout so the structure stays predictable while the content changes.",
    tagSide: "right",
    tagLabel: "— placeholder —",
  },
];

const mobileScenes = [
  {
    id: "slide-1",
    label: "slide 1",
    cubeTargetPosition: { x: 0, y: 0.15, z: 0 },
    tagTargetPosition: { x: 0, y: -1.6, z: -0.5 },
    tagVisible: false,
    titleText: "Making Waste Visible",
    bodyText:
      "A large placeholder cube anchors the opening frame. Replace it later with a garment or another hero object.",
    tagSide: "left",
    tagLabel: "— placeholder —",
  },
  {
    id: "slide-2",
    label: "slide 2",
    cubeTargetPosition: { x: 1.1, y: 0.2, z: 0 },
    tagTargetPosition: { x: -1.15, y: -0.7, z: -0.4 },
    tagVisible: true,
    titleText: "slide 2",
    bodyText:
      "The cube moves right while the tag appears on the opposite side. Use this pattern for editorial pairings of object and annotation.",
    tagSide: "left",
    tagLabel: "— placeholder —",
  },
  {
    id: "slide-3",
    label: "slide 3",
    cubeTargetPosition: { x: -1.1, y: 0.2, z: 0 },
    tagTargetPosition: { x: 1.15, y: -0.7, z: -0.4 },
    tagVisible: true,
    titleText: "slide 3",
    bodyText:
      "Alternating compositions help the story feel paced rather than static. Edit positions here to tune the sequence.",
    tagSide: "right",
    tagLabel: "— placeholder —",
  },
  {
    id: "slide-4",
    label: "slide 4",
    cubeTargetPosition: { x: 1.05, y: 0.24, z: 0 },
    tagTargetPosition: { x: -1.2, y: -0.68, z: -0.4 },
    tagVisible: true,
    titleText: "slide 4",
    bodyText:
      "This starter keeps the motion quiet and measured. Replace the placeholder text and targets with your actual narrative later.",
    tagSide: "left",
    tagLabel: "— placeholder —",
  },
  {
    id: "slide-5",
    label: "slide 5",
    cubeTargetPosition: { x: -1.05, y: 0.22, z: 0 },
    tagTargetPosition: { x: 1.2, y: -0.68, z: -0.4 },
    tagVisible: true,
    titleText: "slide 5",
    bodyText:
      "The last section repeats the alternating layout so the structure stays predictable while the content changes.",
    tagSide: "right",
    tagLabel: "— placeholder —",
  },
];

export function getScenes(isMobile = false) {
  return isMobile ? mobileScenes : desktopScenes;
}
