const desktopScenes = [
  {
    id: "slide-1",
    label: "1. The State of Things",
    cubeTargetPosition: { x: 0, y: 0, z: 0 },
    tagTargetPosition: { x: -3.8, y: -0.2, z: -0.6 },
    tagVisible: false,
    titleText: "Rhode Island's Waste at a Glance",
    bodyText:
      "Nearly 70% of what Rhode Islanders throw away ends up in the landfill. The state is falling far short of its own recycling mandates. 29.5% overall diversion rate statewide / 35% is the state-mandated minimum / only 15 of 39 municipalities meet it.",
    tagSide: "left",
    tagLabel: "29.5% diverted",
  },
  {
    id: "slide-2",
    label: "2. Town by Town",
    cubeTargetPosition: { x: 2.25, y: 0.1, z: 0 },
    tagTargetPosition: { x: -2.7, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "Where Your Trash Actually Goes",
    bodyText:
      "Landfill tonnage per household varies dramatically across RI, with a nearly 3x difference between the best and worst performing towns. Johnston: 1.76 tons landfilled per HH / Portsmouth: 0.60 tons / State average: 1.00 ton.",
    tagSide: "left",
    tagLabel: "1.76 tons per HH",
  },
  {
    id: "slide-3",
    label: "3. The Illusion of Recycling",
    cubeTargetPosition: { x: -2.2, y: 0.1, z: 0 },
    tagTargetPosition: { x: 2.7, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "What You Recycle Isn't Always Recycled",
    bodyText:
      "Contaminated recycling loads get rejected entirely and sent to the landfill anyway. Some towns are generating hundreds of pounds of rejected recycling per household. Providence: 648 lbs rejected per HH / Cranston: 257 lbs / Portsmouth, Warren, Charlestown: 0 lbs.",
    tagSide: "right",
    tagLabel: "648 lbs rejected",
  },
  {
    id: "slide-4",
    label: "4. Who's Actually Trying",
    cubeTargetPosition: { x: 2.15, y: 0.15, z: 0 },
    tagTargetPosition: { x: -2.75, y: -0.08, z: -0.4 },
    tagVisible: true,
    titleText: "The Gap Between Best and Worst",
    bodyText:
      "A small number of towns are diverting over half their waste. Most aren't close. The difference often comes down to education programs and infrastructure access. North Kingstown: 55.1% diversion / Providence: 7.8% diversion / Gap of 47 percentage points.",
    tagSide: "left",
    tagLabel: "47-point gap",
  },
  {
    id: "slide-5",
    label: "5. What Happens Next",
    cubeTargetPosition: { x: -2.1, y: 0.12, z: 0 },
    tagTargetPosition: { x: 2.8, y: -0.05, z: -0.4 },
    tagVisible: true,
    titleText: "The Clock Is Running",
    bodyText:
      "At current rates, the Central Landfill reaches capacity in 2046. Better recycling extends that timeline. Here's what you can do in your town. 2046 projected capacity / 29,000 tons of rejected recycling landfilled in 2024.",
    tagSide: "right",
    tagLabel: "2046 capacity",
  },
];

const mobileScenes = [
  {
    id: "slide-1",
    label: "1. The State of Things",
    cubeTargetPosition: { x: 0, y: 0.15, z: 0 },
    tagTargetPosition: { x: 0, y: -1.6, z: -0.5 },
    tagVisible: false,
    titleText: "Rhode Island's Waste at a Glance",
    bodyText:
      "Nearly 70% of what Rhode Islanders throw away ends up in the landfill. The state is falling far short of its own recycling mandates. 29.5% overall diversion rate statewide / 35% is the state-mandated minimum / only 15 of 39 municipalities meet it.",
    tagSide: "left",
    tagLabel: "29.5% diverted",
  },
  {
    id: "slide-2",
    label: "2. Town by Town",
    cubeTargetPosition: { x: 1.1, y: 0.2, z: 0 },
    tagTargetPosition: { x: -1.15, y: -0.7, z: -0.4 },
    tagVisible: true,
    titleText: "Where Your Trash Actually Goes",
    bodyText:
      "Landfill tonnage per household varies dramatically across RI, with a nearly 3x difference between the best and worst performing towns. Johnston: 1.76 tons landfilled per HH / Portsmouth: 0.60 tons / State average: 1.00 ton.",
    tagSide: "left",
    tagLabel: "1.76 tons per HH",
  },
  {
    id: "slide-3",
    label: "3. The Illusion of Recycling",
    cubeTargetPosition: { x: -1.1, y: 0.2, z: 0 },
    tagTargetPosition: { x: 1.15, y: -0.7, z: -0.4 },
    tagVisible: true,
    titleText: "What You Recycle Isn't Always Recycled",
    bodyText:
      "Contaminated recycling loads get rejected entirely and sent to the landfill anyway. Some towns are generating hundreds of pounds of rejected recycling per household. Providence: 648 lbs rejected per HH / Cranston: 257 lbs / Portsmouth, Warren, Charlestown: 0 lbs.",
    tagSide: "right",
    tagLabel: "648 lbs rejected",
  },
  {
    id: "slide-4",
    label: "4. Who's Actually Trying",
    cubeTargetPosition: { x: 1.05, y: 0.24, z: 0 },
    tagTargetPosition: { x: -1.2, y: -0.68, z: -0.4 },
    tagVisible: true,
    titleText: "The Gap Between Best and Worst",
    bodyText:
      "A small number of towns are diverting over half their waste. Most aren't close. The difference often comes down to education programs and infrastructure access. North Kingstown: 55.1% diversion / Providence: 7.8% diversion / Gap of 47 percentage points.",
    tagSide: "left",
    tagLabel: "47-point gap",
  },
  {
    id: "slide-5",
    label: "5. What Happens Next",
    cubeTargetPosition: { x: -1.05, y: 0.22, z: 0 },
    tagTargetPosition: { x: 1.2, y: -0.68, z: -0.4 },
    tagVisible: true,
    titleText: "The Clock Is Running",
    bodyText:
      "At current rates, the Central Landfill reaches capacity in 2046. Better recycling extends that timeline. Here's what you can do in your town. 2046 projected capacity / 29,000 tons of rejected recycling landfilled in 2024.",
    tagSide: "right",
    tagLabel: "2046 capacity",
  },
];

export function getScenes(isMobile = false) {
  return isMobile ? mobileScenes : desktopScenes;
}
